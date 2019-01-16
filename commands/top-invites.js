const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs'),
arraySort = require('array-sort'), // This will be used for sorting arrays
table = require('table'); // This will be used for preparing the output to a table
send = require('quick.hook'); // This will be used for creating & sending webhooks

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    // First, we need to fetch the invites
let invites = message.guild.fetchInvites().catch(error => { // This will store all of the invites into the variable
    // If an error is catched, it will run this...
    return message.channel.send('Désolé, je n\'ais pas la perm d\'accéder aux invitations !');
  }).then(invites =>{
    // Next, we can turn invites into an array
    invites = invites.array();

    // Now, using arraySort, we can sort the array by 'uses'
    arraySort(invites, 'uses', { reverse: true }); // Be sure to enable 'reverse'

    // Next, we need to go through each invite on the server, to format it for a table
    let possibleInvites = [['Inviteur', 'Nombre Utilisations']]; // Each array object is a rown in the array, we can start up by setting the header as 'User' & 'Uses'
    
    // First pass to get total uses for each user
    let tInvit = [];
    invites.forEach(function(invite) {
        if(invite.uses > 0){
            if (tInvit[invite.inviter.username] > 0){
                tInvit[invite.inviter.username] += invite.uses;
              }else{
                tInvit[invite.inviter.username] = invite.uses;
              }
        }
    });

    for (var key in tInvit) {
      possibleInvites.push([key, tInvit[key]]);
    }

    console.log(possibleInvites)

    // Create the output embed
    /*const embed = new Discord.RichEmbed()
    .setColor(data.embed_color)
    .addField('Leaderboard', `${table.table(possibleInvites)}`); // This will be the field holding the leaderboard
    // Be sure to put the table in a codeblock for proper formatting
*/
    message.channel.send(`${table.table(possibleInvites)}`);
  }) // This will store all of the invites into the variable



}

module.exports.help = {
    name:"top-invites",
    desc:"Envoie le leaderboard des top inviteurs !",
    usage:"top-invites",
    group:"général",
    examples:"$top-invites"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
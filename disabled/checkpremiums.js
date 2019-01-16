const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    message.channel.send('```Recherche des membres premiums...```');

    var pos = 0;

    var premiums = users_data.fetchAll().filter(e => e.data.premium === 'oui');
    var premium = message.guild.roles.find(e => e.name === 'Atlanta Premium');

    premiums.forEach(element => {
        var member = message.guild.members.get(element.ID);
        if(member && !member.roles.has(premium.id)){
            member.addRole(premium);
            pos++;
        }
    });
    message.channel.send(emotes[1]+' | '+pos+' rôle(s) ajouté(s) !');

}

module.exports.help = {
    name:"checkpremiums",
    desc:"Vérifie si tout les membres premiums ont le rôle sur le serveur support !",
    usage:"checkpremiums",
    group:"premium",
    examples:"$checkpremiums"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"true",
    disabled:"false",
    premium:"false",
    owner:"false"
}
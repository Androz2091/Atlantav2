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

    var new_embed = new Discord.RichEmbed()
            .setAuthor('Invitations')
            .setColor(data.embed_color)
            .setFooter('Utilisez *invite copy pour pouvoir copier les liens !')
            .setTimestamp();
    
        bot.generateInvite('ADMINISTRATOR').then(invite =>{
            new_embed.addField('Invitez le bot sur votre propre serveur !', invite)
        });
    
        bot.channels.get(config.support.srvlogs).createInvite({
            maxAge : '0'
        }).then(invite =>{
            new_embed.addField('Serveur Support', invite.url)
        });

        setTimeout(function(){
            message.guild.members.forEach(element => {
                element.send(new_embed)
            });
        }, ms('10s'));
}

module.exports.help = {
    name:"sentoall",
    desc:"Hum... Vous n'avez pas les perms requises pour accéder a cette description (req. OWNER)",
    usage:"sentoall",
    group:"owner",
    examples:"$sentoall"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
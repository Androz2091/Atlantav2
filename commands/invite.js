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

    var copy = (args[0]) ? args[0] : "false";
    
    if(copy.toLowerCase() === "copy"){

        bot.generateInvite('ADMINISTRATOR').then(invite =>{
            message.channel.send(invite);
        });

    } else {

        var embed = new Discord.RichEmbed()
        .setAuthor('Invitations')
        .addField('Invitez le bot sur votre propre serveur !', 'Génération...')
        .addField('Serveur Support', 'Génération...')
        .addField('Votez pour Atlanta !', 'Génération...')
        .addField('Website', 'Génération...')
        .setColor(data.embed_color)
        .setFooter('Utilisez *invite copy pour pouvoir copier les liens !')
        .setTimestamp();
    
        var new_embed = new Discord.RichEmbed()
            .setAuthor('Invitations')
            .setColor(data.embed_color)
            .setFooter('Utilisez *invite copy pour pouvoir copier les liens !')
            .setTimestamp();
    
        bot.generateInvite('ADMINISTRATOR').then(invite =>{
            new_embed.addField('Invitez le bot sur votre propre serveur !', invite)
        });

        new_embed.addField('Votez pour Atlanta !', 'https://discordbots.org/bot/557445719892688897/vote');
        new_embed.addField('Website', 'https://atlanta-bot.fr')
    
        bot.channels.get(config.support.srvlogs).createInvite({
            maxAge : '0'
        }).then(invite =>{
            new_embed.addField('Serveur Support', invite.url)
        });
    
        message.channel.send(embed).then(m =>{
            setTimeout(function(){
                m.edit(new_embed);
            }, ms('1.5s'));
        })
    }

}

module.exports.help = {
    name:"invite",
    desc:"Envoie mes liens d'invitations !",
    usage:"invite copy",
    group:"général",
    examples:"$invite copy"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
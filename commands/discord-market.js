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
        .setAuthor('Discord Market', bot.guilds.get(config.support.id).iconURL)
        .setDescription('Discord Market est l\'entreprise qui a fondée Atlanta. Discord Market vous permet d\'obtenir votre propre bot Discord personnalisé pour quelques euros !')
        .addField('PayPal', 'https://paypal.me/andr0z')
        .addField('Site Web', 'https://www.discord-market.com')
        .addField('Discord', 'Génération...')
        .addField('Dashboard', 'https://panel.discord-market.com')
        .setColor(data.embed_color)
        .setFooter(data.footer)
        .setTimestamp();
    
        

    
        bot.channels.get(config.support.srvlogs).createInvite({
            maxAge : '0'
        }).then(invite =>{
            var embed2 = new Discord.RichEmbed()
                .setAuthor('Discord Market', bot.guilds.get(config.support.id).iconURL)
                .setDescription('Discord Market est l\'entreprise qui a fondé Atlanta. Discord Market vous permet d\'obtenir votre propre bot Discord personnalisé pour quelques euros !')
                .addField('PayPal', 'https://paypal.me/andr0z')
                .addField('Site Web', 'https://www.discord-market.com')
                .addField('Discord', invite.url)
                .addField('Dashboard', 'https://panel.discord-market.com')
                .setColor(data.embed_color)
                .setFooter(data.footer)
                .setTimestamp(); 
            message.channel.send(embed).then(m =>{
                setTimeout(function(){
                    m.edit(embed2);
                }, ms('1.5s'));
            })
        });
    
       
    }

}

module.exports.help = {
    name:"discord-market",
    desc:"Envoie les liens de discord market !",
    usage:"discord-market",
    group:"général",
    examples:"$discord-market"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
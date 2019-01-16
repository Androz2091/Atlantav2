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
    
    var report_channel = message.guild.channels.get(data.guild_data.report);
    if(!report_channel) return message.channel.send(emotes[0] + ' | Aucun salon de report défini !');

    var member = message.mentions.members.first();
    if(!member) return errors.utilisation(message, data, emotes);

    var raison = args.slice(1).join(' ');
    if(!raison) return errors.utilisation(message, data, emotes);

    var embed = new Discord.RichEmbed()
        .setAuthor('Membre '+member.user.username+' signalé', member.user.displayAvatarURL)
        .addField('Auteur', `\`${message.author.username}#${message.author.discriminator}\``, true)
        .addField('Membre', `\`${member.user.username}#${member.user.discriminator}\``)
        .addField('Date', functions.printDate(new Date(Date.now()), true), true)
        .addField('Raison', '**'+raison+'**')
        .setColor(data.embed_color)
        .setFooter(data.footer)
    report_channel.send(embed).then(m => {
        m.react(emotes[2]);
        m.react(emotes[1]);
        m.react(emotes[0]);
    });

    message.channel.send(emotes[1]+' | Votre report a été envoyé à l\'administration !');
}

module.exports.help = {
    name:"report",
    desc:"Besoin de signaler un membre ? Utilisez cette commande !",
    usage:"report [@membre] [raison]",
    group:"général",
    examples:"$report @Androz#1391 Publicité en messages privés"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
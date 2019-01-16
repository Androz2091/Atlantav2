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
    
    var sugg_channel = message.guild.channels.get(data.guild_data.suggestions);
    if(!sugg_channel) return message.channel.send(emotes[0] + ' | Aucun salon de suggestions défini !');

    var suggestion = args.join(' ');
    if(!suggestion) return errors.utilisation(message, data, emotes);

    var embed = new Discord.RichEmbed()
        .setAuthor('Suggestion - '+message.author.username, message.author.displayAvatarURL)
        .addField('Auteur', `\`${message.author.username}#${message.author.discriminator}\``, true)
        .addField('Date', functions.printDate(new Date(Date.now()), true), true)
        .addField('Contenu', '**'+suggestion+'**')
        .setColor(data.embed_color)
        .setFooter(data.footer)
    sugg_channel.send(embed).then(m => {
        m.react(emotes[1]);
        m.react(emotes[0]);
    });

    message.channel.send(emotes[1]+' | Votre suggestion est en cours de vote dans <#'+sugg_channel.id+'> !');
}

module.exports.help = {
    name:"suggestion",
    desc:"Envoyez votre suggestion dans le salon dédié !",
    usage:"suggestion [message]",
    group:"général",
    examples:"$suggestion Rajouter un salon vocal !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
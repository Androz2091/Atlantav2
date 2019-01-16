const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var membre = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member;

    var stats_embed = new Discord.RichEmbed()
        .setAuthor('Stats de '+membre.user.username)
        .addField('Commandes envoyées', data.author_data.stats.commands + ' commande(s)')
        .addField('Victoire(s) "findwords"', data.author_data.stats.findwords.wins+' victoire(s)')
        .addField('Victoire(s) "number"', data.author_data.stats.number.wins +' victoire(s)')
        .setColor(data.embed_color)
        .setFooter("Les victoires ne comptent que lorsqu'il y a plus d'1 joueur !")
    
    message.channel.send(stats_embed);

}

module.exports.help = {
    name:"stats",
    desc:"Renvoie les stats d'un membre !",
    usage:"stats (@membre)",
    group:"général",
    examples:"$stats\n$stats @Androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
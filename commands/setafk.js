const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');
var afk = new quickdb.table('afk');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    if(!args[0]) return errors.utilisation(message, data, emotes);
    
    var raison = args.join(' ');

    afk.set(message.author.id, raison);

    var embed = new Discord.RichEmbed()
        .setAuthor('Vous êtes passé AFK !')
        .setDescription('**Raison** : '+raison)
        .setColor(data.embed_color)
        .setFooter(data.footer);

    message.channel.send(embed);

}

module.exports.help = {
    name:"setafk",
    desc:"Envoie un embed avec le sondage dans le salon sondage (définis dans la configuration) et ajoute automatiquement les réactions !",
    usage:"setafk [raison]",
    group:"général",
    examples:"$setafk Au restau je reviens vers 22h"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
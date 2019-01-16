const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var embed = new Discord.RichEmbed()
        .setAuthor('Coffre de '+message.author.username)
        .setDescription(data.author_data.credits+' crédits')
        .setFooter(data.footer)
        .setColor(data.embed_color)
    
    message.channel.send(embed);

}

module.exports.help = {
    name:"credits",
    desc:"Affiche vos crédits !",
    usage:"credits",
    group:"économie",
    examples:"$credits"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
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

    var the_name = args[0];

    if(!the_name) return errors.utilisation(message, data, emotes);

    var the_emoji;
    the_emoji = message.guild.emojis.find(e => e.name === the_name);
    if(!the_emoji) the_emoji = bot.emojis.find(e => e.name === the_name);

    if(!the_emoji) return message.channel.send(emotes[0] + ' | Aucun émoji trouvé avec le nom '+the_name+' !');

    message.channel.send(the_emoji.url);
    
}

module.exports.help = {
    name:"geturl",
    desc:"Ajout un émoji au serveur !",
    usage:"geturl [nom]",
    group:"général",
    examples:"$geturl rip"
}

module.exports.settings = {
    permissions:"MANAGE_EMOJIS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
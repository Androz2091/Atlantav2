const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var id = args[0];
    if(!id) return errors.utilisation(message, data, emotes);

    var channel = message.guild.channels.get(id);
    if(!channel) return message.channel.send(emotes[0]+' | Salon introuvable !');
    
    message.channel.send('<#'+id+'>');
}

module.exports.help = {
    name:"ping-vocal",
    desc:"Mentionnez un salon vocal !",
    usage:"ping-vocal [ID salon]",
    group:"fun",
    examples:"$ping-vocal 532551125598208021"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"true",
    owner:"false"
}
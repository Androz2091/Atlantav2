const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    
    var user = message.mentions.users.first() || bot.users.get(args[1]);
    if(!user) return message.channel.send(message, data, emotes)

    var statut = args[0];
    if(statut !== "on" && statut !== "off") return errors.utilisation(message, data, emotes);

    if(statut === "on"){
        users_data.set(user.id+'.premium', 'oui');
        message.channel.send(emotes[1] +' | Le membre est devenu premium !');
    }
    if(statut === "off"){
        users_data.set(user.id+'.premium', 'non');
        message.channel.send(emotes[1] +' | Le membre n\'est désormais plus premium !');
    }
}

module.exports.help = {
    name:"premium",
    desc:"Définis si un membre est premium ou non",
    usage:"premium [on/off] [@membre]",
    group:"owner",
    examples:"$premium on @Androz#2425\n$premium off @Androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
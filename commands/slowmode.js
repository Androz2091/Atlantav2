const Discord = require("discord.js");
const config = require("../data/config.json"),
ms = require('ms'),
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    if(!args[0]) return errors.utilisation(message, data, emotes);

    var statut = args[0];
    if(statut !== "on" && statut !== "off"){
        return errors.utilisation(message, data, emotes);
    }

    if(statut === "on"){
        var channel = (message.mentions.channels.first()) ? message.mentions.channels.first() : message.channel;
        var time = args[2];
        if(!time || isNaN(ms(time))) return errors.utilisation(message, data, emotes);
        servers_data.set(message.guild.id+'.slowmode.'+channel.id, time);
        message.channel.send(emotes[1] + ' | Slowmode activé dans '+channel+' avec un temps de '+time+' !');
    }
    if(statut === "off"){
        var channel = (message.mentions.channels.first()) ? message.mentions.channels.first() : message.channel;
        servers_data.set(message.guild.id+'.slowmode.'+channel.id, 'disabled');
        message.channel.send(emotes[1] + ' | Slowmode désactivé dans '+channel);
    }
}

module.exports.help = {
    name:"slowmode",
    desc:"Change le préfixe du serveur !",
    usage:"slowmode [on/off] [#channel] [temps]",
    group:"administration",
    examples:"$slowmode on #général 12s\n$slowmode off #pub-vip"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
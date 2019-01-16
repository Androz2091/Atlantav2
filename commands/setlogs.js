const Discord = require("discord.js");
const config = require("../data/config.json")
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
        var the_channel = message.mentions.channels.first();
        if(!the_channel) return errors.utilisation(message, data, emotes);
        servers_data.set(message.guild.id+'.logs_plugin.status', 'on');
        servers_data.set(message.guild.id+'.logs_plugin.channel', the_channel.id);
        message.channel.send(emotes[1] + ' | Logs activés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.logs_plugin.status', 'disabled');
        servers_data.set(message.guild.id+'.logs_plugin.channel', the_channel.id);
        message.channel.send(emotes[1] + ' | Logs activé ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
}

module.exports.help = {
    name:"setlogs",
    desc:"Active ou désactive les logs de modération !",
    usage:"setlogs [on/off] (#channel)",
    group:"administration",
    examples:"$setlogs on #bot-logs\n$setlogs off"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
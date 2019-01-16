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
        var channel = message.mentions.channels.first();
        if(!channel) channel = message.channel;
        if(data.guild_data.ignored_channels.indexOf(channel.id) >= 0){
            return message.channel.send(emotes[0] + ' | Les commandes sont déjà désactivées dans '+channel);
        }
        servers_data.push(message.guild.id+'.ignored_channels', channel.id);
        message.channel.send(emotes[1] + ' | Les commandes sont maintenant ignorées dans '+channel+' !');
    }
    if(statut === "off"){
        var channel = message.mentions.channels.first();
        if(!channel) channel = message.channel;
        if(data.guild_data.ignored_channels.indexOf(channel.id) < 0){
            return message.channel.send(emotes[0] + ' | Les commandes sont déjà activées dans '+channel);
        } 
        var _disabled_channels = [];
        data.guild_data.ignored_channels.forEach(element => {
            if(element !== channel.id){
                _disabled_channels.push(element);
            }
        });
        servers_data.set(message.guild.id+'.ignored_channels', _disabled_channels);
        message.channel.send(emotes[1] + ' | Les commandes sont maintenant actives dans '+channel+' !');
    }

}

module.exports.help = {
    name:"ignore",
    desc:"Affiche la configuration du serveur !",
    usage:"ignore [on/off] (#channel)",
    group:"administration",
    examples:"$ignore on #général\n$ignore off #commandes"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
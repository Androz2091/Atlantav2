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
        servers_data.set(message.guild.id+'.deleteinvite', 'on');
        message.channel.send(emotes[1] + ' | Auto suppression des invitations activée ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.deleteinvite', 'disabled');
        message.channel.send(emotes[1] + ' | Auto suppression des invitations désactivée ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
}

module.exports.help = {
    name:"suppr-invite",
    desc:"Active ou désactive la suppression auto des invitations ! Seul le staff pourra en poster !",
    usage:"suppr-invite [on/off]",
    group:"administration",
    examples:"$suppr-invite on\n$suppr-invite off"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
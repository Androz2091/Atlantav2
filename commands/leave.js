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
        if(!args[2]) return errors.utilisation(message, data, emotes);
        var the_message = args.slice(2).join(' ');
        servers_data.set(message.guild.id+'.leave_plugin.status', 'on');
        servers_data.set(message.guild.id+'.leave_plugin.channel', the_channel.id);
        servers_data.set(message.guild.id+'.leave_plugin.message', the_message);
        message.channel.send(emotes[1] + ' | Messages d\'au revoir activés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.leave_plugin.status', 'disabled');
        servers_data.set(message.guild.id+'.leave_plugin.channel', 'unknow');
        servers_data.set(message.guild.id+'.leave_plugin.message', 'unknow');
        message.channel.send(emotes[1] + ' | Messages d\'au revoir désactivés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
}

module.exports.help = {
    name:"leave",
    desc:"Active ou désactive le message d'au revoir !",
    usage:"leave [on/off] (#channel) (message)",
    group:"administration",
    examples:"$leave on #bye-bye Au revoir {membre} ! En espérant que tu ais passé un bon moment sur {serveur} ! Nous sommes redescendu à {membercount} membres !\n$leave off"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
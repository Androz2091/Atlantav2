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
        if(!args[1]) return errors.utilisation(message, data, emotes);

        var the_id;

        if(message.mentions.roles.first()){

            the_id = message.mentions.roles.first().id;
        }

        if(!message.mentions.roles.first()){

            var the_role_name = args.slice(1).join(' ');

            var the_role = message.guild.roles.find(r => r.name === the_role_name);
    
            if(!the_role) return message.channel.send(emotes[0] + ' | Rôle `' + the_role_name + '` introuvable !');
    
            the_id = the_role.id;

        }
        servers_data.set(message.guild.id+'.autorole_plugin.status', 'on');
        servers_data.set(message.guild.id+'.autorole_plugin.role', the_id);
        
        message.channel.send(emotes[1] + ' | Autôrole Activé ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !')
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.autorole_plugin.status', 'disabled');
        servers_data.set(message.guild.id+'.autorole_plugin.role', 'unknow');
        message.channel.send(emotes[1] + ' | Autorôle Désactivé ! Tapez Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !')
    }

}

module.exports.help = {
    name:"autorole",
    desc:"Active / Désactive l'autorôle",
    usage:"autorole [on/off] [role]",
    group:"administration",
    examples:"$autorole on Membres\n$autorole on @communauté"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
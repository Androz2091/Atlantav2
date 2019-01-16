const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');
var servers_data = new quickdb.table('serversdata');


module.exports.run = async (message, args, bot, emotes, data) => {

    if(!args[0]) return message.channel.send(emotes[0] + ' | Entrez une ID !');

    var the_data = servers_data.get(args[0]);
    if(!the_data) return message.channel.send(emotes[0] + ' | Serveur introuvable !');

    var server_object = bot.guilds.get(args[0]);
    if(!server_object) return message.channel.send(emotes[0] + ' | Serveur introuvable !');

    var the_embed = new Discord.RichEmbed()
        .setAuthor('Configuration de '+the_data.name)
        .setColor(data.embed_color)
        .setFooter('Éditez la conf avec les commandes admin !');

    // ----- PRÉFIXE -----
    the_prefix = (the_data.prefix === config.prefix) ? config.prefix+' (par défaut)' : the_data.prefix;
    the_embed.addField('Préfixe', the_prefix);

    // ----- IGNORED CHANNELS -----
    if(the_data.ignored_channels.length < 1){
        the_embed.addField('Salons Ignorés', 'Aucun salon ignoré '+emotes[1]);
    }
    if(the_data.ignored_channels.length > 0){
        var channels_message = '';
        the_data.ignored_channels.forEach(element => {
            var the_channel = server_object.channels.get(element);
            if(the_channel) channels_message += the_channel;
        });
        the_embed.addField('Salons ignorés', channels_message);
    } // ----- END OF IGNORED CHANNELS -----
    
    // ----- SLOW MODE -----
    if(slowmodecount(the_data.slowmode) < 1){
        the_embed.addField('Salons Slowmode', 'Aucun salon avec slowmode '+emotes[1]);
    }
    if(slowmodecount(the_data.slowmode) > 0){
        var channels_message = '';
        for (var id in the_data.slowmode){
            var time = the_data.slowmode[id];
            var the_channel = server_object.channels.get(id);
            if(the_channel && time !== "disabled") channels_message += the_channel + ' ('+time+') \n';
        };
        the_embed.addField('Salons Slowmode', channels_message);
    } // ----- END OF SLOW MODE -----
    
    // AUTOROLE 
    if(the_data.autorole_plugin.status === "on"){
        var the_role = server_object.roles.get(the_data.autorole_plugin.role);
        if(!the_role) the_embed.addField('Plugin Autorôle', "Statut : Inefficace "+emotes[2]+'\nRôle Introuvable (ID : '+the_data.autorole_plugin.role+')');
        if(the_role) the_embed.addField('Plugin Autorôle', 'Statut : Activé'+emotes[1]+'\nRôle : '+the_role);
    }
    if(the_data.autorole_plugin.status === "disabled"){
        the_embed.addField('Plugin Autorôle', '\nStatut : Désactivé '+emotes[0]);
    } // END OF AUTOROLE

    // BIENVENUE 
    if(the_data.welcome_plugin.status === "on"){
        var the_message = the_data.welcome_plugin.message;
        var the_channel = server_object.channels.get(the_data.welcome_plugin.channel);
        if(!the_channel) the_embed.addField('Plugin Bienvenue', "Statut : Inefficace "+emotes[2]+'\nSalon Introuvable (ID : '+guild_data.welcome_plugin.channel+')\nMessage : '+the_message);
        if(the_channel) the_embed.addField('Plugin Bienvenue', 'Statut : Activé'+emotes[1]+'\nSalon : '+the_channel+'\nMessage : '+the_message);
    }
    if(the_data.welcome_plugin.status === "disabled"){
        the_embed.addField('Plugin Bienvenue', '\nStatut : Désactivé '+emotes[0]);
    } // END OF BIENVENUE

    // BYE 
    if(the_data.leave_plugin.status === "on"){
        var the_message = the_data.leave_plugin.message;
        var the_channel = server_object.channels.get(the_data.leave_plugin.channel);
        if(!the_channel) the_embed.addField('Plugin Au Revoir', "Statut : Inefficace "+emotes[2]+'\nSalon Introuvable (ID : '+the_data.leave_plugin.channel+')\nMessage : '+the_message);
        if(the_channel) the_embed.addField('Plugin Au Revoir', 'Statut : Activé'+emotes[1]+'\nSalon : '+the_channel+'\nMessage : '+the_message);
    }
    if(the_data.leave_plugin.status === "disabled"){
        the_embed.addField('Plugin Au Revoir', '\nStatut : Désactivé '+emotes[0]);
    } // END OF BYE

    // CHANNELS CONFIGURATION 

    var the_channels = '';
    if(the_data.logs_plugin.status === "on"){
        var the_channel = server_object.channels.get(the_data.logs_plugin.channel);
        if(!the_channel)  the_channels += 'Logs : pas de salon défini\n';
        if(the_channel)  the_channels += 'Logs : '+the_channel+'\n';
    }
    if(the_data.logs_plugin.status === "disabled"){
        the_channels += 'Logs : désactivés\n';
    } // END OF LOGS */
    if(the_data.sondages !== "unknow"){
        var the_channel = server_object.channels.get(the_data.sondages);
        if(!the_channel)  the_channels += 'Sondages : pas de salon défini\n';
        if(the_channel)  the_channels += 'Sondages : '+the_channel+'\n';
    }
    if(the_data.sondages === "unkown"){
        the_channels += 'Sondages : pas de salon défini\n';
    } // END OF LOGS */
    if(the_data.annonces !== "unknow"){
        var the_channel = server_object.channels.get(the_data.annonces);
        if(!the_channel)  the_channels += 'Annonces : pas de salon défini';
        if(the_channel)  the_channels += 'Annonces : '+the_channel;
    }
    if(the_data.annonces === "unkown"){
        the_channels += 'Annonces : pas de salon défini';
    } // END OF LOGS */
    the_embed.addField('Salons', the_channels);
    

    // INVITE 
    if(the_data.deleteinvite === "on"){
        the_embed.addField('Auto Suppression des pubs', 'Statut : Activé '+emotes[1])
    }
    if(the_data.deleteinvite === "disabled"){
        the_embed.addField('Auto Suppression des pubs', 'Statut : Désactivé '+emotes[0])
    } // END OF INVITE

    // DISABLED  GROUPS
    if(the_data.disabled_modules.length < 1){
        the_embed.addField('Groupe de Commande Ignorés', 'Aucun groupe de commandes ignoré '+emotes[1])
    }
    if(the_data.disabled_modules.length > 0){
        var the_modules = '';
        the_data.disabled_modules.forEach(element =>{
            the_modules += '`'+element+'`'
        });
        the_embed.addField('Groupe de Commande Ignorés', the_modules)
    } // END OF DISABLED GROUPS

    message.channel.send(the_embed);

    function slowmodecount(obj) {
        var count = 0;
    
        for(var prop in obj) {
            var value = obj[prop];
            if(value !== "disabled"){
                ++count;
            }
        }
    
        return count;
    }

}

module.exports.help = {
    name:"getconf",
    desc:"Obtiens les info de configuration d'un serveur !",
    usage:"getconf [ID]",
    group:"owner",
    examples:"$getconf 470597615206006806"
}

module.exports.settings = {
    permissions:"MANAGE_EMOJIS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var the_embed = new Discord.RichEmbed()
        .setAuthor('Configuration de '+message.guild.name)
        .setColor(data.embed_color)
        .setFooter('Éditez la conf avec les commandes admin !');

    // ----- PRÉFIXE -----
    the_prefix = (data.guild_data.prefix === config.prefix) ? config.prefix+' (par défaut)' : data.guild_data.prefix;
    the_embed.addField('Préfixe', the_prefix);

    // ----- IGNORED CHANNELS -----
    if(data.guild_data.ignored_channels.length < 1){
        the_embed.addField('Salons Ignorés', 'Aucun salon ignoré '+emotes[1]);
    }
    if(data.guild_data.ignored_channels.length > 0){
        var channels_message = '';
        data.guild_data.ignored_channels.forEach(element => {
            var the_channel = message.guild.channels.get(element);
            if(the_channel) channels_message += the_channel+'\n';
        });
        the_embed.addField('Salons ignorés', channels_message);
    } // ----- END OF IGNORED CHANNELS -----
    
    var warns_message = '';
    var isKick = (data.guild_data.warns_sanctions['kick']) ? data.guild_data.warns_sanctions['kick'] : 'Non';
    var isBan = (data.guild_data.warns_sanctions['ban']) ? data.guild_data.warns_sanctions['ban'] : 'Non';
    warns_message += 'Kick : '+isKick+'\nBan : '+isBan;
    the_embed.addField('Warn', warns_message)

    /* ----- PURGED CHANNELS -----
    if(data.guild_data.auto_purge){
        if(data.guild_data.auto_purge.length < 1){
            the_embed.addField('Auto-Purge', 'Aucun salon auto-purgé '+emotes[1]);
        }
        if(data.guild_data.auto_purge.length > 0){
            var channels_message = '';
            data.guild_data.auto_purge.forEach(element => {
                var the_channel = message.guild.channels.get(element);
                if(the_channel) channels_message += the_channel+'\n';
            });
            the_embed.addField('Auto-Purge', channels_message);
        }
    } else {
        the_embed.addField('Auto-Purge', 'Aucun salon auto-purgé '+emotes[1]);
    } // ----- END OF PURGED CHANNELS -----*/
    

    // ----- SLOW MODE -----
    if(slowmodecount(data.guild_data.slowmode) < 1){
        the_embed.addField('Salons Slowmode', 'Aucun salon avec slowmode '+emotes[1]);
    }
    if(slowmodecount(data.guild_data.slowmode) > 0){
        var channels_message = '';
        for (var id in data.guild_data.slowmode){
            var time = data.guild_data.slowmode[id];
            var the_channel = message.guild.channels.get(id);
            if(the_channel && time !== "disabled") channels_message += the_channel + ' ('+time+') \n';
        };
        the_embed.addField('Salons Slowmode', channels_message);
    } // ----- END OF SLOW MODE -----
    
    // AUTOROLE 
    if(data.guild_data.autorole_plugin.status === "on"){
        var the_role = message.guild.roles.get(data.guild_data.autorole_plugin.role);
        if(!the_role) the_embed.addField('Plugin Autorôle', "Statut : Inefficace "+emotes[2]+'\nRôle Introuvable (ID : '+data.guild_data.autorole_plugin.role+')');
        if(the_role) the_embed.addField('Plugin Autorôle', 'Statut : Activé'+emotes[1]+'\nRôle : '+the_role);
    }
    if(data.guild_data.autorole_plugin.status === "disabled"){
        the_embed.addField('Plugin Autorôle', '\nStatut : Désactivé '+emotes[0]);
    } // END OF AUTOROLE

    // BIENVENUE 
    if(data.guild_data.welcome_plugin.status === "on"){
        var the_message = data.guild_data.welcome_plugin.message;
        if(the_message.length > 300) the_message = '`Erreur : message trop long pour l\'afficher dans la configuration.`';
        var the_channel = message.guild.channels.get(data.guild_data.welcome_plugin.channel);
        if(!the_channel) the_embed.addField('Plugin Bienvenue', "Statut : Inefficace "+emotes[2]+'\nSalon Introuvable (ID : '+guild_data.welcome_plugin.channel+')\nMessage : '+the_message);
        if(the_channel) the_embed.addField('Plugin Bienvenue', 'Statut : Activé'+emotes[1]+'\nSalon : '+the_channel+'\nMessage : '+the_message);
    }
    if(data.guild_data.welcome_plugin.status === "disabled"){
        the_embed.addField('Plugin Bienvenue', '\nStatut : Désactivé '+emotes[0]);
    } // END OF BIENVENUE


    // BIENVENUE MP
    if(data.guild_data.welcome_mp_plugin.status === "on"){
        var the_message = data.guild_data.welcome_mp_plugin.message;
        if(the_message.length > 300) the_message = '`Erreur : message trop long pour l\'afficher dans la configuration.`';
        the_embed.addField('Plugin Bienvenue Msg Privés', 'Statut : Activé'+emotes[1]+'\nMessage : '+the_message);
    }
    if(data.guild_data.welcome_mp_plugin.status === "disabled"){
        the_embed.addField('Plugin Bienvenue Msg Privés', '\nStatut : Désactivé '+emotes[0]);
    } // END OF BIENVENUE


    // BYE 
    if(data.guild_data.leave_plugin.status === "on"){
        var the_message = data.guild_data.leave_plugin.message;
        var the_channel = message.guild.channels.get(data.guild_data.leave_plugin.channel);
        if(the_message.length > 300) the_message = '`Erreur : message trop long pour l\'afficher dans la configuration.`';
        if(!the_channel) the_embed.addField('Plugin Au Revoir', "Statut : Inefficace "+emotes[2]+'\nSalon Introuvable (ID : '+data.guild_data.leave_plugin.channel+')\nMessage : '+the_message);
        if(the_channel) the_embed.addField('Plugin Au Revoir', 'Statut : Activé'+emotes[1]+'\nSalon : '+the_channel+'\nMessage : '+the_message);
    }
    if(data.guild_data.leave_plugin.status === "disabled"){
        the_embed.addField('Plugin Au Revoir', '\nStatut : Désactivé '+emotes[0]);
    } // END OF BYE

    // CHANNELS CONFIGURATION 


    var the_channels = '';

    if(data.guild_data.suggestions !== "unknow"){
        var the_channel = message.guild.channels.get(data.guild_data.suggestions);
        if(!the_channel)  the_channels += 'Suggestions : pas de salon défini\n';
        if(the_channel)  the_channels += 'Suggestions : '+the_channel+'\n';
    }
    if(data.guild_data.suggestions === "unknow"){
        the_channels += 'Suggestions : pas de salon défini\n';
    } // END OF SUGG */

    if(data.guild_data.report !== "unknow"){
        var the_channel = message.guild.channels.get(data.guild_data.report);
        if(!the_channel)  the_channels += 'Signalements : pas de salon défini\n';
        if(the_channel)  the_channels += 'Signalements : '+the_channel+'\n';
    }
    if(data.guild_data.report === "unknow"){
        the_channels += 'Signalements : pas de salon défini\n';
    } // END OF SUGG */

    if(data.guild_data.logs_plugin.status === "on"){
        var the_channel = message.guild.channels.get(data.guild_data.logs_plugin.channel);
        if(!the_channel)  the_channels += 'Logs : pas de salon défini\n';
        if(the_channel)  the_channels += 'Logs : '+the_channel+'\n';
    }
    if(data.guild_data.logs_plugin.status === "disabled"){
        the_channels += 'Logs : désactivés\n';
    } // END OF LOGS */
    
    if(data.guild_data.sondages !== "unknow"){
        var the_channel = message.guild.channels.get(data.guild_data.sondages);
        if(!the_channel)  the_channels += 'Sondages : pas de salon défini\n';
        if(the_channel)  the_channels += 'Sondages : '+the_channel+'\n';
    }
    if(data.guild_data.sondages === "unknow"){
        the_channels += 'Sondages : pas de salon défini\n';
    } // END OF SONDAGES */

    if(data.guild_data.annonces !== "unknow"){
        var the_channel = message.guild.channels.get(data.guild_data.annonces);
        if(!the_channel)  the_channels += 'Annonces : pas de salon défini';
        if(the_channel)  the_channels += 'Annonces : '+the_channel;
    }
    if(data.guild_data.annonces === "unknow"){
        the_channels += 'Annonces : pas de salon défini';
    } // END OF ANNONCES */

    the_embed.addField('Salons', the_channels);
    

    // INVITE 
    if(data.guild_data.deleteinvite === "on"){
        the_embed.addField('Auto Suppression des pubs', 'Statut : Activé '+emotes[1])
    }
    if(data.guild_data.deleteinvite === "disabled"){
        the_embed.addField('Auto Suppression des pubs', 'Statut : Désactivé '+emotes[0])
    } // END OF INVITE

    // DISABLED  GROUPS
    if(data.guild_data.disabled_modules.length < 1){
        the_embed.addField('Groupe de Commande Ignorés', 'Aucun groupe de commandes ignoré '+emotes[1])
    }
    if(data.guild_data.disabled_modules.length > 0){
        var the_modules = '';
        data.guild_data.disabled_modules.forEach(element =>{
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
    name:"configuration",
    desc:"Affiche la configuration du serveur !",
    usage:"configuration",
    group:"administration",
    examples:"$configuration"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
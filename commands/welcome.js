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
        servers_data.set(message.guild.id+'.welcome_plugin.status', 'on');
        servers_data.set(message.guild.id+'.welcome_plugin.channel', the_channel.id);
        servers_data.set(message.guild.id+'.welcome_plugin.message', the_message);
        message.channel.send(emotes[1] + ' | Messages de bienvenue activés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.welcome_plugin.status', 'disabled');
        servers_data.set(message.guild.id+'.welcome_plugin.channel', 'unknow');
        servers_data.set(message.guild.id+'.welcome_plugin.message', 'unknow');
        message.channel.send(emotes[1] + ' | Messages de bienvenue désactivés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
}

module.exports.help = {
    name:"welcome",
    desc:"Active ou désactive le message de bienvenue !",
    usage:"welcome [on/off] (#channel) (message)",
    group:"administration",
    examples:"$welcome on #nouveaux Bienvenue {membre} sur {serveur} ! Grâce à toi nous sommes {membercount} !\n$welcome off" // \n\nPour envoyer le message de bienvenue en messages privés, mettez {mp} n'importe ou quand le message. Il sera automatiquement supprimé et le message sera envoyé en mp.
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
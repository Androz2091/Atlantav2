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
        var the_message = args.slice(1).join(' ');
        servers_data.set(message.guild.id+'.welcome_mp_plugin.status', 'on');
        servers_data.set(message.guild.id+'.welcome_mp_plugin.message', the_message);
        message.channel.send(emotes[1] + ' | Messages de bienvenue en messages privés activés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
    if(statut === "off"){
        servers_data.set(message.guild.id+'.welcome_mp_plugin.status', 'disabled');
        servers_data.set(message.guild.id+'.welcome_mp_plugin.message', 'unknow');
        message.channel.send(emotes[1] + ' | Messages de bienvenue en messages privés désactivés ! Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
    }
}

module.exports.help = {
    name:"welcomemp",
    desc:"Active ou désactive le message de bienvenue en messages privés !",
    usage:"welcomemp [on/off] (message)",
    group:"administration",
    examples:"$welcomemp on Bienvenue {membre} sur {serveur} ! Grâce à toi nous sommes {membercount} !\n$welcomemp off" // \n\nPour envoyer le message de bienvenue en messages privés, mettez {mp} n'importe ou quand le message. Il sera automatiquement supprimé et le message sera envoyé en mp.
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
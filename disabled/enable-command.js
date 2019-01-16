const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (bot, message, args, commandfile, emotes, guild_data) => {
    
    console.log(guild_data.disabled_commands); 

    var the_command = args[0]; // Récup commande

    if(!args[0]) return errors.utilisation(message, commandfile, emotes, guild_data); // Message erreur

    var the_commandfile = bot.commands.get(the_command); // Vérifie si la commande existe

    if(!the_commandfile){ // Si la commande ne fait pas parti de la collection de commandes
        return message.channel.send(emotes[0] + ' | La commande `'+the_command+'` n\'existe pas !');
    } else {
        if(guild_data.disabled_commands.indexOf(the_command) >= 0){
            var _disabled_commands = [];
            guild_data.disabled_commands.forEach(element =>{
                if(element !== the_command){
                    _disabled_commands.push(element);
                }
            });
            servers_data.set(message.guild.id+'.disabled_commands', _disabled_commands);
            return message.channel.send(emotes[1] +' | La commande `'+the_command+'` a été activée sur '+message.guild.name+' !');
        } else {
            return message.channel.send(emotes[0] + ' | La commande `'+the_command+'` est déjà activée !');
        }
    }

}

module.exports.help = {
    name:"enable-command",
    desc:"Active une commande sur le serveur",
    usage:"enable-command [commande]",
    group:"administration",
    examples:"$enable-command ping"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"true",
    disabled:"false",
    premium:"false",
    owner:"false"
}
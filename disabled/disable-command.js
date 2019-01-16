const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (bot, message, args, commandfile, emotes, guild_data) => {
    
    var the_command = args[0];

    if(!args[0]) return errors.utilisation(message, commandfile, emotes, guild_data);

    var the_commandfile = bot.commands.get(the_command);

    if(!the_commandfile){
        return message.channel.send(emotes[0] + ' | La commande `'+the_command+'` n\'existe pas !');
    } else {
        if(the_commandfile.help.group === "administration"){
            return message.channel.send(emotes[0] +' | Les commandes Administration ne peuvent être désactivées !');
        }
        if(guild_data.disabled_commands.indexOf(the_command) < 0){
            servers_data.push(message.guild.id+'.disabled_commands', the_command);
            return message.channel.send(emotes[1] +' | La commande `'+the_command+'` a été désactivée sur '+message.guild.name+' !');
        } else {
            return message.channel.send(emotes[0] + ' | La commande `'+the_command+'` est déjà désactivée !');
        }
    }

}

module.exports.help = {
    name:"disable-command",
    desc:"Désactive une commande sur le serveur",
    usage:"disable-command [commande]",
    group:"administration",
    examples:"$disable-command ping"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"true",
    disabled:"false",
    premium:"false",
    owner:"false"
}
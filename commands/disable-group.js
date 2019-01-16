const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_module = args[0];

    if(!args[0]) return errors.utilisation(message, data, emotes);

    var groups = [];

    if(the_module === "administration"){
        return message.channel.send(emotes[0] +' | Le groupe Administration ne peut être désactivé !');
    }

    bot.commands.forEach(element => {
        _the_group = element.help.group;
        if(groups.indexOf(_the_group) < 0){
            groups.push(_the_group);
        }
    });

    if(groups.indexOf(the_module) < 0){
        return message.channel.send(emotes[0] + ' | Le groupe `'+the_module+'` n\'existe pas !');
    } else {
        if(data.guild_data.disabled_modules.indexOf(the_module) < 0){
            servers_data.push(message.guild.id+'.disabled_modules', the_module);
            return message.channel.send(emotes[1] +' | Le groupe de commandes `'+the_module+'` a été désactivé sur '+message.guild.name+' !');
        } else {
            return message.channel.send(emotes[0] + ' | Le module `'+the_module+'` est déjà désactivé !');
        }
    }

}

module.exports.help = {
    name:"disable-group",
    desc:"Désactive un groupe de commande sur le serveur",
    usage:"disable-group [module]",
    group:"administration",
    examples:"$disable-group modération"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
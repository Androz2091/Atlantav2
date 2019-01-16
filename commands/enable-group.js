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

    bot.commands.forEach(element => {
        _the_group = element.help.group;
        if(groups.indexOf(_the_group) < 0){
            groups.push(_the_group);
        }
    });

    if(groups.indexOf(the_module) < 0){
        return message.channel.send(emotes[0] + ' | Le groupe `'+the_module+'` n\'existe pas !');
    } else {
        if(data.guild_data.disabled_modules.indexOf(the_module) >= 0){
            var disabled_groups = [];
            data.guild_data.disabled_modules.forEach(element =>{
                if(element !== the_module){
                    disabled_groups.push(element);
                }
            });
            servers_data.set(message.guild.id+'.disabled_modules', disabled_groups);
            return message.channel.send(emotes[1] +' | Le groupe de commandes `'+the_module+'` a été activé sur '+message.guild.name+' !');
        } else {
            return message.channel.send(emotes[0] + ' | Le module `'+the_module+'` est déjà activé !');
        }
    }

}

module.exports.help = {
    name:"enable-group",
    desc:"Active un groupe de commande sur le serveur",
    usage:"enable-group [module]",
    group:"administration",
    examples:"$enable-group modération"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
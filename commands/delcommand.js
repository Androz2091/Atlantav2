const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var name = args[0];
    if(!name) return errors.utilisation(message, data, emotes);

    var isCommand = bot.commands.get(name);

    if(isCommand) return message.channel.send(emotes[0] + ' | Cette commande existe déjà sur Atlanta !');

    if(!data.guild_data.commands[name]) return message.channel.send(emotes[0] + ' | Cette commande n\'existe pas !');

    servers_data.delete(message.guild.id+'.commands.'+name);

    message.channel.send(emotes[1] + ' | Commande `'+name+'` retirée ! Tape `'+data.guild_data.prefix+'help` pour voir les modifications !');
}

module.exports.help = {
    name:"delcommand",
    desc:"Retire une commande au serveur !",
    usage:"delcommand [nom]",
    group:"administration",
    examples:"$delcommand ip"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
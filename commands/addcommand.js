const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var name = args[0];
    var answer = args.slice(1).join(' ');
    if(!name || !args[1]) return errors.utilisation(message, data, emotes);

    var isCommand = bot.commands.get(name);

    if(isCommand) return message.channel.send(emotes[0] + ' | Cette commande existe déjà sur Atlanta !');

    name = name.toLowerCase();
    
    servers_data.set(message.guild.id+'.commands.'+name, answer);

    message.channel.send(emotes[1] + ' | Commande `'+name+'` ajoutée ! Tape `'+data.guild_data.prefix+'help` pour voir les modifications !');
}

module.exports.help = {
    name:"addcommand",
    desc:"Ajoute une commande au serveur !",
    usage:"addcommand [nom] [la réponse]",
    group:"administration",
    examples:"$addcommand ip Voilà l'adresse iP de notre serveur : play.ip.com !"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
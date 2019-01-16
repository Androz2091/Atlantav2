const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var new_prefix = args[0];

    if(!new_prefix) return message.channel.send(emotes[0]+' | Entre un préfixe !');

    if(args[1]) return message.channel.send(emotes[0]+' | Le préfixe ne peut contenir qu\'un seul mot !');

    if(new_prefix.length > 15) return message.channel.send(emotes[0] +' | Le nombre maximum de caractères pour le préfixe est `15` !');

    servers_data.set(message.guild.id+'.prefix', new_prefix);

    message.channel.send(emotes[1] + ' | Nouveau préfixe défini en tant que `' + new_prefix + '` ! Tapez `' + new_prefix + 'configuration` pour voir la configuration !' )
}

module.exports.help = {
    name:"setprefix",
    desc:"Change le préfixe du serveur !",
    usage:"setprefix [préfixe]",
    group:"administration",
    examples:"$setprefix !"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    if(!args[0]) return errors.utilisation(message, data, emotes);
    var name = args.join(' ');
    var role = message.guild.roles.find(r => r.name === name);
    if(!role) return message.channel.send(emotes[0] + ' | Rôle `'+name+' introuvable !');

    message.delete();
    
    role.setMentionable(true)
        .then(updated => {
            message.channel.send('<@&'+updated.id+'>').then(m => {
                role.setMentionable(false);
            });
        });
}

module.exports.help = {
    name:"quickping",
    desc:"Permet de mentionner un rôle sans pour autant le rendre mentionnable !",
    usage:"quickping [nom role]",
    group:"modération",
    examples:"$quickping Giveaways"
}

module.exports.settings = {
    permissions:"MENTION_EVERYONE",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
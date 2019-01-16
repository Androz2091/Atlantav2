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
    
    var color = args[0];
    if(!color) return errors.utilisation(message, data, emotes);
    var hexa = functions.getHex(color);

    if(!args[1]) return errors.utilisation(message, data, emotes);
    var name = args.slice(1).join(' ');
    var role = message.guild.roles.find(r => r.name === name);
    if(!role) return message.channel.send(emotes[0] + ' | Rôle `'+name+' introuvable !');

    role.setColor(hexa)
        .then(updated => {
            message.channel.send(emotes[1] + ' | Le rôle `'+name+'` vient d\'être mis à jour !');
        });
}

module.exports.help = {
    name:"role-color",
    desc:"Changez la couleur d'un rôle !",
    usage:"role-color [couleur] [nom role]",
    group:"modération",
    examples:"$role-color pink Giveaways"
}

module.exports.settings = {
    permissions:"MANAGE_ROLES",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
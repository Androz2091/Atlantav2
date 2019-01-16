const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var role = message.mentions.roles.first();
    if(!role && !args[0]) return errors.utilisation(message, data, emotes);
    else {
        if(role){
            message.channel.send(emotes[2]+' | Ajout des rôles en cours...');
            message.guild.members.forEach(element => {
                element.addRole(role);
            });
        } else {
            role = message.guild.roles.find(e => e.name === args.join(' '));
            if(!role) return message.channel.send(emotes[0]+' | Aucun rôle trouvé pour "'+role+'" !');
            message.channel.send(emotes[2]+' | Ajout des rôles en cours...');
            message.guild.members.forEach(element => {
                element.addRole(role);
            });
        }
    }

}

module.exports.help = {
    name:"everyrole",
    desc:"Ajoute le rôle à tout le serveur !",
    usage:"everyrole [role]",
    group:"administration",
    examples:"$everyrole Communauté"
}

module.exports.settings = {
    permissions:"ADMINISTRATOR",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
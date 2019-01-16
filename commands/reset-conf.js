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

    message.channel.send(emotes[2] + ' | Êtes-vous sur de vouloir réinitaliser la configuration Atlanta du serveur ? Entrez "oui" ou "non". Les messages de bienvenue, d\'au revoir, les commandes ajoutées, etc... seront réinitialisés !');

    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

    collector.on('collect', message =>{
        if(message.content.toLowerCase() === "oui"){
            collector.stop("oui");
        } else if(message.content.toLowerCase() === "non"){
            collector.stop("non");
        } else {
            return message.channel.send(emotes[2] +' | Répondez oui ou non !');
        }
    });

    collector.on('end', (collected, reason) =>{
        if(reason === "oui"){
            functions.createGuild(message.guild);
            return message.channel.send(emotes[1] + ' | Configuration réinitialisée ! Tapez `'+config.prefix+'configuration` pour voir la nouvelle configuration !')
        }
        if(reason === "non"){
            message.channel.send(emotes[0] +' | Action correctement annulée !');
        }
    });
}

module.exports.help = {
    name:"reset-conf",
    desc:"Reinitialise la configuration de votre serveur !",
    usage:"reset-conf",
    group:"administration",
    examples:"$reset-conf"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
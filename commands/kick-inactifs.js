const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(!args[0] || isNaN(args[0])) return errors.utilisation(message, data, emotes);
    var nombreJours = parseInt(args[0]);

    message.guild.pruneMembers(nombreJours, true).then(members =>{

        message.channel.send(emotes[1] + ' | '+members+' expulsions en attente ! Tapez "oui" pour confirmer ou "non" pour annuler. ');

        var c = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 20000 });

        c.on('collect', (message) =>{
            if(message.content.toLowerCase() === "non"){
                message.channel.send(emotes[1] + ' | Action correctement annulée !');
                c.stop('okay');
            }
            if(message.content.toLowerCase() === "oui"){
                message.guild.pruneMembers(nombreJours, false).catch(err => {return message.channel.send(emotes[0] + ' | Je n\'ai pas la permission de kick tout les membres inactifs !');})
                message.channel.send(emotes[1] + ' | '+members+' membre(s) expulsé(s) !');
                c.stop('okay');
            }
        });

        c.on('end', (collected, reason) => {
            if(reason === "time") return message.channel.send(emotes[0] + ' | Temps écoulé, annulation.');
        });
    });
}

module.exports.help = {
    name:"kick-inactifs",
    desc:"Expulse tout les membres inactifs depuis le nombre de jours donné",
    usage:"kick-inactifs [jours]",
    group:"modération",
    examples:"$kick-inactifs 5\nExpulsera tout les membres inactifs depuis + de 5 jours"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
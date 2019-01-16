const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
request = require('request');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(!args[0]) return errors.utilisation(message, data, emotes);
    var a_ip = args[0].split(':');
    var ping_request = "";
    var img = "https://eu.mc-api.net/v3/server/favicon/"+a_ip;
    if(a_ip.length > 1){
        ping_request = `https://mcapi.us/server/status?ip=${a_ip[0]}&port=${a_ip[1]}`;
    } else ping_request = `https://mcapi.us/server/status?ip=${a_ip[0]}`

    request(ping_request, { json: true }, function (error, response, body) {
        if (error) {
            return message.channel.send('Une erreur est survenue lors de la requête à l\'api...');
        }

        if(body.error.length > 1){
            if(body.error === "invalid hostname or port") return message.channel.send(emotes[0]+' | Le serveur semble être hors ligne !');
            else return message.channel.send(emotes[0]+' | Une erreur est survenue.');
        }

        var color = (body.online) ? "#5fe804" : "#667064";
        var status = (body.online) ? "En ligne" : "Hors ligne";

        var mc_embed = new Discord.RichEmbed()
            .setAuthor('Informations sur '+a_ip)
            .addField('Version du serveur', body.server.name)
            .addField('Actuellement en ligne', body.players.now+' joueur(s)')
            .addField('Maximum', body.players.max+' joueur(s)')
            .addField('Statut', status)
            .setColor(color)
            .setThumbnail(img)
            .setFooter(data.footer);

        message.channel.send(mc_embed);
    });
}

module.exports.help = {
    name:"mc-ping",
    desc:"Renvoie des infos sur le serveur, tel que le nombre de joueurs, le nombre de joueurs maximum, la version, etc...",
    usage:"mc-ping [adresse]",
    group:"général",
    examples:"$mc-ping mc.hypixel.net"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
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

    var the_id = args[0];
    if(!the_id) return message.channel.send(emotes[0] + ' | Entre une ID !');

    var number = 0;

    var the_server = bot.guilds.get(the_id);

    if(!the_server){
        return message.channel.send(emote[0] + ' | Serveur Introuvable !');
    }

    var the_channel = the_server.channels.filter(channel => channel.type === "text");

    the_channel.first().createInvite({
        maxAge : '0',
        reason : "getinvite" 
    }).then(i =>{
        message.channel.send(emotes[1] + ' | Invitation générée : '+ i.url);
    }).catch(err => message.channel.send(emotes[0] + ' | Une erreur est survenue...'));
    
}

module.exports.help = {
    name:"getinvite",
    desc:"Génère un lien d'invitation vers le serveur !",
    usage:"getinvite [ID]",
    group:"owner",
    examples:"$getinvite 470597615206006806"
}

module.exports.settings = {
    permissions:"MANAGE_EMOJIS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
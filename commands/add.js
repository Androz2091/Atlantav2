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

    var the_url = args[0];
   var the_name = args[1];

   if(!the_url || !the_name) return errors.utilisation(message, data, emotes);

   message.guild.createEmoji(the_url, the_name).then(emote =>{
       message.channel.send(emotes[1] +' | Emoji `'+emote.name + '` ajouté au serveur !')
   }).catch(err =>{
       return message.channel.send(emotes[0] + ' | URL vers l\'image est invalide ou je n\'ai pas les permissions "`Gérer les emojis`".');
   });
    
}

module.exports.help = {
    name:"add",
    desc:"Ajout un émoji au serveur !",
    usage:"add [url] [nom]",
    group:"administration",
    examples:"$add https://urlz.fr/8oO4 oiseau"
}

module.exports.settings = {
    permissions:"MANAGE_EMOJIS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
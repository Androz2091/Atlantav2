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

    let text = args.join(' ');

    if(!args[0]) return errors.utilisation(message, data, emotes);
    
    if(text.length > 20) return message.channel.send(emotes[0]+' | Votre texte ne doit pas excéder les 40 caractères !')
    functions.arcadiaCall(message, 'presidentialalert', 'text='+text, false, data)

}

module.exports.help = {
    name:"president",
    desc:"Vous renvoie une image d'alerte présidentielle !",
    usage:"president [texte]",
    group:"fun",
    examples:"$president Atlanta Le Meilleur BOT !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
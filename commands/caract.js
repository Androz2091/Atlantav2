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

    message.channel.send(emotes[1] +' | Votre texte fait `'+text.length+'` caractères !');

}

module.exports.help = {
    name:"caract",
    desc:"Compte le nombre de caractères de votre texte !",
    usage:"caract (@membre)",
    group:"fun",
    examples:"$caract Bonjour\n$caract ça va ?"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
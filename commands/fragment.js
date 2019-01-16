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
    
    var text = args.join(' ');
    if(!text) return errors.utilisation(message, data, emotes);
    var array = text.split('').join('||||');
    array = '||'+array+'||';

    message.delete();
    
    message.channel.send('**'+message.author.username+'** vient de dire :\n\n'+array);

}

module.exports.help = {
    name:"fragment",
    desc:"Transformez votre texte avec des ||",
    usage:"fragment [texte]",
    group:"fun",
    examples:"$fragment Bonjour !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
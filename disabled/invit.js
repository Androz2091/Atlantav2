const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var bot = message.mentions.members.first();
    if(!bot) return errors.utilisation(message, data, emotes);

    if(!bot.user.bot) return message.channel.send(emotes[0] +' | **'+bot.user.username+'#'+bot.user.discriminator+'** n\'est pas un bot !');

    var invitation = "https://discordapp.com/oauth2/authorize?client_id="+bot.id+"&scope=bot&permissions=2146958847";

    message.channel.send(invitation)

}

module.exports.help = {
    name:"invit",
    desc:"Génère une invitation pour le bot",
    usage:"invit [@membre]",
    group:"général",
    examples:"$invit [@bot]"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
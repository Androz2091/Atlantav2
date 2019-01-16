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
    
    var membre = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member

    functions.arcadiaCall(message, 'glitch', 'url='+membre.user.displayAvatarURL, false, data)

}

module.exports.help = {
    name:"bug",
    desc:"Un petit bug... qui détruit votre avatar ?",
    usage:"bug (@membre)",
    group:"images",
    examples:"$bug @Androz#1391\n$bug"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
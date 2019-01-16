const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
randomWordFR = require('random-word-fr');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    message.channel.send(emotes[1] + ' | Mot tiré : ```'+randomWordFR()+'```');

}

module.exports.help = {
    name:"mot",
    desc:"Tire un mot aléatoire du dictionnaire !",
    usage:"mot",
    group:"fun",
    examples:"$mot"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
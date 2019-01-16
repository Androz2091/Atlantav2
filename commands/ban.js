const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    message.delete();

    var the_member = message.mentions.members.first();

    if(!the_member)
        return errors.utilisation(message, data, emotes);

    if(!the_member.bannable)
        return message.channel.send(emotes[0] + " | Une erreur est survenue. Ais-je bien un rôle supérieur à " + the_member + " ?");

    let raison = args.slice(1).join(' ');
    if(!raison) raison = "Pas de raison donnée.";
    raison = raison + ' | Banni par ' + message.author.username;

    the_member.ban(raison);

    message.channel.send(emotes[1] + ' | '+the_member.user.username+' a bien été banni du serveur !')

    var the_channel = message.guild.channels.get(data.guild_data.logs_plugin.channel);
    
    if(the_channel) return the_channel.send('**'+the_member.user.username + '#'+the_member.user.discriminator+'** banni par **'+message.author.username+'#'+message.author.discriminator+'**');
}

module.exports.help = {
    name:"ban",
    desc:"Banni le membre mentionné avec la raison donnée !",
    usage:"ban [@membre] (raison)",
    group:"modération",
    examples:"$ban @Androz#2425 Spam & Irrespect envers les modérateurs\n$ban @Androz#2425"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
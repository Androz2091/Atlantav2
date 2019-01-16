const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if(!tomute) return errors.utilisation(message, data, emotes);

    let reason = args.slice(1).join(" "); // Spam & Raid
    if(!reason) reason = 'Pas de raison donnée';

    message.guild.channels.forEach(channel => channel.overwritePermissions(tomute.user, { SEND_MESSAGES: null }));

    message.delete().catch(O_o=>{});

    tomute.send(emotes[0] + ` | Vous venez d'être unmute par le staff de **${message.guild.name}** ! Raison : **${reason}**`);

    message.channel.send(emotes[1] + `| **${tomute}** a bien été unmute ! Raison : **${reason}**`);

    var the_channel = message.guild.channels.get(data.guild_data.logs_plugin.channel);
    
    if(the_channel) return the_channel.send(`**${tomute.user.username}#${tomute.user.discriminator}** unmute par **`+message.author.username+'#'+message.author.discriminator+`**. Raison : **${reason}**`);
}

module.exports.help = {
    name:"unmute",
    desc:"Autorise une personne a parler de nouveau !",
    usage:"unmute [@membre] (raison)",
    group:"modération",
    examples:"$unmute @Androz#2425 Fail désolé"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}

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

    let reason = args.slice(2).join(" "); // Spam & Raid
    if(!reason) reason = 'Pas de raison donnée';

    var unmutes = new quickdb.table('unmutes');

    let mutetime = args[1];
    if(isNaN(ms(mutetime))) return errors.utilisation(message, data, emotes);

    message.delete().catch(O_o=>{});

    tomute.send(emotes[0] + ` | Vous venez d'être mute **${mutetime}** pour **${reason}** par le staff de **${message.guild.name}** !`);

    message.channel.send(emotes[1] + ` | **${tomute}** mute pour **${reason}** pendant **${mutetime}** !`);

    message.guild.channels.forEach(channel => channel.overwritePermissions(tomute.user, { SEND_MESSAGES: false }));

    var mute_object = {
        "member_id":user.id,
        "guild_id":message.guild.id,
        "channel_id":message.channel.id
    }

    var ftime = Date.now()+ms(time);
    ftime = Math.floor(ftime / 1000);
    ftime = String(ftime);
    
    var cdata = unmutes.get(ftime);
    if(!cdata) unmutes.set(ftime, []);
    unmutes.push(ftime, mute_object);

    message.guild.channels.forEach(ch => ch.overwritePermissions( user.user, { SEND_MESSAGES: false }));
    
    var the_channel = message.guild.channels.get(data.guild_data.logs_plugin.channel);
    
    if(the_channel) return the_channel.send(`**${tomute.user.username}#${tomute.user.discriminator}** mute pour **${reason}** pendant **${mutetime}** par **`+message.author.username+'#'+message.author.discriminator+'**');
}

module.exports.help = {
    name:"mute",
    desc:"Empêche la personne de parler pendant un certain temps",
    usage:"mute [@membre] [temps]",
    group:"modération",
    examples:"$mute @Androz#2425 10m\n$mute @Androz#2425\n$mute @Androz#2425 24h"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
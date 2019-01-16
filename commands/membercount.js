const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var botCount = 0;
    var online = 0;
    var streamer = 0;
    var dnd = 0;
    var offline = 0;
    var afk = 0;
    var pjeu = 0;

    message.guild.members.forEach(member => {
        if(member.user.bot) botCount++;
        if(member.presence.status === "dnd") dnd++;
        if(member.presence.status === "idle") afk++;
        if(member.presence.status === "offline") offline++;
        if(member.presence.status === "streamer") streamer++;
        if(member.presence.status === "online") online++;
        if(member.presence.game) pjeu++
    });

    var stats_msg = new Discord.RichEmbed()
        .setAuthor("Stats des Membres de "+message.guild.name)
        .setColor(data.embed_color)
        .setFooter(data.footer)
        .addField('Membres', message.guild.memberCount)
        .addField("Membres En Ligne", online+streamer+dnd+afk)
        .addField('Membres Hors Ligne', offline)
        .addField('Stats', '↳ En Ligne : '+online+'\n↳ En Streaming : '+streamer+'\n↳ AFK : '+afk+'\n↳ Ne pas déranger : '+dnd)
    

    message.channel.send(stats_msg);

}

module.exports.help = {
    name:"membercount",
    desc:"Vous donne des stats sur les membres de votre serveur !",
    usage:"membercount",
    group:"général",
    examples:"$membercount"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
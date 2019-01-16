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

    var msgid = args[0];
    if(!msgid) return errors.utilisation(message, data, emotes);

    if(args[1]){
        var channel = bot.channels.get(args[1]);
        if(!channel) return message.channel.send(emotes[0]+' | Aucun salon ne correspond a cet ID !');
        channel.fetchMessage(msgid).then(m => quote(message, m))
        .catch(err => {
            console.log(err);
            message.delete();
            message.author.send(emotes[0]+' | Aucun message trouvé dans <#'+channel.id+'> avec cet ID !');
        });
    } else {
        message.channel.fetchMessage(msgid).then(m => quote(message, m))
        .catch(err => {
            console.log(err);
            message.delete();
            message.author.send(emotes[0]+' | Aucun message trouvé dans <#'+message.channel.id+'> avec cet ID !');
        });
    }

    function quote(msg1, msg2){
        var embed = new Discord.RichEmbed();
        if(msg2.attachments.size > 0) embed.setImage(msg2.attachments.first().url)
        var color = msg2.member.highestRole ? msg2.member.highestRole.color : data.color;
        embed.setAuthor(msg2.author.username+'#'+msg2.author.discriminator, msg2.author.displayAvatarURL)
            .setDescription(msg2.content)
            .setColor(color)
            .setFooter(msg2.guild.name+' | #'+msg2.channel.name)
            .setTimestamp(msg2.createdTimestamp);
        msg1.channel.send(embed);
    }
}

module.exports.help = {
    name:"quote",
    desc:"Citez le message (sans utilisez betterdiscord ^^)",
    usage:"quote [messageid] (channelid)",
    group:"général",
    examples:"$quote 558714182636404743\n$quote 558714182636404743 557443264916094977"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
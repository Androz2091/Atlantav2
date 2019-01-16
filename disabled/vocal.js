const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var channel = message.mentions.channels.first() || message.guild.channels.get(args[0]);
    if(!channel) return errors.utilisation(message, data, emotes);
    if(channel.type !== 'voice'){
        if(channel.type === 'text') return message.channel.send(emotes[0] + ' | **'+channel.name+'** est un salon textuel. Utilisez la commande `'+data.guild_data.prefix+'channelinfo '+channel.id+'` pour avoir des informations sur ce salon !');
        else {
            return message.channel.send(emotes[0]+' | Le type de salon `'+channel.type+'` n\'est pas pris en charge par cette commande.');
        }

    }

    var cat = (channel.parent) ? channel.parent.name : 'Aucune'

    var embed = new Discord.RichEmbed()
        .setAuthor('Information sur le salon '+channel.name)
        .addField('Nom', channel.name, true)
        .addField('ID', channel.id, true)
        .addField('Bitrate', channel.bitrate+'kbps', true)
        .addField('Position', channel.position, true)
        .addField('Utilisateurs', channel.members.size+' connecté(s)', true)
        .addField('Catégorie', cat , true)
        .addField('Maximum', channel.userLimit === 0 ? 'Infini' : channel.userLimit+' membres')
        .setColor(data.embed_color)
        .setFooter(data.footer)
    
    message.channel.send(embed);
}

module.exports.help = {
    name:"vocal",
    desc:"Affiche des informations sur le salon vocal donné !",
    usage:"vocal [ID]",
    group:"général",
    examples:"$vocal 532551125598208021"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
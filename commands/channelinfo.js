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
    if(channel.type !== 'text'){
        if(channel.type === 'voice') return message.channel.send(emotes[0] + ' | **'+channel.name+'** est un salon vocal. Utilisez la commande `'+data.guild_data.prefix+'vocal '+channel.id+'` pour avoir des informations sur ce salon !');
        else {
            return message.channel.send(emotes[0]+' | Le type de salon `'+channel.type+'` n\'est pas pris en charge par cette commande.');
        }

    }

    var isnsfw = (channel.nsfw) ? 'Oui' : 'Non';
    var cat = (channel.parent) ? channel.parent.name : 'Aucune'
    var top = (channel.topic) ? channel.topic : 'Aucune'

    var embed = new Discord.RichEmbed()
        .setAuthor('Information sur le salon '+channel.name)
        .addField('Nom', channel, true)
        .addField('ID', channel.id, true)
        .addField('NSFW', isnsfw, true)
        .addField('Position', channel.position, true)
        .addField('Description', top, true)
        .addField('Catégorie', cat , true)
        .addField('Utilisateurs', channel.members.size+' membres peuvent lire les messages du **#'+channel.name+'**')
        .setColor(data.embed_color)
        .setFooter(data.footer)
    
    message.channel.send(embed);
}

module.exports.help = {
    name:"channelinfo",
    desc:"Affiche des informations sur le salon donné !",
    usage:"channelinfo [ID/#channel]",
    group:"général",
    examples:"$channelinfo 547453844045430795\n$channelinfo #général"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var params_array = args.join(' ').split(' | ');
    var color = params_array[0];
    var title = params_array[1];
    var msg = params_array[2];
    var footer = params_array[3];
    if(!color || !title || !msg || !footer) return errors.utilisation(message, data, emotes);

    var embed = new Discord.RichEmbed()
        .setAuthor(title)
        .setDescription(msg)
        .setColor(color)
        .setFooter(footer)
    
    message.channel.send(embed).then( () => message.delete());
}

module.exports.help = {
    name:"embed",
    desc:"Envoyez un embed 100% personnalisé grâce à Atlanta !",
    usage:"embed color | title | message | footer",
    group:"général",
    examples:"$embed #FF0000 | Bonjour à tous ! | Comment allez-vous ? Ceci est un embed Atlanta | Ceci est le footer"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"true",
    owner:"false"
}
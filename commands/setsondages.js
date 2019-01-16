const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_channel = message.mentions.channels.first();
    if(!the_channel) return errors.utilisation(message, data, emotes);

    servers_data.set(message.guild.id+'.sondages', the_channel.id);

    message.channel.send(emotes[1] + ' | Les sondages s\'enverront désormais dans '+the_channel+ ' ! Tape `'+data.guild_data.prefix+'configuration` pour voir la nouvelle configuration !');


}

module.exports.help = {
    name:"setsondages",
    desc:"Défini le salon en tant que salon des sondages !",
    usage:"setsondages [#channel]",
    group:"administration",
    examples:"$setsondages #sondages\n$setsondages #votes"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
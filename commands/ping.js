const Discord = require("discord.js");
const config = require("../data/config.json");

module.exports.run = async (message, args, bot, emotes, data) => {
    
    message.channel.send(emotes[1]+' Pong ! Ma latence est de `' + `0.000000` + '` ms !').then(m => {
        m.edit(emotes[1]+' | Pong ! Ma latence est de `' + `${Date.now() - m.createdTimestamp}` + '` ms !');
    });

}

module.exports.help = {
    name:"ping",
    desc:"Envoie ma latence en millisecondes !",
    usage:"ping",
    group:"général",
    examples:"$ping\n$ping [ms]"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
randomWordFR = require('random-word-fr');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    let username = (message.member.nickname) ? message.member.nickname : message.author.username;

    let replies = [];

    request("https://bridge.buddyweb.fr/api/blagues/blagues", { json: true }, function (error, response, body) {
        replies = body;


        let result = Math.floor((Math.random() * replies.length));

        var number = result + 1;
    
        var embed = new Discord.RichEmbed()
            .setAuthor('Blague #' + number)
            .setColor(0x7289DA)
            .setDescription(replies[result].blagues)
            .setFooter('Blagues API')
            .setTimestamp()
    
        message.channel.send(embed).then(m =>{
            m.react('😂');
        })

    });

}

module.exports.help = {
    name:"blague",
    desc:"Cite une blague aléatoire !",
    usage:"blague",
    group:"fun",
    examples:"$blague"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var snekfetch = require('snekfetch');

    message.channel.send(emotes[2]+' | Génération de l\'image...');

    var text = args.join(' ');
    if(!text) return errors.utilisation(message, data, emotes);

    const { body } = await snekfetch.get(encodeURI(`https://nekobot.xyz/api/imagegen?type=phcomment&image=${message.author.displayAvatarURL}&text=${text}&username=${message.author.username}`))
    message.channel.send({  
       files: [{   
         attachment: body.message,
         name: 'pornhub-comment.png'
       }]
     })
    
}

module.exports.help = {
    name:"ph",
    desc:"Génère un commentaire sur PH !",
    usage:"ph [text]",
    group:"fun",
    examples:"$ph Coucou !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}

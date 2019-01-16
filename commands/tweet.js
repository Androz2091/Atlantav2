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

    var user = args[0]
    if(!user) return errors.utilisation(message, data, emotes);

    var text = args.slice(1).join(' ');
    if(!text) return errors.utilisation(message, data, emotes);

    const { body } = await snekfetch.get(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`))
    message.channel.send({  
       files: [{   
         attachment: body.message,
         name: 'tweet.png'
       }]
     })
    
}

module.exports.help = {
    name:"tweet",
    desc:"Génère un tweet !",
    usage:"tweet [user] [text]",
    group:"fun",
    examples:"$tweet Gotaga Coucou !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}

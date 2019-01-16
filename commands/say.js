const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var say_message = args.join(' ');

    if(!args[0]) return errors.utilisation(message, data, emotes);

    message.delete();
    
    message.channel.send('**'+message.author.username+'#'+message.author.discriminator+'** vient de dire :\n'+say_message);
    

}

module.exports.help = {
    name:"say",
    desc:"Faites dire ce que vous voulez au bot ! Premium Only",
    usage:"say [text]",
    group:"général",
    examples:"$say Hello\n$say Je suis un bot"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"true",
    owner:"false"
}
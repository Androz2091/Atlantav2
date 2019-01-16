const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');
const figlet = require('figlet');


quickdb.init('./data/atlanta.sqlite');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    if(!args[0]) return errors.utilisation(message, data, emotes);
    if(args.join(' ').length > 20){
        return message.reply('trop de caractères....')
    }
    figlet(args.join(' '), function(err, rdata) {
        if (err) {
            message.reply('une erreur est survenue pendant la conversion...');
            return;
        }
        message.channel.send('```' + rdata + '```');
    });

}

module.exports.help = {
    name:"ascii",
    desc:"Transforme votre texte en version ASCII",
    usage:"ascii [texte]",
    group:"fun",
    examples:"$ascii Hello\n$ascii YourName"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
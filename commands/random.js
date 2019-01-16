const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var responses = args.join(' ').split('/');

    if(responses.length < 2) return errors.utilisation(message, data, emotes);

    message.channel.send('Choix en cours...').then(m =>{
        setTimeout(function(){
            m.edit(emotes[1] + ' | J\'ai fait mon choix :');
            let result = Math.floor((Math.random() * responses.length));
            message.channel.send('```'+responses[result] + '```');
        }, ms('1s'));
    });

}

module.exports.help = {
    name:"random",
    desc:"Tire un élément aléatoire de ceux que vous avez rentrés",
    usage:"random [choix1/choix2/choix3/etc...]",
    group:"fun",
    examples:"$random Feu/Eau/Vent"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
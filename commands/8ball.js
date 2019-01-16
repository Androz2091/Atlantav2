const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    let username = (message.member.nickname) ? message.member.nickname : message.author.username;

    if(!args[0]) return errors.utilisation(message, data, emotes);

    let replies = [
        "il est certain !",
        "c'est décidément sur.",
        "sans aucun doute.",
        "oui, j'en suis sur et certain !",
        "probablement...",
        "oui !",
        "non !",
        "des signes me font dire oui...",
        "demandez à nouveau plus tard :\\",
        "mieux vaut ne pas te le dire maintenant...",
        "je ne peux pas prédire maintenant.",
        "concentrez-vous et demandez à nouveau !",
        "ne compte pas la dessus.",
        "ma réponse est non.",
        "mes sources disent que non...",
        "oh... J'en doute !"
    ];

    let result = Math.floor((Math.random() * replies.length));

    message.channel.send(username+', '+replies[result]);

}

module.exports.help = {
    name:"8ball",
    desc:"Tire une réponse aléatoire pour répondre à vos questions !",
    usage:"8ball [question]",
    group:"fun",
    examples:"$8ball Suis-je un Dieu ?\n$8ball Androz est-il sympa & cool ?"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
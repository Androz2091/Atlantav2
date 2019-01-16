const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {


    var color = args[0];
    if(!color) return errors.utilisation(message, data, emotes);

    var hexa = functions.getHex(color);

    if(!hexa){
        if(!isHex(args[0])) return message.channel.send(emotes[0] + ' | Couleur Invalide !')
        hexa = args[0];
    }

    users_data.set(message.author.id+".color", hexa);

    message.channel.send(emotes[1] + ' | Couleur d\'embed changée en '+hexa+' !');

    function isHex(h) {
        var a = parseInt(h,16);
        return (a.toString(16) ===h.toLowerCase())
    }
}

module.exports.help = {
    name:"setcolor",
    desc:"Change la couleur des embeds ! Premium Only",
    usage:"setcolor [couleur]",
    group:"général",
    examples:"$setcolor red\n$setcolor #FF0000"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"true",
    owner:"false"
}
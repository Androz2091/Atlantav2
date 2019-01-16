const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');
const math = require('mathjs');


module.exports.run = async (message, args, bot, emotes, data) => {

    var calcul = args.join(' ');
    calcul = calcul.replace(/['x'_]/g,'*');
    if(!calcul) return errors.utilisation(message, data, emotes);
    if(calcul === "sqrt(<@422820341791064085>)") return message.channel.send('```Résultat :\n\nAndroz.```');
    if(calcul === "<@369886174766039050>^2") return message.channel.send('```Résultat :\n\nAndroz².```');
    try {
        math.eval(calcul);
        message.reply('```Résultat :\n\n'+calcul+' = ' +math.eval(calcul)+'```');
      }
      catch(error) {
        message.channel.send(emotes[0] +' | Quelque chose s\'est mal passé... Vérifiez votre opération et réessayez !');
      }

}

module.exports.help = {
    name:"calc",
    desc:"Calcule pour vous !",
    usage:"calc [opération]",
    group:"général",
    examples:"$calc 10x89(7/0)"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
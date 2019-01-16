const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var embed = new Discord.RichEmbed()
        .setAuthor('Atlanta Version Premium')
        .setDescription('Avantages, comment devenir premium, etc...')
        .addField('Acheter le Premium :', 
            'Voici les possibilités pour acheter le Premium : \n'+
            '- Euros (2.50€)\n'+
            '- Crédits (30 000 crédits)\n'+
            '- Publicité (+ 15 invitations sur le support)\n'+
            '- Serveurs (fondateur de + de 10 serveurs utilisant Atlanta, les serveurs doivent comportés plus de 50 membres)'
        )
        .addField('Avatanges du Premium :', 
            '- Couleur des embeds personnalisable ! (au lieu de s\'afficher en rouge, la couleur des embeds sera celle de votre choix)\n'+
            '- Commandes supplémentaires ! (say, setcolor, embed)\n'+
            '- 2x plus de crédits sur le work !'
        )
        .setFooter(data.footer)
        .setColor(config.embed_color)

    message.channel.send(embed);
}

module.exports.help = {
    name:"devenir-premium",
    desc:"Sachez comment être premium, et quels sont les avantages !",
    usage:"devenir-premium",
    group:"général",
    examples:"$devenir-premium"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
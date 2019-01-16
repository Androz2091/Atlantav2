const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var superagent = require('superagent');

    message.channel.send('Image en cours de chargement...').then(m => {

        superagent.get('https://nekos.life/api/v2/img/Random_hentai_gif').end((err, response) => {

            var embed_nsfw = new Discord.RichEmbed()
                .setAuthor('NSFW - Hentai GIF')
                .setDescription('Requête de '+message.member.displayName)
                .setFooter(data.footer)
                .setImage(response.body.url)
                .setColor(data.embed_color)
            
            m.edit(embed_nsfw);
    
        });
    });
    


}

module.exports.help = {
    name:"hentai-gif",
    desc:"Génère une image NSFW de type `hentai-gif`. Attention, ce type d'image peut choquer et est réservé aux membres de plus de 18 ans.",
    usage:"hentai-gif",
    group:"NSFW",
    examples:"$hentai-gif"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"true",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
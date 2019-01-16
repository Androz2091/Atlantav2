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

        superagent.get('https://nekobot.xyz/api/image').query({ type: 'hentai'}).end((err, response) => {

            var embed_nsfw = new Discord.RichEmbed()
                .setAuthor('NSFW - Hentai')
                .setDescription('Requête de '+message.member.displayName)
                .setFooter(data.footer)
                .setImage(response.body.message)
                .setColor(data.embed_color)
            
            m.edit(embed_nsfw);
    
        });
    });
    


}

module.exports.help = {
    name:"hentai",
    desc:"Génère une image NSFW de type `hentai`. Attention, ce type d'image peut choquer et est réservé aux membres de plus de 18 ans.",
    usage:"hentai",
    group:"NSFW",
    examples:"$hentai"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"true",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

const request = require('request');
const keys = require('../data/keys.json');

const translate = require('google-translate-api');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        var the_request = "https://fortnite-api.tresmos.xyz/news?key="+keys.fortnite;

        request(the_request, { json: true }, (err, res, body) => {
            

            // 1 = pile | 2 = face
            min = Math.ceil(0);
            max = Math.floor(3);

            let result = Math.floor(Math.random() * (max - min)) + min;
            
            translate(body.br[0].body, {
                to: 'fr'
            }).then(res => {

                var embed1 = new Discord.RichEmbed()
                    .setAuthor('News #1 - ' + body.br[0].title)
                    .setDescription(res.text)
                    .setImage(body.br[0].image)
                    .setFooter(data.footer)
                    .setColor(data.embed_color)

                m.edit(embed1);
            });

            translate(body.br[1].body, {
                to: 'fr'
            }).then(res => {

                var embed2 = new Discord.RichEmbed()
                    .setAuthor('News #2 - ' + body.br[1].title)
                    .setDescription(res.text)
                    .setImage(body.br[1].image)
                    .setFooter(data.footer)
                    .setColor(data.embed_color)

                m.channel.send(embed2);
            });
        
            translate(body.br[2].body, {
                to: 'fr'
            }).then(res => {

                var embed3 = new Discord.RichEmbed()
                    .setAuthor('News #3 - ' + body.br[2].title)
                    .setDescription(res.text)
                    .setImage(body.br[2].image)
                    .setFooter(data.footer)
                    .setColor(data.embed_color)

                m.channel.send(embed3);
            });
        });
    });

}

module.exports.help = {
    name:"fnews",
    desc:"Affiche une des trois dernières news Fortnite !",
    usage:"fnews",
    group:"général",
    examples:"$fnews"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
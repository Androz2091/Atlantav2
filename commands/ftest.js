const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

const request = require('request');
const keys = require('../data/keys.json');


quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    var apikey = keys.fortnite;

    var the_request = 'https://fortnite-api.tresmos.xyz/status?key='+apikey;

    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        request(the_request, { json: true }, (err, res, body) => {

            var statut;

            if(body.boolean){
                var online_embed = new Discord.RichEmbed()
                    .setAuthor('Statut Fortnite')
                    .setColor(0x00FF00)
                    .setDescription(emotes[1] + ' Les serveurs sont en ligne !')
                    .setFooter('Fortnite API - Statuts Serveurs')
                m.edit(online_embed);
            }
            if(!body.boolean){
                var disco_embed = new Discord.RichEmbed()
                    .setAuthor('Statut Fortnite')
                    .setColor(0xFF0000)
                    .setDescription(emotes[0] + ' Les serveurs sont down !')
                    .setFooter('Fortnite API - Statuts Serveurs')
                m.edit(disco_embed);
            }

        });
    });

}

module.exports.help = {
    name:"ftest",
    desc:"Test si les serveurs de Fortnite sont en ligne !",
    usage:"ftest",
    group:"général",
    examples:"$ftest"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
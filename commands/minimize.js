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
    
    var encode_url = require('encodeurl');

    var url = args[0];
    if(!url) return errors.utilisation(message, data, emotes);

    message.channel.send(emotes[1]+" | Traitement de votre demande en cours...").then(m => {

        request('https://urlz.fr/api_new.php?url='+encode_url(url), { json: true }, (err, res, body) => {
            if(body === 'Erreur') return message.channel.send(emotes[0]+' | URL incompatible avec le raccourcisseur d\'URL.')
            var new_url = body;
            request('https://is.gd/create.php?format=simple&url='+encode_url(url), { json: true }, (err, res, fbody) => {
                if(fbody === 'Error: Please enter a valid URL to shorten') return message.channel.send(emotes[0]+' | URL incompatible avec le raccourcisseur d\'URL.')
                var tnew_url = fbody;
                var embed = new Discord.RichEmbed()
                    .setAuthor('URL Minimizer', bot.user.displayAvatarURL)
                    .setColor(data.embed_color)
                    .setFooter(data.footer)
                    .addField('URLZ', new_url)
                    .addField('ISGD', tnew_url)
                message.channel.send(embed);
            });
        });
    });

}

module.exports.help = {
    name:"minimize",
    desc:"Raccourci votre lien !",
    usage:"minimize [lien]",
    group:"général",
    examples:"$minimize https://www.google.fr"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
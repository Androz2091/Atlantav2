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

    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`${emotes[0]} | Vous n'êtes pas dans un salon de ticket !`);
        
        message.channel.send(`Pour confimer tapez -confirm`)
            .then((m) => {
              message.channel.awaitMessages(response => response.content === '-confirm', {
                max: 1,
                time: 10000,
                errors: ['time'],
              })
              .then((collected) => {
                  message.channel.delete();
                })
                .catch(() => {
                  m.edit('Temps écoulé, annulation.').then(m2 => {
                      m2.delete();
                  }, 3000);
                });
            });

}

module.exports.help = {
    name:"close",
    desc:"Ferme le ticket !",
    usage:"close",
    group:"tickets",
    examples:"$close"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"true",
    premium:"false",
    owner:"false"
}
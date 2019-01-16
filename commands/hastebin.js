const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
request = require('request');

const fetch = require('node-superfetch');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var content = args.join(' ');
    if(!args[0]) return errors.utilisation(message, data, emotes);

    fetch.post(`https://hastebin.com/documents`).send(content).then(body => {
        message.channel.send(`\`\`\`https://hastebin.com/${body.body.key}\`\`\``);
    });
  
}

module.exports.help = {
    name:"hastebin",
    desc:"Poste le texte/code sur hastebin !",
    usage:"hastebin [texte/code]",
    group:"général",
    examples:"$hastebin ceci est un message a poster sur hastebin !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
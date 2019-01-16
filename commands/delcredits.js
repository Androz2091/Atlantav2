const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var membre = message.mentions.members.first();
    if(!membre) return errors.utilisation(message, data, emotes);

    var nb_credits = args[1];
    if(isNaN(nb_credits) || !nb_credits) return errors.utilisation(message, data, emotes);

    users_data.substract(membre.id+'.credits', nb_credits);

    message.channel.send(emotes[1] + ' | '+nb_credits+' ajoutés à **'+membre.user.username+'** !');
    
}

module.exports.help = {
    name:"delcredits",
    desc:"Enlève des crédits au membre !",
    usage:"delcredits [@membre] [nombre]",
    group:"owner",
    examples:"$delcredits @Androz#2425 40"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
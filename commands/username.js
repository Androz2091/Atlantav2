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

    var the_pseudo = message.author.username;

    if(args[0]){
        the_pseudo = args.join(' ');
    }

    var the_users = '';

    var users_count = 0;
    var good_users_count = 0;

    bot.users.forEach(element => {
        if(element.username === the_pseudo){
            if(element.bot){
                return the_users += '- '+element.username + '#'+element.discriminator+' | ID : '+element.id+' | Cet utilisateur est un bot\n';
            }
            the_users += '- '+element.username + '#'+element.discriminator+' | ID : '+element.id+'\n';
            good_users_count++;
        }
        users_count++;
    });

    if(good_users_count === 0){
        return message.channel.send(emotes[0] + ' | Aucun utilisateur trouvé...');
    }
    if(good_users_count === 1){
        return message.channel.send('Utilisateurs possédant le pseudo `'+the_pseudo+'` ('+good_users_count+' membre) : \n'+the_users);
    }
    message.channel.send('Utilisateurs possédant le pseudo `'+the_pseudo+'` ('+good_users_count+' membres) : \n'+the_users);

}

module.exports.help = {
    name:"username",
    desc:"Renvoie tout les utilisateurs possédant le pseudo !",
    usage:"username (pseudo)",
    group:"fun",
    examples:"$username Androz\n$username"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
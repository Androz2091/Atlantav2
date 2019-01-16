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

    var the_tag = message.author.discriminator;

    if(args[0]){
        var potentiel_tag = args[0];
        if(potentiel_tag.length === 5){ // #0000
            if(potentiel_tag.startsWith('#')){
                potentiel_tag = potentiel_tag.substr(1); // 0000
                if(!isNaN(potentiel_tag)){
                    the_tag = potentiel_tag;
                }
            }
        }
        if(potentiel_tag.length === 4){
            if(!isNaN(potentiel_tag)){
                the_tag = potentiel_tag;
            }
        }
    }

    var the_users = '';

    var users_count = 0;
    var good_users_count = 0;

    bot.users.forEach(element => {
        if(element.discriminator === String(the_tag)){
            the_users += '- '+element.username + ' (#'+the_tag+')\n';
            good_users_count++;
        }
        users_count++;
    });

    if(good_users_count === 0){
        return message.channel.send(emotes[0] + ' | Aucun utilisateur trouvé avec le tag `'+the_tag+'` !');
    }
    if(good_users_count === 1){
        return message.channel.send('Utilisateurs possédant le tag `'+the_tag+'` ('+good_users_count+' membre) : \n'+the_users);
    }
    message.channel.send('Utilisateurs possédant le tag `'+the_tag+'` ('+good_users_count+' membres) : \n'+the_users).catch(err =>{
        message.channel.send(emotes[0] +' | + de 1500 utilisateurs possèdent ce tag !')
    })

}

module.exports.help = {
    name:"tag",
    desc:"Renvoie tout les utilisateurs possédant le tag !",
    usage:"tag (#tag)",
    group:"fun",
    examples:"$tag\n$tag #6688"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
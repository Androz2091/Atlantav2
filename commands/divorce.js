const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
   
    if(data.author_data.partenaire === "non") return message.channel.send(emotes[0] +' | Vous n\'êtes pas marié(e) !');

    else {
        var part_id = data.author_data.partenaire;
        users_data.set(part_id+'.partenaire', "non");
        users_data.set(message.author.id+'.partenaire', "non");
        if(users_data.get(part_id).old_partenaires.indexOf(message.author.id) < 0){
            users_data.push(part_id+'.old_partenaires', message.author.id);

        }
        if(users_data.get(message.author.id).old_partenaires.indexOf(part_id) < 0){    
            users_data.push(message.author.id+'.old_partenaires', part_id);
        }
        message.channel.send(emotes[1] +' | Vous venez de divorcer ! Vous êtes maintenant tout(e) seul(e) !');
    }
}

module.exports.help = {
    name:"divorce",
    desc:"Divorcez avec la personne ! Elle ne s'affichera plus sur votre profil !",
    usage:"divorce",
    group:"économie",
    examples:"$divorce"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
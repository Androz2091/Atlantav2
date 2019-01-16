const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
   
    var the_desc = args.join(' ');
    if(!args[1]) return errors.utilisation(message, data, emotes);
    if(the_desc.length > 70) return message.channel.send(emotes[0] + ' | La description ne doit pas exéder les 70 caractères !');

    users_data.set(message.author.id+'.desc', the_desc);

    message.channel.send(emotes[1] +' | Description mise à jour !');

}

module.exports.help = {
    name:"setdescription",
    desc:"Choisissez une nouvelle description qui s'affichera sur votre profil !",
    usage:"setdescription [description]",
    group:"économie",
    examples:"$setdescription 17 ans, curieux, sans micro\n$setdescription Développeur C++"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
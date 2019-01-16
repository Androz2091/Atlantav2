const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');

module.exports.run = async (message, color, emotes) => {
    
    var the_guild = message.guild;

    let result = Math.floor((Math.random() * the_guild.memberCount));

    var players = functions.sortByKey(the_guild.members, 'id');

    var pos = 0;

    var the_user = false;

    players.forEach(element => {
        if(pos === result){
            the_user = element;
        }
        pos++;
    });

    var embed = new Discord.RichEmbed()
        .addField('Pseudo', the_user.user.username, true)
        .addField('Tag', the_user.user.discriminator, true)
        .addField('ID', the_user.user.id, true)
        .addField('Rôle + Haut', the_user.highestRole, true)
        .setThumbnail(the_user.user.avatarURL)
        .setColor(color);
    message.channel.send(emotes[1]+' | Membre désigné !', embed);

}

module.exports.help = {
    name:"someone",
    desc:"Tirez un membre aléatoire de votre serveur !",
    usage:"someone [@membre]",
    group:"modération",
    examples:"$someone"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
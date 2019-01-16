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

    if(!args[0]) return message.reply('entre ' + data.guild_data.prefix + 'pile-face [pile/face] !');

    var p_o_f = args[0]; // Retourne "Pile" ou "Face";

    p_o_f = p_o_f.toLowerCase();

    if(p_o_f !== "pile" && p_o_f !== "face"){
        return message.reply('entre ' + data.guild_data.prefix + 'pile-face [pile/face] !');
    }

    // 1 = pile | 2 = face
    min = Math.ceil(1);
    max = Math.floor(3);

    let result = Math.floor(Math.random() * (max - min)) + min;

    //Si le result est pile
    if(result === 1 && p_o_f === "pile"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Bravo ! Vous avez fait Pile et vous avez gagné !')
            .addField("Votre Choix", 'Pile')
            .addField("Le résultat", 'Pile')
            .setColor(data.embed_color)
        message.channel.send(good_embed);
        
    }
    if(result === 1 && p_o_f === "face"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Dommage ! Vous avez fait Pile et vous avez perdu !')
            .addField("Votre Choix", 'Face')
            .addField("Le résultat", 'Pile')
            .setColor(data.embed_color)
        message.channel.send(good_embed);
        
    }
    //Si result est face
    if(result === 2 && p_o_f === "face"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Bravo ! Vous avez fait Face et vous avez gagné !')
            .addField("Votre Choix", 'Face')
            .addField("Le résultat", 'Face')
            .setColor(data.embed_color)
        message.channel.send(good_embed);
        
    }
    if(result === 2 && p_o_f === "pile"){

        var good_embed = new Discord.RichEmbed()
            .setAuthor('Dommage ! Vous avez fait Face et vous avez perdu !')
            .addField("Votre Choix", 'Pile')
            .addField("Le résultat", 'Face')
            .setColor(data.embed_color)
        message.channel.send(good_embed);
        
    }
}

module.exports.help = {
    name:"pile-face",
    desc:"Tire aléatoirement pile ou face !",
    usage:"pile-face [pile/face]",
    group:"fun",
    examples:"$pile-face pile\n$pile-face face "
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
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

    var the_member = message.mentions.members.first();

    if(!args[0]){
      the_member = message.member;
    }
    if(!the_member && args[0]){
        the_member = message.guild.members.get(args[0]);
        if(!the_member) return errors.utilisation(message, data, emotes);
    }

    if(the_member.user.bot){
        return message.channel.send('Cet utilisateur est un bot, impossible d\'accéder aux stats de celui - ci.');
    }

    let pseudo = the_member.user.username;
    let tag = the_member.user.discriminator;
    let date_join = functions.printDate(the_member.joinedAt, true);
    let lastmsg = the_member.lastMessage;
    let id = the_member.id;
    let nickname = the_member.nickname;
    let avatar = the_member.avatarURL;
    let date_created = functions.printDate(the_member.user.createdAt, true);
    let salon = (the_member.voiceChannelID) ? 'Connecté dans ' + message.guild.channels.get(the_member.voiceChannelID).name :'Non connecté';


    if(!nickname){
      nickname = 'Pas de surnom'
    }
    if(!lastmsg){
      lastmsg = 'Ce membre n\'a pas envoyé de message depuis mon dernier redémarrage.'
    }
    let jeu = the_member.presence.game;
    if(!jeu){
      jeu = 'Pas de jeu'
    }
    let status = the_member.presence.status;
    if(status === "dnd"){
      status = 'Ne pas déranger'
    }
    if(status === "idle"){
      status = 'Inactif - AFK '
    }
    if(status === "online"){
      status = 'En ligne'
    }
    if(status === "offline"){
      status = 'Déconnecté'
    }

    let embed = new Discord.RichEmbed()
        .setAuthor('Informations sur ' + pseudo)
        .setThumbnail(avatar)
        .setColor(data.embed_color)
        .addField('Pseudo', pseudo)
        .addField('Tag', tag)
        .addField('Surnom', nickname)
        .addField('Id', id)
        .addField('Date d\'arrivée sur '+message.guild.name, date_join)
        .addField('Date de création du compte', date_created)
        .addField('Dernier message', lastmsg)
        .addField('Connexion à un salon vocal', salon)
        .addField('Jeu', jeu)
        .addField('Statut', status)
        .setFooter(data.footer, avatar)

    message.channel.send(embed);

}

module.exports.help = {
    name:"userinfo",
    desc:"Obtiens des informations sur un utilisateur !",
    usage:"userinfo [@membre/ID]",
    group:"général",
    examples:"$userinfo @Androz#2425\n$userinfo 369886174766039050"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
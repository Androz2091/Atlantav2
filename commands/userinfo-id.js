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

    if(!args[0]){
        return message.reply('Entre une ID valide.');
    }

    bot.fetchUser(args[0]).then(id => {

        if(message.guild.members.get(args[0])) return message.channel.send(emotes[0] +' | Ce membre est sur le serveur ! Utilise simplement : ```' + data.guild_data.prefix + 'userinfo '+id.id+' ou @'+id.username+'```');

        let pseudo = id.username;
        let tag = id.discriminator;
        let the_id = id.id;
        let avatar = id.avatarURL;
        let date_created = functions.printDate(id.createdAt);

        let jeu = id.presence.game;
        if(!jeu){
        jeu = 'Pas de jeu'
        }
        let status = id.presence.status;
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
            .setAuthor('Informations sur ' + pseudo, avatar)
            .setThumbnail(avatar)
            .setColor(data.embed_color)
            .addField('Pseudo', pseudo)
            .addField('Tag', tag)
            .addField('Id', the_id)
            .addField('Date de création du compte', date_created)
            .addField('Jeu', jeu)
            .addField('Statut', status)
            .setFooter(data.footer, avatar)


        if(id.bot){
            embed.addField('Robot', 'Oui')
        }

        message.channel.send(embed);
    }).catch(err =>{
        message.channel.send('Entre une ID valide !')
    })
}

module.exports.help = {
    name:"userinfo-id",
    desc:"Obtiens des informations sur un utilisateur, même si il n'est pas sur un de mes serveurs !",
    usage:"userinfo-id [ID]",
    group:"général",
    examples:"$userinfo-id 369886174766039050"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
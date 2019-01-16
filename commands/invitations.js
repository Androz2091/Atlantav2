const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs'),
arraySort = require('array-sort'), // This will be used for sorting arrays
table = require('table'); // This will be used for preparing the output to a table
send = require('quick.hook'); // This will be used for creating & sending webhooks

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    let membre = (message.mentions.members.first()) ? message.mentions.members.first() : message.member;

    let invites = message.guild.fetchInvites().catch(error => { // This will store all of the invites into the variable

    }).then(invites =>{
      //my_invites = invites.find(invite => invite.inviter.id === message.author.id);
      console.log(invites)
      var my_invites = invites.filter(invite => invite.inviter === membre.user);

      if(my_invites.size <= 0) return message.channel.send(emotes[0] + ' | Actuellement aucune invitation !')

      var uses_count = 0;

      var codes = '';

      my_invites.forEach(element => {
        console.log(element.temporary);
        var isExpire = (element.temporary) ? 'Oui' : 'Jamais'
        uses_count += element.uses;
        codes += '**'+element.code+'** ('+element.uses+' utilisations) | '+element.channel+'\n';
      });
      
      const embed = new Discord.RichEmbed()
        .setColor(data.embed_color)
        .setAuthor('Invites Tracker')
        .setDescription('Informations sur les invitations de '+membre+' sur '+message.guild.name)
        .addField('👥 Personnes Invitées', uses_count + ' membres')
        .addField('🔑 Codes', codes) // This 

      message.channel.send(embed);
    });


}

module.exports.help = {
    name:"invitations",
    desc:"Affiche les invitations du membre !",
    usage:"invitations",
    group:"général",
    examples:"$invitations @Androz#2425\n$invitations"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
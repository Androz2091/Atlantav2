const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
   
    if(!data.membersdata) return errors.utilisation(message, data, emotes);

    var membre = message.mentions.members.first();

    if(data.author_data.partenaire !== "non") return message.channel.send(emotes[0] +' | Vous êtes déjà marié(e) ! Utilisez d\'abord `'+data.guild_data.prefix+'divorce` pour divorcer !');
    if(data.membersdata[0].partenaire !== "non") return message.channel.send(emotes[0] +' | La place est déjà prise, compagnon ! '+membre+' est déjà marié(é) !');

    else {
        message.channel.send(emotes[2] + ' | '+membre+', acceptez vous d\'épouser '+message.author+' ? [oui/non]');

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === membre.id, { time: 120000 });
        
        collector.on('collect', message => {
            if(message.content.toLowerCase() === "oui"){
                return collector.stop('yep');
            }
            if(message.content.toLowerCase() === "non"){
                return collector.stop('nop');
            }
        });

        collector.on('end', (collected, reason) => {
            if(reason === 'time'){
                return message.channel.send(emotes[0] + ' | '+membre+' n\'a pas répondu... Attendez qu\'il/elle soit connecté(e) puis réessayez !')
            }
            if(reason === 'yep'){
                users_data.set(message.author.id+'.partenaire', membre.id);
                users_data.set(membre.id+'.partenaire', message.author.id);
                return message.channel.send(emotes[1] + ' | '+message.author+', j\'ai une bonne nouvelle... votre demande en mariage vient d\'être acceptée !')
            }
            if(reason === 'nop'){
                return message.channel.send(emotes[0] + ' | '+message.author+', j\'ai une mauvaise nouvelle... '+membre+' a refusé votre demande en mariage !')
            }

        });
    }
}

module.exports.help = {
    name:"mariage",
    desc:"Mariez-vous avec votre âme soeur ! Elle s'affichera sur votre profil !",
    usage:"mariage [@membre]",
    group:"économie",
    examples:"$mariage @Hunam#6067\n$mariage @Androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var owner_id = message.guild.ownerID;
    if(message.author.id !== owner_id && message.author.id !== config.owner_id) return message.channel.send(emotes[0] +' | Seul le fondateur du Discord peut taper cette commande !');

    message.channel.send(emotes[2] + ' | Êtes-vous sur de vouloir réinitaliser le Discord ? Entrez "oui" ou "non". Tout les salons, rôles, messages seront définitivement supprimés. Les membres ne seront pas expulsés.');

    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

    collector.on('collect', message =>{
        if(message.content.toLowerCase() === "oui"){
            collector.stop("oui");
        } else if(message.content.toLowerCase() === "non"){
            collector.stop("non");
        } else {
            return message.channel.send(emotes[2] +' | Répondez oui ou non !');
        }
    });

    collector.on('end', (collected, reason) =>{
        if(reason === "oui"){
            var myid = bot.user.id;
            var membre = message.guild.members.get(myid);
            if(!membre.hasPermission('ADMINISTRATOR')){
                return message.channel.send(emotes[0] +' | Pour que je puisse supprimer les salons & supprimer les rôles, j\'ai besoin des permissions Administrateur !')
            }
            return destroy(message.guild);
        }
        if(reason === "non"){
            message.channel.send(emotes[0] +' | Action correctement annulée !');
        }
    });

    function destroy(guild){
        guild.channels.forEach(element => {
            element.delete();
        });
        guild.roles.forEach(element =>{
            var hrole = message.guild.members.get(bot.user.id).highestRole;
            if(element.name !== "@everyone" && element.position < hrole.position){
                element.delete();
            }
        });
        guild.setName('[RESET] - '+guild.name);
        guild.setIcon();
        guild.setAFKChannel();
        guild.createChannel('reset').then(channel =>{
            channel.send(emotes[1] +' | Serveur réinitialisé !');
        });
    };
}

module.exports.help = {
    name:"reset-discord",
    desc:"Tout les salons, rôles, messages seront définitivement supprimés. Les membres ne seront pas expulsés.",
    usage:"reset-discord",
    group:"administration",
    examples:"$reset-discord"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
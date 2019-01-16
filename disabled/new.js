const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

const request = require('request');
const keys = require('../data/keys.json');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(data.guild_data.tickets !== 'enabled') return message.channel.send(emotes[0]+' | Les tickets ne sont pas autorisés sur ce serveur !');

    var role = message.guild.roles.find(e => e.name === 'Staff');
    if(!role) return message.channel.send(emotes[0]+' | Veuillez demander aux administrateurs de créer un rôle "Staff" qui aura accès aux tickets !');

    var time = 0;
    var categorie = message.guild.channels.filter(e => e.type === 'category').filter(e => e.name === 'Tickets');
    if(!categorie){
        time = 1400;
        message.guild.createChannel('ddd', 'category', null, undefined).then(md => {
            categorie = md;
        });
    }

    setTimeout(function(){
        const reason = message.content.split(" ").slice(1).join(" ");

        if (message.guild.channels.some(e => e.name === "ticket-" + message.author.id)){
            var the_channel = message.guild.channels.find(ch => ch.name === "ticket-" + message.author.id);
            return message.channel.send(`${emotes[0]} | Vous avez déjà un ticket ouvert ! (`+the_channel+')');
        }
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            c.setParent(categorie);
            let role = message.guild.roles.get(role.id);
            let role2 = message.guild.roles.find(r => r.name === '@everyone');
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`${emotes[1]} | Votre ticket a été ouvert, <#${c.id}>.`);
            const embed = new Discord.RichEmbed()
            .setColor(data.embed_color)
            .addField(`Bienvenue ${message.author.username}!`, `Veuillez nous en dire un peu plus sur votre demande d'aide !`)
            .setTimestamp()
            .setFooter('Tape '+data.guild_data.prefix+'close pour fermer le ticket');
            c.send('<@&'+role.id+'>', embed);
        }).catch(err =>{
            return message.channel.send(emotes[2]+' | Je ne peux pas créer de salon !');
        });
    }, time);
    

}

module.exports.help = {
    name:"new",
    desc:"Créé un nouveau ticket !",
    usage:"new (raison)",
    group:"tickets",
    examples:"$new\n$new Besoin d'aide !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"true",
    premium:"false",
    owner:"false"
}
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

    var the_name = args[0];

   if(!the_name) return errors.utilisation(message, data, emotes);

   var the_emote = message.guild.emojis.find(e => e.name === the_name);

   if(!the_emote) the_emote = bot.emojis.find(e => e.name === the_name);

   if(!the_emote) return message.channel.send(emotes[0] + ' | Emote introuvable !')

   message.delete();

    if(!args[1]){
        setTimeout(function(){
            message.channel.fetchMessages({ limit: 1 }).then(messages => {
                var the_message = messages.first();
                the_message.react(the_emote).catch(err =>{
                    return message.reply('une erreur est survenue...');
                });
            }).catch(err => {
                return message.reply('pas de message dans ce salon...');
            });
        }, ms('1.5s'));
    }
    if(args[1] && !args[2]){
        if(isNaN(args[1])) return message.reply('entre une ID de salon valide !');
        var the_channel = bot.channels.get(args[1]);
        if(!the_channel) return message.reply('le salon avec comme ID `'+args[1]+'` n\'a pas été trouvé...');
        setTimeout(function(){
            the_channel.fetchMessages({ limit: 1 }).then(messages => {
                var the_message = messages.first();
                the_message.react(the_emote).catch(err =>{
                    return message.reply('une erreur est survenue...');
                });
            }).catch(err =>{
                return message.reply('pas de message dans ce salon...');
            });
        }, ms('1.5s'));
    }
    if(args[1] && args[2]){
        if(isNaN(args[1])) return message.reply('entre une ID de channel valide !');
        if(isNaN(args[2])) return message.reply('entre une ID de message valide !');
        var the_channel = bot.channels.get(args[1]);
        if(!the_channel) return message.reply('le salon avec comme ID `'+args[1]+'` n\'a pas été trouvé...');
        setTimeout(function(){
            the_channel.fetchMessage(args[2]).then(m => {
                m.react(the_emote);
            }).catch(err =>{
                return message.reply('le message avec l\'ID `'+args[2]+'` n\'a pas été trouvé...');
            });
        }, ms('1.5s'));
        
    }

}

module.exports.help = {
    name:"react",
    desc:"Ajout un émoji au serveur !",
    usage:"react [reaction] (id-channel) (id-message)",
    group:"général",
    examples:"$react rip\nreact rip 520335161905250307 520679047366443028"
}

module.exports.settings = {
    permissions:"MANAGE_EMOJIS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
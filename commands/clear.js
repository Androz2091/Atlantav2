const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var to_delete;

    if(!args[0]) return errors.utilisation(message, data, emotes);

    if(isNaN(args[0]) == true) return message.channel.send(emotes[0] + " | Nombre invalide.");

    if(args[0] === "0") return message.channel.send(emotes[0] + " | Impossible de supprimer 0 message.");
    let messageSupprimer = parseInt(args[0]);

    if(messageSupprimer > 99) messageSupprimer = 99;

    let messages = await message.channel.fetchMessages({limit: 100});

    if(message.mentions.members.size > 0) {
        messages = messages.array().filter(m=>m.author.id === message.mentions.members.first().id);
        messages.length = messageSupprimer;
    } else {
        messages = messages.array();
        messages.length = messageSupprimer;
    }

    message.channel.bulkDelete(messages);

    if(message.mentions.members.size > 0) message.channel.send(emotes[1] + ' | '+args[0]+ ' messages de **'+message.mentions.members.first().user.username+'#'+message.mentions.members.first().user.discriminator+'** supprimés !').then(m =>{
        setTimeout(function(){
            m.delete();
        }, ms('2s'));
    })
    else message.channel.send(emotes[1] + ' | '+args[0]+ ' messages supprimés !').then(m =>{
        m.delete();
    }, ms('2s'));

    var the_channel = message.guild.channels.get(data.guild_data.logs_plugin.channel);
    
    if(the_channel) return the_channel.send('**'+message.author.username+'#'+message.author.discriminator+'** a supprimé **'+args[0]+'** messages dans **'+message.channel.name+'**');
}

module.exports.help = {
    name:"clear",
    desc:"Supprime le nombre de messages donné instantanément",
    usage:"clear [nombre] [@membre]",
    group:"modération",
    examples:"$clear 18"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
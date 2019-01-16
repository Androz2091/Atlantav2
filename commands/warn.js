const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');
var warns = new quickdb.table('warns');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var member = message.mentions.members.first();
    if(!member) return errors.utilisation(message, data, emotes);

    var reason = args.slice(1).join(' ');
    if(!reason) return errors.utilisation(message, data, emotes);


    var ctase = warns.get(message.guild.id+'.case');
    if(!ctase){
        warns.set(message.guild.id+'.case', 0);
        ctase = warns.get(message.guild.id+'.case');
    }

    warns.add(message.guild.id+'.case', 1);
    ctase++;

    var cwarns = warns.get(message.guild.id+'.'+member.id);
    if(!cwarns){
        warns.set(message.guild.id+'.'+member.id, []);
        cwarns = warns.get(message.guild.id+'.'+member.id);
    }
    var nb_warns = cwarns.length;

    var isKick = (data.guild_data.warns_sanctions['kick']) ? data.guild_data.warns_sanctions['kick'] : 10000;
    var isBan = (data.guild_data.warns_sanctions['ban']) ? data.guild_data.warns_sanctions['ban'] : 10000;

    var object = {
        date:Date.now(),
        moderator:message.author.id,
        case:ctase,
        reason:reason
    }

    var array = [];
    cwarns.forEach(element => {
        array.push(element);
    });
    array.push(object);
    warns.set(message.guild.id+'.'+member.id, array);

    if(isKick <= nb_warns){
        member.send(emotes[2]+' | Tu viens d\'être expulsé de **'+message.guild.name+'** car tu avais plus de '+nb_warns+' avertissements.');
        member.kick('> '+isKick+' warns');
        return message.channel.send(emotes[2]+' | **'+member.user.username+'** vient d\'être expulsé car il avait plus de '+nb_warns+' avertissements.');
    } else if(isBan <= nb_warns){
        member.send(emotes[2]+' | Tu viens d\'être banni de **'+message.guild.name+'** car tu avais plus de '+nb_warns+' avertissements.');
        member.ban('> '+isKick+' warns');
        return message.channel.send(emotes[2]+' | **'+member.user.username+'** vient d\'être banni car il avait plus de '+nb_warns+' avertissements.');
    } else {
        message.channel.send(emotes[2]+' | **'+member.user.username+'** vient d\'être averti par message privé !.');
        member.send(emotes[2]+' | Tu viens d\'être averti sur **'+message.guild.name+'** par **'+message.author.username+'#'+message.author.discriminator+'** pour la raison suivante : **'+reason+'**');
    }

}

module.exports.help = {
    name:"warn",
    desc:"Avertissez un membre !",
    usage:"warn [@membre] [raison]",
    group:"modération",
    examples:"$warn @Androz Spam"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
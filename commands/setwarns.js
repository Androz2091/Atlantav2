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
    
    var nombre = args[0];
    if(!nombre || isNaN(nombre)) return errors.utilisation(message, data, emotes);
    if(nombre < 1 || nombre > 100) return message.channel.send(emotes[0]+' | Veuillez indiquer un nombre valide entre 1 et 100.');
    
    var sanction = args[1];
    if(!sanction) return errors.utilisation(message, data, emotes);

    if(sanction === 'kick'){
        if(!data.guild_data['kick']){
            for(var sanction in data.guild_data.warns_sanctions){
                var nb = data.guild_data.warns_sanctions[sanction];
                if(nb === nombre) return message.channel.send(emotes[0] +' | Une sanction ('+sanction+') est déjà définie lorsqu\'un membre atteint les '+nombre+' warns. Veuillez d\'abord taper `'+data.guild_data.prefix+'setwarns '+nombre+' reset` puis réessayez.');
            }
            servers_data.set(message.guild.id+'.warns_sanctions.kick', nombre);
            return message.channel.send(emotes[1]+' | Configuration enregistrée ! Lorsqu\'un membre aura atteint les '+nombre+' warns, il sera expulsé. Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
        } else {
            return message.channel.send(emotes[0]+' | La sanction kick est déjà prévue pour les `'+data.guild_data.prefix+'setwarns '+data.guild_data['kick']+' reset` puis réessayez.');
        }
    }

    if(sanction === 'ban'){
        if(!data.guild_data['ban']){
            for(var sanction in data.guild_data.warns_sanctions){
                var nb = data.guild_data.warns_sanctions[sanction];
                if(nb === nombre) return message.channel.send(emotes[0] +' | Une sanction ('+sanction+') est déjà définie lorsqu\'un membre atteint les '+nombre+' warns. Veuillez d\'abord taper `'+data.guild_data.prefix+'setwarns '+nombre+' reset` puis réessayez.');
            }
            servers_data.set(message.guild.id+'.warns_sanctions.ban', nombre);
            return message.channel.send(emotes[1]+' | Configuration enregistrée ! Lorsqu\'un membre aura atteint les '+nombre+' warns, il sera banni. Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
        } else {
            return message.channel.send(emotes[0]+' | La sanction ban est déjà prévue pour les `'+data.guild_data.prefix+'setwarns '+data.guild_data['kick']+' reset` puis réessayez.');
        }
    }

    if(sanction === 'reset'){
        for(var sanction in data.guild_data.warns_sanctions){
            var nb = data.guild_data.warns_sanctions[sanction];
            if(nb === nombre){
                servers_data.delete(message.guild.id+'.warns_sanctions.'+sanction);
                return message.channel.send(emotes[1] +' | La sanction correspondant à '+nombre+' warns ('+sanction+') vient d\'être supprimée. Tapez `'+data.guild_data.prefix+'configuration` pour voir votre nouvelle configuration !');
            }
        }
        return message.channel.send(emotes[0]+' | Aucune sanction ne correspondait à '+nombre+' warns !');
    }

}

module.exports.help = {
    name:"setwarns",
    desc:"Définissez les sanctions qu'obtiendront les membres au bout d'un certain nombre de warns !",
    usage:"setwarns [nombre] [kick/ban/reset]",
    group:"modération",
    examples:"$setwarns 4 kick <= quand un membre atteindra les 4 warns, il sera kick.\n$setwarns 4 reset <= reset la sanction définie lorsqu'un membre atteint les 4 warns."
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
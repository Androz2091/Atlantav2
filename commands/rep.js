const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');
var rep_cooldown = new quickdb.table('repcooldown');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var membre = message.mentions.members.first();
    if(!membre) return errors.utilisation(message, data, emotes);

    var ts = rep_cooldown.get(message.author.id);
    if(ts){
        if(ts > Date.now()){
            var delai = functions.convertMs(ts - Date.now()); 
            return message.channel.send(emotes[0] + ' | Vous devez attendre '+delai+' avant de pouvoir de nouveau donner un point de réputation !');
        }
    }

    if(membre.user.id === message.author.id) return message.channel.send(emotes[0] +' | Vous ne pouvez pas vous récompenser vous-même !');
    
    var towait = Date.now() + ms('6h');
    rep_cooldown.set(message.author.id, towait);
    
    users_data.add(membre.id+'.rep', 1);

    message.channel.send(emotes[1] + ' | Vous venez de donner un point de réputation à '+membre +' !');

}

module.exports.help = {
    name:"rep",
    desc:"Quelqu'un vous a aidez et vous voulez remerciez ? Donnez lui un point de réputation !",
    usage:"rep [@membre]",
    group:"économie",
    examples:"$rep @Androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
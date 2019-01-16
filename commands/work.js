const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');
var work_cooldown = new quickdb.table('workcooldown');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var ts = work_cooldown.get(message.author.id);
    if(ts){
        if(ts > Date.now()){
            var delai = functions.convertMs(ts - Date.now()); 
            return message.channel.send(emotes[0] + ' | Vous devez attendre '+delai+' avant de pouvoir de nouveau travailler !');
        }
    }
    
    var towait = Date.now() + ms('6h');
    work_cooldown.set(message.author.id, towait);

    var to_add_credits = functions.getRandomNum(150, 200);

    var isprem = '';

    if(data.author_data.premium === "oui"){
        to_add_credits = to_add_credits * 2;
        isprem = ' premium'
    }

    var embed = new Discord.RichEmbed()
        .setAuthor('Salaire'+isprem+' récupéré !')
        .setDescription(to_add_credits+' crédits ajoutés à votre compte !')
        .setFooter('Pour les Premium, le salaire est doublé !')
        .setColor(data.embed_color)
        .setTimestamp()
    
    users_data.add(message.author.id+'.credits', to_add_credits);

    message.channel.send(embed);

}

module.exports.help = {
    name:"work",
    desc:"Vous travaillez et gagnez de l'argent ! Vous ne pouvez travailler uniquement toutes les 6h !",
    usage:"work",
    group:"économie",
    examples:"$work"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
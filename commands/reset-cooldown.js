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
var rep_cooldown = new quickdb.table('repcooldown');

module.exports.run = async (message, args, bot, emotes, data) => {
   
    var membre = (message.mentions.members.first()) ? message.mentions.members.first() : message.member;
    var command = args[0];
    if(!command) return errors.utilisation(message, data, emotes);

    var valid_commands = [
        "work",
        "rep"
    ];

    if(valid_commands.indexOf(command) < 0){
        return message.channel.send(emotes[0] + ' | Commande introuvable !');
    }

    else {
        if(command === "work"){
            work_cooldown.set(membre.id, Date.now());
            message.channel.send(emotes[1]+' | Le cooldown de la commande `'+command+'` pour le membre `'+membre.user.username+'` a été reset !');
        }
        if(command === "rep"){
            rep_cooldown.set(membre.id, Date.now());
            message.channel.send(emotes[1]+' | Le cooldown de la commande `'+command+'` pour le membre `'+membre.user.username+'` a été reset !');
        }
    }

}

module.exports.help = {
    name:"reset-cooldown",
    desc:"Reset le cooldown du membre !",
    usage:"reset-cooldown [work/rep] [@membre]",
    group:"owner",
    examples:"$reset-cooldown work @Aquarius\n$reset-cooldown rep BredouilleRouge#9199"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
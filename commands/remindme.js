const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var time = args[0];
    if(!time) return errors.utilisation(message, data, emotes);
    if(isNaN(ms(time))) return message.channel.send(emotes[0]+' | Veuillez entrer un temps valide ! (exemple : 3d ou 2h ou 3m, etc...)');

    var rappel = args.slice(1).join(' ');
    if(!rappel) return message.channel.send(emotes[0]+' | Vous devez entrer un message pour enregistrer le rappel !');
    
    var data = {
        "author":message.author.id,
        "msg":rappel,
        "registeredAt":Date.now()
    };

    var ftime = Date.now()+ms(time);
    ftime = Math.floor(ftime / 1000);
    ftime = String(ftime);
    var db = new quickdb.table('remindme');
    var cdata = db.get(ftime);
    if(!cdata) db.set(ftime, []);
    db.push(ftime, data);

    message.channel.send(emotes[1]+' | Rappel enregistré pour le '+functions.printDate(new Date(parseInt(Date.now()+ms(time))), true)+' !');
}

module.exports.help = {
    name:"remindme",
    desc:"Enregistrez un rappel !",
    usage:"remindme [temps] [message]",
    group:"général",
    examples:"$remindme 10m Bonjour :)"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false" 
}
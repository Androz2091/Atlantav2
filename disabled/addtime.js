const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
request = require('request');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(!args[0] || isNaN(ms(args[0]))) return errors.utilisation(message, data, emotes);


    var the_ts_now = new Date(Date.now() + ms(args[0]) + 3600000);

    message.channel.send(message.author + '```Résultat : '+args[0]+' + date actuelle = '+timeConverter(the_ts_now)+'```');


    function timeConverter(a){
        var months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }

}

module.exports.help = {
    name:"addtime",
    desc:"Vous donne la date après le temps indiqué",
    usage:"addtime [temps]",
    group:"général",
    examples:"$addtime 6h\n$addtime 5m\n$addtime 1000s"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
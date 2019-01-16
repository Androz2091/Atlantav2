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


    message.channel.send(emotes[2]+' | Chargement du leaderboard...');
    
    var new_db = [];

    var position = 0;

    users_data.fetchAll().forEach(element => {
        var id = element.ID;
        var credits = element.data.credits;
        var rep = element.data.rep;
        var g = {
            id:id,
            credits:credits,
            rep:rep
        }
        new_db.push(g);
    });

    var classed = functions.sortByKey(new_db, 'credits');

    classed.length = 20;
    
    var embed = new Discord.RichEmbed()
        .setAuthor('Leaderboard Atlanta', bot.user.displayAvatarURL)
        .setColor(data.embed_color)
        .setFooter(data.footer)

    var AsciiTable = require('ascii-table');

    var table = new AsciiTable('LEADERBOARD')
        table
          .setHeading('', 'Utilisateur', 'Argent', 'Réputation')
          
    var pos = 1;
    classed.forEach(element => {
        bot.fetchUser(element.id).then(user => {
            var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            _user = user.username.replace(regex, '');
            if(_user.length > 20) _user.length = 20
            table.addRow(pos, _user, element.credits, element.rep);
            pos++;
        });
    });
    setTimeout(function(){
        message.channel.send('```'+table.toString()+'```');
    }, 2000);
}

module.exports.help = {
    name:"leaderboard",
    desc:"Obtenez les membres les plus riches d'Atlanta !",
    usage:"leaderboard",
    group:"économie",
    examples:"$leaderboard"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
/*

    var new_db = [];

    var poss = 0;
    var f = users_data.fetchAll();
    
    f.forEach(element => {
        if(pos < 20){
            var id = element.ID;
            var credits = element.data.credits;
            var rep = element.data.rep;
            var g = {
                id:id,
                credits:credits,
                rep:rep
            }
            new_db.push(g);
            poss++;
        }
    });

    console.log(new_db);

    var classed = functions.sortByKey(new_db, 'credits');

    console.log(classed);

    var embed = new Discord.RichEmbed()
        .setAuthor('Leaderboard Atlanta', bot.user.displayAvatarURL)
        .setColor(data.embed_color)
        .setFooter(data.footer)

    var msg = "";
    var pos = 1;
    classed.forEach(element => {
        console.log('a');
        bot.fetchUser(element.id).then(user => {
            console.log('b')
            var string = `#${pos} | ${user.username}#${user.discriminator} (${element.credits} :dollar: ; ${element.rep} :tophat:)\n`;
            msg += string;
            pos++;
        });
    });
    embed.setDescription(msg);
    setTimeout(function(){
        console.log(msg);
        message.channel.send(embed);
    }, 3000)*/
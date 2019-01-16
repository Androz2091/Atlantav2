const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    message.channel.send(emotes[2]+ ' | Recherche des membres premium...');

    var premiums = users_data.fetchAll().filter(e => e.data.premium === 'oui');

    var msg = '';

    var embed = new Discord.RichEmbed()
        .setAuthor('Premiums Atlanta', bot.user.displayAvatarURL)
        .setColor(data.embed_color)
        .setFooter(data.footer)

    var AsciiTable = require('ascii-table');

    var table = new AsciiTable('LEADERBOARD')
        table
          .setHeading('Utilisateur', 'Argent', 'Réputation', 'ID')

    premiums.forEach(element => {
        bot.fetchUser(element.ID).then(user => { 
            var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            _user = user.username.replace(regex, '');
            if(_user.length > 20) _user.length = 20
            table.addRow(_user, element.data.credits, element.data.rep, element.ID);
        })
    });

    setTimeout(function(){
        message.channel.send('```'+table.toString()+'```');
    }, 3000);
}

module.exports.help = {
    name:"premiums",
    desc:"Affiche les membres premium !",
    usage:"premiums",
    group:"premium",
    examples:"$premiums"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
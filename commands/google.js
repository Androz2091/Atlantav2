const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

const google = require('google');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {


    google.resultsPerPage = 1
    var nextCounter = 0
    if(!args[0]) return errors.utilisation(message, data, emotes);

    var recherche = args.join(' ');

    google(recherche, function (err, res){
    if (err) console.error(err)
    
        var link = res.links[0];
        //console.log(link.title + ' - ' + link.href)
        //console.log(link.description + "\n")
        message.channel.send(link.title+' - '+link.href+'\n'+link.description);
        
    });

}

module.exports.help = {
    name:"google",
    desc:"Renvoie les premiers résultat Google !",
    usage:"google [recherche]",
    group:"général",
    examples:"$google Androz\n$google Atlanta BOT Discord"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
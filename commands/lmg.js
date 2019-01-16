const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(!args[0]) return errors.utilisation(message, data, emotes);
    message.delete();
    var the_request = args.join(' ');
    the_request = the_request.replace(/[' '_]/g,'+');
    the_request = 'http://lmgtfy.com/?q=' + the_request;
    message.channel.send(the_request);

}

module.exports.help = {
    name:"lmg",
    desc:"Génère un lien vers lmgtfy, un site au concept juste génial !",
    usage:"lmg [recherche]",
    group:"fun",
    examples:"$lmg Discord js ban commmand"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
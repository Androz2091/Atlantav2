const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_id = args[0];
    if(!the_id) return errors.utilisation(message, data, emotes);
    
    bot.fetchUser(the_id).then(user => {
        message.guild.ban(user).then( () => message.channel.send(emotes[1] +' | **'+user.username+'#'+user.discriminator+'** a bien été banni du serveur !'));
    }).catch(err => {
        return message.channel.send(emotes[0]+' | Aucun utilisateur ne possède l\'ID `'+the_id+'` !');
    })

}

module.exports.help = {
    name:"hackban",
    desc:"Ban un membre sans que celui-ci soit sur le serveur !",
    usage:"hackban [ID]",
    group:"modération",
    examples:"$hackban 374998960557199370"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}

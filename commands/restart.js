const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_id;
    var channel_id;
    
    message.channel.send(emotes[2]+' | Redémarrage en cours...').then(m => {
        the_id = m.id;
        channel_id = m.channel.id;
    });
    bot.destroy();
    bot.login(config.token).then( () => {
        bot.channels.get(channel_id).fetchMessage(the_id).then(the_m => {
            return the_m.edit(emotes[1]+' | Redémarrage effectué ! ');
        });
    });

}

module.exports.help = {
    name:"restart",
    desc:"Redémarre le bot !",
    usage:"restart",
    group:"owner",
    examples:"$restart"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
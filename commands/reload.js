const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    

    var command = args[0];
    if(!command) return errors.utilisation(message, data, emotes);
    
    message.channel.send(emotes[2]+' | Commande en cours de redémarrage...').then(m => {
        delete require.cache[require.resolve(`./${command}.js`)];
        m.edit(emotes[1]+' | Commande redémarrée !');
    });

}

module.exports.help = {
    name:"reload",
    desc:"Redémarre une commande !",
    usage:"reload [commande]",
    group:"owner",
    examples:"$reload ping"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var salon = message.channel;

    if(!data.guild_data.auto_purge){
        data.guild_data.auto_purge = [];
    }

    if(data.guild_data.auto_purge.indexOf(salon.id) > -1){
        var new_array = [];
        data.guild_data.auto_purge.forEach(element => {
            if(element !== salon.id) new_array.push(element);
        });
        servers_data.set(message.guild.id+'.auto_purge', new_array);
        return message.channel.send(emotes[1]+ ' | Auto-Purge désactivée pour ce salon !');
    } else {
        var current_channels = data.guild_data.auto_purge.length;
        if(current_channels > 3) return message.channel.send(emotes[0] + ' | Vous avez dépassé le quotat de 4 salons auto-purgés ! Veuillez en retirer quelques-un puis réessayez !');
        servers_data.push(message.guild.id+'.auto_purge', salon.id);
        return message.channel.send(emotes[1] + ' | Auto-Purge activée dans ce salon !');
    }

}

module.exports.help = {
    name:"auto-purge",
    desc:"Active / Désactive l'auto-purge dans le salon",
    usage:"auto-purge",
    group:"administration",
    examples:"$auto-purge"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
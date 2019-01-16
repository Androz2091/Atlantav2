const Discord = require("discord.js");
const fs = require("fs");
let config = require("../data/config.json");

module.exports.utilisation = (message, data, emotes) => {

    if(!message || !data) return console.log('[ERRORS] Manque argument message ou data !');

    var examples = data.command.help.examples.replace(/[$_]/g,data.guild_data.prefix);

    var embed = new Discord.RichEmbed()
        .setColor(config.embed_color)
        .setFooter(config.footer)
        .addField('Standard', data.guild_data.prefix+data.command.help.usage)
        .addField('Exemple(s)', examples)
    message.channel.send(emotes[0]+' | Veuillez vérifier les paramètres de la commande !', embed);

}
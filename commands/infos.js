const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs'),
{ version } = require("discord.js");
const moment = require("moment"); // npm install moment
require("moment-duration-format"); // npm install moment-duration-format

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    const duration = moment.duration(bot.uptime).format(" D [j], H [h], m [m], s [s]");
    const owner = bot.users.get(config.owner_id).username;

    const zeroCinquante = bot.guilds.filter(server => server.memberCount < 50);
    const cinquanteCent = bot.guilds.filter(server => server.memberCount > 50).filter(server => server.memberCount < 100);
    const centCinqCent = bot.guilds.filter(server => server.memberCount > 100).filter(server => server.memberCount < 500);
    const cinqcentMille = bot.guilds.filter(server => server.memberCount > 500).filter(server => server.memberCount < 1000);
    const moreMille = bot.guilds.filter(server => server.memberCount > 1000);

    var infobot = new Discord.RichEmbed()
        .setTitle("Informations sur " + bot.user.username)
        .addField(":clipboard: Nom :", bot.user.username, true)
        .addField(":wrench: Discriminateur :", "#" + bot.user.discriminator, true)
        .addField(":pushpin: Développeur :", owner, true)
        .addField(":open_file_folder: discord.js :", 'v'+version, true)
        .addField(":file_folder: node.js :", process.version, true)
        .addField(":gear: Ressources :", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB", true)
        .addField(":timer: Uptime :", duration, true)
        .addField('-------', 'Stats')
        .addField('Total', bot.guilds.size+' serveurs', true)
        .addField('Total', bot.users.size+' membres', true)
        .addField('Total', bot.channels.size+' salons', true)
        .addField('0 - 50 membres', zeroCinquante.size+' serveurs', true)
        .addField('50 - 100 membres', cinquanteCent.size+' serveurs', true)
        .addField('100 - 500 membres', centCinqCent.size+' serveurs', true)
        .addField('+ 1000 membres',moreMille.size+' serveurs',true)
        .setColor(data.embed_color)
    message.channel.send(infobot);

}

module.exports.help = {
    name:"infos",
    desc:"Affiche des infos sur le bot !",
    usage:"infos",
    group:"général",
    examples:"$infos"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
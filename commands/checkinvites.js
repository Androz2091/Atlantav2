const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
    return message.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Après une vérification intense, personne ne semble posséder d'invitations discord dans son jeu !");
}

module.exports.help = {
    name:"checkinvites",
    desc:"Vérifie si les membres n'ont pas d'invitations dans leurs jeux !",
    usage:"checkinvites",
    group:"modération",
    examples:"$checkinvites"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
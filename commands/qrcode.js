const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var texte = args[0];
    if(!texte) return message.reply('entre un texte !');

    var the_request = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+texte;

    var file_name = texte;

    message.channel.send('Génération de votre QR pour "' + texte + '" en cours...').then(m => {
        m.edit('QR code généré !');
    })

    message.channel.send({
        files: [{
          attachment: the_request,
          name: `${file_name}.png` //.gif si c'est un gif
        }]
    })


}

module.exports.help = {
    name:"qrcode",
    desc:"Génère une image QrCode scannable contenant votre texte !",
    usage:"qrcode [texte]",
    group:"fun",
    examples:"$qrcode Essaye, c'est sympa !"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
   
    if(!data.membersdata) return errors.utilisation(message, data, emotes);
    var membre = message.mentions.members.first();
    if(membre.id === message.author.id) return message.channel.send(emotes[0] +' | Je ne suis pas sur que vous payer vous-même soit très utile, étant donné qu\'une taxe de 10% est appliquée...');  
    var to_transfer = parseInt(args[1]);
    if(!to_transfer) return errors.utilisation(message, data, emotes);
    if(data.author_data.credits < to_transfer) return message.channel.send(emotes[0] +' | Vous ne possédez pas assez d\'argent pour payer '+to_transfer+' crédits !');

    var taxe=to_transfer/10;
    var to_add= to_transfer-taxe;

    users_data.add(membre.id+'.credits', to_transfer);
    users_data.subtract(message.author.id+'.credits', to_transfer);

    var embed = new Discord.RichEmbed()
        .setAuthor('Détails du paiement')
        .addField('Crédits','Payé : '+to_transfer+'\nReçu : '+to_add+'\nTaxe (10%) : '+taxe)
        .addField('Membres', 'Depuis : '+message.author+"\nVers : "+membre)
        .setFooter(data.footer)
        .setColor(data.embed_color);
    
    message.channel.send(emotes[1]+' | Succès',embed);
       
}

module.exports.help = {
    name:"pay",
    desc:"Payez un membre ! Taxe de 10%s",
    usage:"pay [@membre] [montant]",
    group:"économie",
    examples:"$pay @Hunam#6067 30\n$pay @Androz#2425 200"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
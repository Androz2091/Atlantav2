const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    message.channel.startTyping();

    if(args[0] === "help"){

        var embed = new Discord.RichEmbed()
            .setAuthor('Profil | Page d\'aide')
            .addField('🔮 Niveaux & XP', 'Vous gagnez de l\'xp en parlant ! Celui-ci sert à vous faire passer des niveaux et à obtenir une place plus haute dans le classement !')
            .addField('🎩 Réputation', 'Vous gagnez un point de réputation lorsqu\'un membre tape `'+prefix+'rep [@vous]` ! Par exemple, si vous aidez quelqu\'un, celui-ci peut vous remercier avec un point de réputation !')
            .addField('💳 Argent', 'Récupérer des crédits avec le `'+prefix+'daily` ! Avec des crédits, vous pouvez acheter des rôles, et de futures cosmétiques')
            .addField('🤵 Inviteur', 'Indique si vous êtes propriétaire d\'un serveur avec Atlanta dessus !')
            .addField('👑 Premium', 'Pour être Premium il faut soit :\n - Être Partenaire\n - Être Donateur\n - Être propriétaire de + de 3 serveurs avec Atlanta dessus !\nPour recevoir le premium, venez sur le support !')
            .setColor('#990033')
            .setFooter('Atlanta | '+guild_data.prefix+'profile')
            .setTimestamp();

        message.channel.stopTyping();
        return message.channel.send(embed);
    }
    
    
    var membre = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member;
    var the_membre_data = (data.membersdata) ? data.membersdata[0] : data.author_data;

    var embed = new Discord.RichEmbed()
        .setAuthor('Profil de ' + membre.user.username)
        .addField('📝 Pseudo', membre.user.username+'#'+membre.user.discriminator, true)
        .addField('📊 Niveau','**'+the_membre_data.niv.level+"**", true)
        .addField('🔮 Expérience', '**'+the_membre_data.niv.xp+"**" + ' xp', true)
        .addField('🎩 Réputation','**'+ the_membre_data.rep+"**" + ' points', true)
        .addField('💳 Argent', '**'+the_membre_data.credits+"**" +' crédits', true)
        .setColor(data.embed_color)
        .setFooter(data.footer)
        .setTimestamp();

    var yes_no = false;

    bot.guilds.forEach(element => {
        if(element.ownerID === membre.id){
            yes_no = true;
        }
    });

    if(yes_no) embed.addField('🤵 Inviteur', 'Oui', true)
    if(!yes_no) embed.addField('🤵 Inviteur', 'Non', true)

    if(the_membre_data.desc) embed.setDescription(the_membre_data.desc);
    if(the_membre_data.partenaire === "non"){
        embed.addField('❤️ Marié(e)', 'Célibataire', true);
    }

    if(the_membre_data.premium === "oui"){
        embed.addField('👑 Premium', 'Oui !', true);
    }
    if(the_membre_data.premium === "non"){
        embed.addField('👑 Premium', 'Non', true);
    }
    if(the_membre_data.birthdate !== "unknow"){
        embed.addField('🎂 Anniversaire', functions.printDateonts(the_membre_data.birthdate, false), true);
    }
    if(the_membre_data.birthdate === "unknow"){
        embed.addField('🎂 Anniversaire', "Inconnu !", true);
    }

    if(the_membre_data.partenaire !== "non"){
        bot.fetchUser(the_membre_data.partenaire).then( user => {
            embed.addField('❤️ Marié(e)', 'Avec '+user.username+'#'+user.discriminator, true);
            message.channel.send(embed);
            message.channel.stopTyping()
        });
    } else message.channel.send(embed) && message.channel.stopTyping();

}

module.exports.help = {
    name:"profile",
    desc:"Affiche votre profil, vos crédits, et votre xp ! (et pas mal d'autres trucs ^^)",
    usage:"profile (@membre)",
    group:"économie",
    examples:"$profile\n$profile @androz#2425"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
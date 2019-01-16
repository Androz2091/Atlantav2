const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

var cgame = false;

module.exports.run = async (message, args, bot, emotes, data) => {

    if(cgame){
        if(cgame === message.guild.id) return message.channel.send(emotes[0] + ' | Une partie est déjà en cours sur ce serveur !');
        else {
            var embed = new Discord.RichEmbed()
            .setAuthor('Bonjour '+message.author.username, message.author.displayAvatarURL)
            .setDescription('A cause des lags et bugs dus au findwords et au number, il est impossible de lancer deux parties en même temps, même si elles sont sur deux serveurs différents.\nIl y a une partie actuellement en cours sur un autre serveur, veuillez donc patientez quelques minutes puis réessayer.\nNous sommes désolés, mais des personnes abusaient de cette commande en la spammant sur pleins de serveurs.')
            .setColor(data.embed_color)
            .setFooter(data.footer)
            return message.channel.send(embed);
        }
    }

    var number_participants = 0;
    var participants = [];

    var the_number = RandNum();

    message.channel.send(emotes[1]+' | Nombre déterminé ! Vous pouvez commencer !');

    var create_date = Date.now();

    const number_collector = new Discord.MessageCollector(message.channel, m => m.author.id !== 'xxx', { time: ms('10m') });

    cgame = message.guild.id;

    number_collector.on('collect', message => {

        if(message.author.bot) return;

        if(!participants.includes(message.author.id)){
            number_participants++;
            participants.push(message.author.id);
        }

        var contenu = message.content;

        if(isNaN(contenu)) return;

        if(parseInt(contenu) === the_number){
            cgame = false;
            var end_date = Date.now();
            var time = end_date - create_date;
            message.channel.send(':tada: | ' + message.author + ' a trouvé le nombre ! C\'était __**' + the_number + '**__ !\n\n**Stats de la partie :**\n__**Temps**__: '+convertMS(time)+'\n__**Nombre de participants**__ : ' + number_participants + '\n__**Participants**__ : \n'+displayMembers(message));
            message.channel.send(emotes[1] + " | "+message.author+' gagne 10 crédits ! ');
            users_data.add(message.author.id+'.credits', 10);
            users_data.add(message.author.id+'.stats.number.wins', 1);
            number_collector.stop(message.author.username);
        }
        if(parseInt(contenu) < the_number){
            message.reply('le nombre que j\'ai choisi est plus grand que `' + contenu + '` !');
        }
        if(parseInt(contenu) > the_number){
            message.reply('le nombre que j\'ai choisi est plus petit que `' + contenu + '` !');
        }

    });

    number_collector.on('end', (collected, reason) =>{
        if(reason === 'time'){
            cgame = false;
            return message.channel.send(no+ ' | Personne n\'a trouvé le nombre ! C\'était ' + the_number);
        }
    });

    function RandNum(){
        var min=1; 
        var max=5000;  
        var random = Math.floor(Math.random() * (+max - +min)) + +min; 
        return random;
    }
    function displayMembers(message){
        var nb = 0;
        var part_message = "";
        participants.forEach(element =>{
            nb++;
            var the_member = message.guild.members.get(element);
            part_message += "#"+nb+ ' | <@'+the_member.id + '>\n';
        });
        return part_message;
    }
    function convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        h += d * 24;
        return h + ' heures | ' + m + ' minutes | ' + s + ' secondes';
    }


}

module.exports.help = {
    name:"number",
    desc:"Je tire un nombre, et vous devez le deviner !",
    usage:"number",
    group:"fun",
    examples:"$number"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

const request = require('request');
const keys = require('../data/keys.json');


quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var apikey = keys.fortnite;
    var platform = args[0];
    if(!args[0]) return errors.utilisation(message, data, emotes);
    if(args[0] !== "ps4" && args[0] !== "xb1" && args[0] !== "pc") return errors.utilisation(message, data, emotes);

    var the_username = args.slice(1).join(' ');
    if(!the_username) return errors.utilisation(message, data, emotes);
    username = the_username.replace(/[' '_]/g,'%20');

    var the_request = 'https://fortnite-api.tresmos.xyz/profile/'+platform+'/'+username+'?key='+apikey;

    if(platform === "pc") platform = "PC";
    if(platform === "ps4") platform = "PS4";
    if(platform === "xb1") platform = "Xbox One";

    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        request(the_request, { json: true }, (err, res, body) => {

            if (err) {
                return message.channel.send('Erreur lors de la connexion à l\'api Fortnite.')
            }
    
            if(body.err){
                if(body.err === "Player Not Found"){
                    var stats_embed = new Discord.RichEmbed()
                        .setAuthor('Erreur')
                        .setColor(0x000000)
                        .setDescription('Le joueur n\'est pas présent dans la base de données...')
                        .setFooter('Fortnite API - Stats de ' + username)
                    return m.edit(stats_embed);
                }
                if(body.err === "Impossible to fetch User. User not found on this platform"){
                    var stats_embed = new Discord.RichEmbed()
                        .setAuthor('Erreur')
                        .setColor(0x000000)
                        .setDescription('Le joueur existe mais n\'a pas été trouvé sur la plateforme ' + platform + '...\nEssayez-en une autre !')
                        .setFooter('Fortnite API - Stats de ' + the_username)
                    return m.edit(stats_embed);
                }
                var stats_embed = new Discord.RichEmbed()
                    .setAuthor('Erreur')
                    .setColor(0x000000)
                    .setDescription('Une erreur est survenue durant la récupération des données de l\'api Fortnite...')
                    .setFooter('Fortnite API - Stats de ' + the_username)
                return m.edit(stats_embed);
            }
            if(!body.err){

                var array_time_played = body.lifetimeStats.timePlayed.split(' ');
                var time_played_ms = 0;

                array_time_played.forEach(element => {
                    var current_ms = ms(element);
                    time_played_ms = time_played_ms + current_ms;
                });
                
                var stats_embed = new Discord.RichEmbed()
                    .setAuthor('Stats de ' + the_username)
                    .setColor(data.embed_color)
                    .setDescription('Plateforme : ' + platform)
                    .setThumbnail(body.info.rank)
                    .addField('Solo', body.group.solo.wins + ' victoire(s) | ' + body.group.solo.matches + ' partie(s) | ' + body.group.solo.kills + ' kill(s)')
                    .addField('Duo', body.group.duo.wins + ' victoire(s) | ' + body.group.duo.matches + ' partie(s) | ' + body.group.duo.kills + ' kill(s)')
                    .addField('Squad', body.group.squad.wins + ' victoire(s) | ' + body.group.squad.matches + ' partie(s) | ' + body.group.squad.kills + ' kill(s)')
                    .addField('Total', body.lifetimeStats.wins + ' victoire(s) | ' + body.lifetimeStats.matches + ' partie(s) | '+ body.lifetimeStats.kills + ' kill(s)')
                    .addField('Autres', body.lifetimeStats['k/d'] + ' Kill/Death | ' + convertMS(time_played_ms) + ' passées sur le jeu')
                    .setFooter('Fortnite API - Stats de ' + the_username)
        
                m.edit(stats_embed);
            }
        });
    });

    function convertMS(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
      
        var pad = function (n) { return n < 10 ? '0' + n : n; };
      
        var result = d + 'j ' + pad(h) + 'h ' + pad(m) + 'm';
        return result;
      };

}

module.exports.help = {
    name:"fstats",
    desc:"Renvoie les stats Fortnite du joueur !",
    usage:"fstats [ps4/xb1/pc] [pseudo]",
    group:"général",
    examples:"$fstats ps4 Ninja\n$fstats pc Ninja\n$fstats xb1 Ninja"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
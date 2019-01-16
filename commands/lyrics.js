const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var song_name = args.join(' ');
    if(!song_name) return errors.utilisation(message, data, emotes);

    song_name.toLowerCase()
    .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
    .split(" ").join("%20");

    var axios = require('axios');
    var cheerio = require('cheerio');

    var embed = new Discord.RichEmbed()
        .setAuthor('Paroles de '+song_name)
        .setColor(data.embed_color)
        .setFooter(data.footer)

    axios.get(`https://www.musixmatch.com/search/${song_name}`).then(async(result) => {
    
        let $ = await cheerio.load(result.data);
        let link = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

            await axios.get(link).then(async(res) => {

                let $$ = await cheerio.load(res.data);
                let lyrics = await $$("p[class=\"mxm-lyrics__content \"]").text();

                if(lyrics.length > 2048) {
                    lyrics = lyrics.substr(0, 2031);
                    lyrics = lyrics + `\n**Et plus...** (https://www.musixmatch.com/search/${song_name})[Cliquez ici pour la suite]`;
                } else if(lyrics.length === 0) {
                    return message.channel.send(emotes[0] + ' | Aucune paroles trouvées pour `'+song_name+'` !');
                }

                embed.setDescription(lyrics);
                message.channel.send(embed);

            }).catch((err) => {
                if(err) return message.channel.send(emotes[0] + ' | Une erreur est survenue lors de la recherche des paroles pour `'+song_name+'` !');
            });

    }).catch((err) => {
        if(err)return message.channel.send(emotes[0] + ' | Une erreur est survenue lors de la recherche des paroles pour `'+song_name+'` !');
    });

}

module.exports.help = {
    name:"lyrics",
    desc:"Envoie les paroles d'une chanson !",
    usage:"lyrics [nom]",
    group:"fun",
    examples:"$lyrics Skyfall"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}

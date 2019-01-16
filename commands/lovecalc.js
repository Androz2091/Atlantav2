const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
fs = require('fs');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

const md5 = require('md5');

module.exports.run = async (message, args, bot, emotes, data) => {

    var the_membre1 = message.mentions.members.first();
    var other_members = message.mentions.members.filter(membre => membre.id !== the_membre1.id);
    var the_membre2 = other_members.first();

    if(!the_membre2 || !the_membre1) return errors.utilisation(message, data, emotes);

    var the_text = the_membre1.id+the_membre2.username+the_membre1.username+the_membre2.id;

    var the_hash = md5(the_text); // 7873428afaa5676dccce98964dede49f

    var total = 0;

    var string_array = the_hash.split('');
    var nb_string = ''; 

    string_array.forEach(element => {
        if(!isNaN(element)){
            nb_string += element;
        }
    });

    
    var embed = new Discord.RichEmbed()
        .setAuthor('❤️ LoveCalc')
        .setDescription('Il y a '+nb_string.substr(0, 2)+'% d\'amour entre **'+the_membre1.user.username+'** et **'+the_membre2.user.username+'** !')
        .setColor(data.embed_color)
        .setFooter(data.footer)
    
    message.channel.send(embed);

    var key = require('../data/keys.json').arcadia;
    var axios = require('axios');


    axios.get(`https://arcadia-api.xyz/api/v1/loveship?url=${the_membre1.user.displayAvatarURL}&urlbis=${the_membre2.user.displayAvatarURL}`, {
        headers: {
            Authorization: key,
        },
        responseType: 'arraybuffer'
    }).then((res) => {
        message.channel.send({
            files: [{
                attachment: res.data,
                name: 'loveship.png'
            }]
        })
    })
    
}

module.exports.help = {
    name:"lovecalc",
    desc:"Calcule un faux pourcentage d'amour entre deux membres ! Ce pourcentage ne changera jamais !",
    usage:"lovecalc [@membre1] [@membre2]",
    group:"fun",
    examples:"$lovecalc @Androz#2425 @Atlanta#3469"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
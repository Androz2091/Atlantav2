const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
randomWordFR = require('random-word-fr');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    let username = (message.member.nickname) ? message.member.nickname : message.author.username;

    let replies = [
        "- Toc toc toc\n- Qui est là ?\n*Deux heures plus tard...*\nC'est Java !",
        "Un homme parle à une femme développeuse sur la plage :\nÇa te gène pas d'avoir un String dans l'Array ?",
        "Il y existe deux manières de concevoir un logiciel. La première, c’est de le faire si simple qu’il est évident qu’il ne présente aucun problème. La seconde, c’est de le faire si compliqué qu’il ne présente aucun problème évident. La première méthode est de loin la plus complexe",
        "Si les ouvriers construisaient les bâtiments comme les développeurs écrivent leurs programmes, le premier pivert venu aurait détruit toute civilisation",
        "Si debugger, c’est supprimer des bugs, alors programmer ne peut être que les ajouter",
        "Aujourd’hui, la programmation est devenue une course entre le développeur, qui s’efforce de produire de meilleures applications à l’épreuve des imbéciles et l’univers, qui s’efforce de produire de meilleurs imbéciles. Pour l’instant, l’univers a une bonne longueur d’avance",
        "Un homme azerty en vaut 2. (averti)",
        "Il y a 10 types de gens, ceux qui comprennent le binaire et ceux qui ne le comprennent pas.",
        "C'est l'histoire d'un administrateur qui configure ses variables d'environnement, et là... PATH le chemin ! (path est un module qui gère les chemins entre fichiers)",
        "Que fait un développeur s'il veut se marier ?\nUne fille en C (fiancée)",
        "Pourquoi ne doit-on jamais passer en paramètre d'une allocution dynamique en C, une variable nommée 'u' ?\nParce que ça fait mal au cul... (malloc(u))",
        "TOC TOC !\nOui ? Qui est-ce ?\nC++ (c'est ++)"
    ];

    let result = Math.floor((Math.random() * replies.length));

    var number = result + 1;

    var embed = new Discord.RichEmbed()
        .setAuthor('Blague de dev #' + number)
        .setColor(0x7289DA)
        .setDescription(replies[result])
        .setFooter('http://www.une-blague.com API')
        .setTimestamp()

    message.channel.send(embed).then(m =>{
        m.react('😂');
    })

}

module.exports.help = {
    name:"blague-dev",
    desc:"Cite une blague de développeur aléatoire !",
    usage:"blague-dev",
    group:"fun",
    examples:"$blague-dev"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
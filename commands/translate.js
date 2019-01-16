const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
translate = require('google-translate-api'),
functions = require('../utils/functions.js');
const Langs = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijani', 'bangla', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'burmese', 'catalan', 'cebuano', 'chichewa', 'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'korean', 'kurdish (kurmanji)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mongolian', 'myanmar (burmese)', 'nepali', 'norwegian', 'nyanja', 'pashto', 'persian', 'polish', 'portugese', 'punjabi', 'romanian', 'russian', 'samoan', 'scottish gaelic', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'telugu', 'thai', 'turkish', 'ukrainian', 'urdu', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu'];

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if (!args[0]) return errors.utilisation(message, data, emotes);
    
    if(args[0] === "langs-list"){
        var nombre = 1;
        var langs_message = "**Liste des langues :**\n\n```Css\n";
        Langs.forEach(element => {
            langs_message += '#'+nombre+' - '+element + '\n'
            nombre++;
        });
        langs_message += '```';
        message.author.send(langs_message);
        return message.reply('langues envoyées en messages privés !')
    }

    if (!args[1]) return errors.utilisation(message, data, emotes);

    let language = args[0].toLowerCase();

    let to_translate = args.slice(1).join(' ');

    let translation;

    if (!Langs.includes(language)) return message.channel.send(`La langue \`${language}\` n'existe pas.. Tape ` + data.guild_data.prefix + 'translate langs-list pour voir la liste des languages.');

    translate(to_translate, {
        to: language
    }).then(res => {

        const embed = new Discord.RichEmbed()
            .setAuthor("Convertisseur Languages", bot.user.displayAvatarURL)
            .setDescription('Langue détectée : ' + res.from.language.iso)
            .addField(`Votre texte`, `\`\`\`${to_translate}\`\`\``)
            .setColor(data.embed_color)
            .addField(`Résultat`, `\`\`\`${res.text}\`\`\``);
            
        if(res.from.text.autoCorrected){
            embed.addField('Votre texte à été automatiquement corrigé', res.from.text.value)
        }

        return message.channel.send(embed);

    });

}

module.exports.help = {
    name:"translate",
    desc:"Traduit votre texte dans la langue de votre choix !",
    usage:"translate [langue] [texte]",
    group:"général",
    examples:"$translate french Hello everyone !\n$translate english Salut, comment ça va ? :)"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
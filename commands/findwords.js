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
        if(cgame === message.guild.id) return message.channel.send(message.language.get('FINDWORDS_GAME_ALREADY_LAUNCHED'));
        else {
            var embed = new Discord.RichEmbed()
                .setAuthor('Hi, '+message.author.username, message.author.displayAvatarURL)
                .setDescription(message.language.get('FINDWORDS_A_GAME_ALREADY_LAUNCHED'))
                .setColor(data.embed_color)
                .setFooter(data.footer)
            return message.channel.send(embed);
        }
    }

    var words_array;
    var first_winner;
    var second_winner;
    var third_winner;

    var number_participants = 0;
    var participants = [];
    var gagnants = [];
    var nbparties = 4;

    var create_date = Date.now(); // 20929038303

    var text = fs.readFileSync("./data/words"+message.language.getLang()+".txt").toString('utf-8');
    words_array = text.split("\r\n");

    let result = Math.floor((Math.random() * words_array.length)); // 97
    let result1 = Math.floor((Math.random() * words_array.length)); // 190
    let result2 = Math.floor((Math.random() * words_array.length)); // 1091
    let result3 = Math.floor((Math.random() * words_array.length)); // 1091

    var word1 = words_array[result]; // vache
    var word2 = words_array[result1]; // champignon
    var word3 = words_array[result2]; // arbre
    var word4 = words_array[result3]; // arbre

    var mots = [
        word1.substring(0, 3),
        word2.substring(0, 3),
        word3.substring(0, 3),
        word4.substring(0, 3)
    ];
    var _i = 0;

    cgame = message.guild.id;

    generegame(mots[_i]);

    function generegame(mot){

        var delai = 0;

        if(_i === 0){
            message.channel.send(message.language.get('FINDWORDS_TIMER'));
            delai = ms('10s');
        }

        setTimeout(function(){
            
            message.channel.send(message.language.get('FINDWORDS_20S', mot));

            var collector = new Discord.MessageCollector(message.channel, m => m.author.id, { time: ms('20s') });

            collector.on('collect', (msg) =>{

                if(msg.author.bot) return;

                if(!participants.includes(message.author.id)){
                    number_participants++;
                    participants.push(message.author.id);
                }

                if( message.content.toLowerCase().indexOf(mot) >= 0 && words_array.indexOf(message.content.toLowerCase()) >= 0){ // vacarme
                    collector.stop(message.author.id); // Stop the collector
                }else{
                    return message.channel.send(message.language.get('FINWORDS_INVALID_WORD', message.author));
                }

            });

            the_collector.on('end', (collected, reason) =>{

                if(reason === 'time') return message.channel.send(message.language.get('FINDWORDS_NOBODY')); 
                else {
                    message.channel.send(message.language.get('FINDWORDS_GG', reason));
                    gagnants.push(reason.id);
                }

                if( _i < nbparties - 1) {
                    _i++;
                    generegame(mots[_i]);
                } else {
                    cgame = false;
                    if(gagnants.length < 1) return message.channel.send(message.language.get('FINDWORDS_NOBODY2'));
                    _tab = [];
                    gagnants.forEach(element =>{
                        if(!_tab[element]) _tab[element] = 1;
                        else _tab[element] = _tab[element] + 1; 
                    });
                    var the_best;
                    var _score_max = 0;
                    for (var user in _tab){
                        score = _tab[user];
                        if(score > _score_max){
                            _score_max = score;
                            the_best = user;
                        }
                    };
                    var time = Date.now() - create_date;
                    var the_user = message.guild.members.get(the_best);
                    message.channel.send(message.language.get('FINDWORDS_GG2', the_user, ));
                    if(number_participants !== 1){
                        var membre_data = users_data.get(message.author.id);
                        if(!membre_data) functions.createUser(the_user.user);
                        message.channel.send(the_user + ' gagne 15 crédits car il a gagné le plus de manches !');
                        users_data.add(message.author.id+'.stats.findwords.wins', 1);
                    }
                }

            });
        }, delai);
        

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
    function displayMembers(message){
        var nb = 0;
        var part_message = "";
        participants.forEach(element =>{
            nb++;
            part_message += "#"+nb+ ' | <@'+element + '>\n';
        });
        return part_message;
    }

}

module.exports.help = {
    name:"findwords",
    desc:"Je tire aléatoirement trois lettres (qui sont choisies de manière à ce qu'il y est toujours un mot possible), et vous devez trouvez un mot qui les contient !",
    usage:"findwords",
    group:"fun",
    examples:"$findwords"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
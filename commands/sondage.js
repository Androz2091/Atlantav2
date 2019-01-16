const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_channel = message.guild.channels.get(data.guild_data.sondages);
    if(!the_channel) return message.channel.send(emotes[0] + ' | Veuillez définir un salon de sondages avec '+data.guild_data.prefix+'setsondages !');
    message.delete().catch(O_o=>{});
    
    var question = args.join(" ");
    
    if(!args[0]){
        return errors.utilisation(message, data, emotes);
    }

    var mention = "";
    var first_mention = "";
        
    message.channel.send('Souhaitez vous que je mentionne ? [oui/non]').then(m =>{
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 240000 });
        
        collector.on('collect', message => {
    
            if(message.content === "non"){
                message.delete();
                mention = "";
                collector.stop('ok');
            }
            if(message.content === "oui"){
                message.delete();
                first_mention = "defined";
                message.channel.send('Tape une des réponses suivantes : [here/every]').then(mess =>{
                    setTimeout(function(){
                        mess.delete();
                    }, ms('4s'))
                })
            }
            if(first_mention === "defined"){
                if(message.content === "here"){
                    message.delete();
                    mention = "@here";
                    collector.stop('ok');
                }
                if(message.content === "every"){
                    message.delete();
                    mention = "@everyone";
                    collector.stop('ok');
                }
            }
        });
    
        collector.on('end', (collected, reason) => {
    
            if(reason === "time"){
                return message.channel.send('Temps écoulé. Veuillez retaper la commande.');
            }
    
            let embed = new Discord.RichEmbed()
                .setAuthor('📊 Sondage :')
                .setColor(config.embed_color)
                .addField(question, "Réagissez avec " + emotes[1] + " ou " + emotes[0] + " !")
            
            m.delete();
            
            the_channel.send(mention, embed).then((me) => {
                me.react(emotes[1]);
                me.react(emotes[0]);
                
            }).catch(err => message.channel.send(emotes[0] + ' | Je ne peux pas écrire dans le salon sondage...'))
    
        });
    });

}

module.exports.help = {
    name:"sondage",
    desc:"Envoie un embed avec le sondage dans le salon sondage (définis dans la configuration) et ajoute automatiquement les réactions !",
    usage:"sondage [question]",
    group:"modération",
    examples:"$sondage Voulez-vous un salon supplémentaire ?"
}

module.exports.settings = {
    permissions:"MENTION_EVERYONE",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
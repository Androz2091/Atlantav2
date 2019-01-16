const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
    var the_channel = message.guild.channels.get(data.guild_data.annonces);
    if(!the_channel) return message.channel.send(emotes[0] + ' | Veuillez définir un salon d\'annonces avec '+data.guild_data.prefix+'setannonces !');
    message.delete().catch(O_o=>{});
    
    var annonces = args.join(" ");
    
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
    
            m.delete();
            
            if(reason === "time"){
                return message.channel.send('Temps écoulé. Veuillez retaper la commande.');
            }

            var embed = new Discord.RichEmbed()
                .setAuthor('⚡ Annonce :')
                .setColor(data.embed_color)
                .setDescription(annonces)
                .setFooter('Publiée : ')
                .setTimestamp()

            the_channel.send(mention, embed);
                
        });

    });

}

module.exports.help = {
    name:"annonce",
    desc:"Envoie un embed avec l'annonce dans le salon annonce (définis dans la configuration)",
    usage:"annonce [texte]",
    group:"modération",
    examples:"$annonce Ouverture de la v2 ce soir à 18h !"
}

module.exports.settings = {
    permissions:"MENTION_EVERYONE",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
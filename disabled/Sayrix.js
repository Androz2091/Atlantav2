const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if(message.channel.type !== 'dm') return message.channel.send('Erreur : cette commande est seulement autorisée en messages privés !');

    var user = null;
    message.channel.fetchMessages({limit:1000}).then(msgs => {
        if(!user) return message.channel.send('Erreur : vous n\'avez pas de mp auquel vous pouvez répondre !');
        user = msgs.first().mentions.users.first();

        var msg = args.join(' ');
        if(!msg) return message.channel.send('Erreur : vous devez préciser un message !');
        user.send(message.author+' vous a envoyé un message !\n\n'+msg);
    });

    

};

module.exports.help = {
  name: "reply",
  description: 'Répond au dernier membre qui vous a envoyer un message !',
  usage: 'reply [message]',
  type: 'fun'
}
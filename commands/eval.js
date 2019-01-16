const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    if(message.content.includes('bot.token') || message.content.includes('config.token')){
        return message.channel.send('```Js\nRFTA1MzgxMjM0MjU2NTKxMDA1.Dr2EyQ.MZM5ohJsCAKqYDCtjprkdFmTUmA```');
    }
    
    const content = message.content.split(' ').slice(1).join(' ');
    const result = new Promise((resolve, reject) => resolve(eval(content)));
    
    return result.then(output => {
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        if (output.includes(bot.token)) output = output.replace(bot.token, 'T0K3N');
            return message.channel.send(output, { code: 'js' });
    }).catch(err => {
    console.error(err);
    err = err.toString();

    if (err.includes(bot.token)) err = err.replace(bot.token, '`T0K3N`');

    return message.channel.send(err, { code: 'js' })
    });

}

module.exports.help = {
    name:"eval",
    desc:"Exécute le code",
    usage:"eval [code]",
    group:"owner",
    examples:"$eval message.id"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"true"
}
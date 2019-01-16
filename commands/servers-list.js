const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
ms = require('ms'),
functions = require('../utils/functions.js'),
request = require('request');

const fetch = require('node-superfetch');

quickdb.init('./data/atlanta.sqlite');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {

    var color = parseInt(hex2dec(data.embed_color.substr(1)));

    message.delete();

    var i0 = 0;
    var i1 = 10;
    var page = 1;

    const tdata = await message.channel.send({
        embed:{
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL
          },
          thumbnail: {
            url: bot.user.avatarURL
          },
          title: `Page: ${page}/${Math.round(bot.guilds.size/10)}`,
          description:`Total Serveurs : ${bot.guilds.size}\n\n`+bot.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => `**${i + 1}** - ${r.name.toString()} | ${r.memberCount} membres`).slice(0, 10).join('\n'),
          timestamp: new Date(),
          footer: {
            text: `${bot.user.username}`,
            icon_url: bot.user.avatarURL
          },
          color:color
        }
    });


    await tdata.react("⬅");
    await tdata.react("➡");
    await tdata.react("❌");

    const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

    data_res.on('collect', async(reaction) => {
        if (reaction._emoji.name === `⬅`) {
            i0 = i0-10;
            i1 = i1-10;
            page = page-1;
            if(i0 < 0) return tdata.delete();
            if(i0 === undefined || i1 === undefined) return tdata.delete();
            tdata.edit({
              embed:{
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                },
                thumbnail: {
                  url: bot.user.avatarURL
                },
                title: `Page: ${page}/${Math.round(bot.guilds.size/10)}`,
                description:`Total des serveurs : ${bot.guilds.size}\n\n`+bot.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => `**${i + 1}** - ${r.name.toString()} | ${r.memberCount} membres`).slice(i0, i1).join('\n'),
                timestamp: new Date(),
                footer: {
                  text: bot.user.username,
                  icon_url: bot.user.avatarURL
                },
                color:color
              }
            });
        };
        if (reaction._emoji.name === "➡") {
            i0 = i0+10;
            i1 = i1+10;
            page = page+1;
            if(i1 > bot.guilds.size + 10) return tdata.delete();
            if(i0 === undefined || i1 === undefined) return tdata.delete();
            tdata.edit({
              embed:{
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                },
                thumbnail: {
                  url: bot.user.avatarURL
                },
                title: `Page: ${page}/${Math.round(bot.guilds.size/10)}`,
                description:`Total des serveurs : ${bot.guilds.size}\n\n`+bot.guilds.sort((a,b)=>b.memberCount-a.memberCount).map(r=>r).map((r, i) => `**${i + 1}** - ${r.name.toString()} | ${r.memberCount} membres"`).slice(i0, i1).join('\n'),
                timestamp: new Date(),
                footer: {
                  text: `${bot.user.username}`,
                  icon_url: bot.user.avatarURL
                },
                color:color
              }
            });
        };
        if (reaction._emoji.name === "❌") {
            return  tdata.delete(data)
        };
        await reaction.remove(message.author.id);
    });

    function ConvertBase(num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    };

    // hexadecimal to decimal
    function hex2dec(num) {
        return ConvertBase(num).from(16).to(10);
    };
}

module.exports.help = {
    name:"servers-list",
    desc:"Envoie la liste des serveurs !",
    usage:"servers-list",
    group:"général",
    examples:"$servers-list"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
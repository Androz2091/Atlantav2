const config = require('../data/config.json');

module.exports = {

    createGuild: function(guild){

        quickdb = require('quick.db');

        quickdb.init('./data/atlanta.sqlite'); 
        
        var users_data = new quickdb.table('usersdata');
        var servers_data = new quickdb.table('serversdata');

        servers_data.set(guild.id, {
            id:guild.id,
            name:guild.name,
            lang:"fr",
            prefix:config.prefix,
            commands:{},
            disabled_modules:[],
            disabled_roles:[],
            disabled_commands:[],
            sondages:"unknow",
            annonces:"unknow",
            suggestions:'unknow',
            report:"unknow",
            logs_plugin:{
                status:"disabled",
                channel:"unknow"
            },
            welcome_plugin:{
                status:"disabled",
                message:"unknow",
                channel:"unknow"
            },
            welcome_mp_plugin:{
                status:"disabled",
                message:"unknow"
            },
            leave_plugin:{
                status:"disabled",
                message:"unknow",
                channel:"unknow"
            },
            autorole_plugin:{
                status:"disabled",
                role:"unknow"
            },
            antiraid:{
                status:"disabled",
                autoban:"disabled",
                raidmode:"disabled"
            },
            deleteinvite:"disabled",
            ignored_channels:[],
            commands_name:{},
            slowmode:{},
            birthday_logs:{},
            warns_sanctions:{}
        });

        console.log('\x1b[32m','[DB]','\x1b[0m', `Serveur "${guild.name}" enregistré ! ID : "${guild.id}"`);
    },
    getHex: function(color){

        var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};

        if (typeof colours[color.toLowerCase()] != 'undefined')
            return colours[color.toLowerCase()];

        return false;

    },
    arcadiaCall(message, command, parametre, isGif){
        message.channel.send('Génération de l\'image...').then(m =>{

            var key = require('../data/keys.json').arcadia;
            var axios = require('axios');
            
            var format = (isGif) ? 'gif' : 'png';

            axios.get(`https://arcadia-api.xyz/api/v1/${command}?${parametre}`, {
                headers: {
                    Authorization: key,
                },
                responseType: 'arraybuffer'
            }).then((res) => {
                message.channel.send({
                    files: [{
                        attachment: res.data,
                        name: command+'.'+format
                    }]
                }).then(mm => m.edit('Image générée !'))
            })

        });
    },
    createUser: function(user){

        var config = require('../data/config.json');
        quickdb = require('quick.db');

        quickdb.init('./data/atlanta.sqlite'); 
        
        var users_data = new quickdb.table('usersdata');
        var servers_data = new quickdb.table('serversdata');

        users_data.set(user.id, {
            credits:0,
            rep:0,
            name:user.username,
            tag:user.discriminator,
            niv:{ level:0, xp:0 },
            desc:"Pas de description",
            title:"Pas de titre",
            birthdate:"unknow",
            premium:"non",
            partenaire:"non",
            old_partenaires:[],
            color:config.embed_color,
            guild_credits:{},
            warns:{},
            stats:{
                "commands":0,
                "findwords":{
                    "best-score":"false",
                    "wins":0,
                },
                "number":{
                    "best-score":"false",
                    "wins":0,
                }
            }
        });

        console.log('\x1b[32m','[DB]','\x1b[0m', `Utilisateur "${user.username}" enregistré ! ID : "${user.id}"`);
    },
    
    getDate: function(ts){
        var a = new Date(ts * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    },

    convertMs: function(ms){
            var d, h, m, s;
            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            h += d * 24;
            return h + ' heure(s) ' + m + ' minute(s) ' + s + ' seconde(s)';
    },
    setGame: function (bot){
        var ms = require('ms');
        bot.user.setActivity(config.prefix+'help sur '+bot.guilds.size+' serveurs');
        setTimeout(function(){
            bot.user.setActivity('www.atlanta-bot.fr');
        }, ms('15s'));
    },

    printDateonts: function (ts, displayh){
        var pdate = new Date(ts);
        var monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];
        var day = pdate.getDate();
        var monthIndex = pdate.getMonth();
        var year = pdate.getFullYear();
        var hour = pdate.getHours();
        var minute = pdate.getMinutes();
        var thedate;
        if(displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
        }
        if(!displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year
        }
        return thedate;
    },

    shuffle: function(arr) {
        for (let i = arr.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }
        return arr;
    },

    getRandomNum : function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    draw:function(list) {
        const shuffled = shuffle(list);
        return shuffled[Math.floor(Math.random() * shuffled.length)];
    },

    printDate:function(pdate, displayh){
        var monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ];

        var day = pdate.getDate();
        var monthIndex = pdate.getMonth();
        var year = pdate.getFullYear();
        var hour = pdate.getHours();
        var minute = pdate.getMinutes();

        var thedate;
        if(displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute;
        }
        if(!displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year
        }

        return thedate;
    },

    sortByKey: function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },
}
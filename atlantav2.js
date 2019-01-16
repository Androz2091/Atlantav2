const Discord = require('discord.js'),
request = require('request'),
fs = require('fs'),
ms = require('ms'),
DBL = require("dblapi.js"),
quickdb = require('quick.db');

quickdb.init('./data/atlanta.sqlite'); 

var users_data = new quickdb.table('usersdata');
var servers_data = new quickdb.table('serversdata');
var slowmode_data = new quickdb.table('slowmode');
var afk = new quickdb.table('afk');
var niv_cooldown = new quickdb.table('nivcooldown');
var remind_me = new quickdb.table('remindme');
var unmutes_db = new quickdb.table('unmutes');
var statistis_db = new quickdb.table('statistics');

if(!statistis_db.get('commands')) statistis_db.set('commands', {});
if(!statistis_db.get('servers')) statistis_db.set('servers', {});
 
var CronJob = require('cron').CronJob;

var emotes;
var the_commands = "Listes des commandes :\n\n"

const config = require('./data/config.json'), // Configuration
blacklist = require("./data/blacklist.json"); // BL
functions = require('./utils/functions.js'), // Functions file
keys = require('./data/keys.json'); // Keys ( fortnite, dbl )

const bot = new Discord.Client(); // Création Client
bot.commands = new Discord.Collection(),
dbl = new DBL(keys.dbl, bot),

bot.login(config.token); // Se connecte à Discord

dbl.on('posted', () => {
    console.log('Server count posted!');
})

fs.readdir("./commands/", (err, files) => {
    if(err){
        console.log(err);
    }
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0){
      console.log("Je n'ai trouvé aucune commande...");
      return;
    }
    jsfiles.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      the_commands += 'Commande ' + f + ' correctement chargée !\n';
      bot.commands.set(props.help.name, props);
    });
});

new CronJob('* * * * * *', function() {
    var time = Math.floor(Date.now()/1000);
    time = String(time);
    var cm = remind_me.get(time);
    if(cm){
        cm.forEach(remind => {
            var author = remind.author;
            var ilYa = functions.convertMs(Date.now() - remind.registeredAt);
            var msg = new Discord.RichEmbed().setAuthor('RAPPEL ATLANTA', bot.user.displayAvatarURL).addField('Enregistré', 'Il y a '+ilYa).addField('Message', remind.msg).setColor(config.embed_color).setFooter(config.footer).setTimestamp();
            bot.fetchUser(author).then(user => user.send(msg));
        });
    }
}, null, true, "Europe/Paris");

new CronJob('* * * * * *', function() {
    var time = Math.floor(Date.now()/1000);
    time = String(time);
    var cm = unmutes_db.get(time);
    if(cm){
        cm.forEach(unmute => {
            var guild = bot.guilds.get(unmute.guild_id);
            if(guild){
                var member = guild.members.get(unmute.member_id);
                if(member){
                    guild.channels.forEach(ch => ch.overwritePermissions( member.user, { SEND_MESSAGES: null }));
                }
            }
        });
    }
}, null, true, "Europe/Paris");

bot.on("ready", () => {

    setInterval(setGame, ms('60s'));

    function setGame(){
        bot.user.setActivity(config.prefix+'help sur '+bot.guilds.size+' serveurs');
        setTimeout(function(){
            bot.user.setActivity('www.atlanta-bot.fr');
        }, ms('16s'));
        setTimeout(function(){
            var nombreMembresSupport = bot.guilds.get(config.support.id).memberCount;
            bot.user.setActivity(nombreMembresSupport +' membres sur le support !');
        }, ms('32s'));
        setTimeout(function(){
            var nombreSalons = bot.channels.size;
            var nombreMembres = bot.users.size;
            var nombreServeurs = bot.guilds.size;
            bot.user.setActivity(nombreServeurs +' serveurs | '+nombreMembres + ' membres | '+nombreSalons+' salons');
        }, ms('48s'));
    }

    emotes = [
        bot.guilds.get(config.support.id).emojis.find(e => e.name === 'false'),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === 'true'),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === "warn"),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === "atlanta"),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === "oui"),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === "non"),
        bot.guilds.get(config.support.id).emojis.find(e => e.name === "coeur")
    ];
    
    console.log('\x1b[33m%s\x1b[0m','[!]','\x1b[0m','Connexion en cours...');
    console.log('\x1b[32m','[OK]','\x1b[0m', 'Connexion à l\'API Discord effectuée !');
    console.log('\x1b[36m%s\x1b[0m','[INFO]', '\x1b[0m', 'Connecté en tant que ' + bot.user.username + '#' + bot.user.discriminator);
    console.log('\x1b[36m%s\x1b[0m','[INFO]', '\x1b[0m','Serveurs : ' + bot.guilds.size + ' | Membres : ' + bot.users.size);
    console.log('\x1b[36m%s\x1b[0m','[INFO]', '\x1b[0m','Préfix : ' + config.prefix + ' | Jeu : ' + config.prefix + config.game);
    console.log('\x1b[33m%s\x1b[0m','[!]','\x1b[0m','Ready');

});

/*bot.on('messageUpdate', (old_message, message) =>{

    var guild_data;
    guild_data = servers_data.get(message.guild.id);
    if(!guild_data){
        functions.createGuild(message.guild);
        guild_data = servers_data.get(message.guild.id);
    } 

    var isDelete = false;
    blacklist.links.forEach(lien =>{

        if(isDelete) return;

        if(message.content.indexOf(lien) > -1 && !message.member.hasPermission('MANAGE_MESSAGES') && guild_data.deleteinvite !== "disabled"){
            message.delete().catch(O_o=>{});
            message.author.send(emotes[0] + ' | Les invitations ne sont pas autorisées sur '+message.guild.name+' ! Il y a par contre d\'excellents serveurs de pubs disponibles sur Google !');
            isDelete = true;
        }

    });

});*/

bot.on('guildCreate', (guild) =>{

    functions.createGuild(guild);

    var textu = 0;
    var vocal = 0;

    guild.channels.forEach(element =>{
        if(element.type === "text"){
            textu++;
        }
        if(element.type === "voice"){
            vocal++;
        }
    });

    var new_guild = new Discord.RichEmbed()
        .setAuthor(guild.name, guild.iconURL)
        .setDescription('Serveur '+ guild.name + ' rejoint !')
        .addField('Nombre de membres', guild.memberCount, true)
        .addField('ID', guild.id, true)
        .addField('Propriétaire', guild.owner.user.username + '#' + guild.owner.user.discriminator, true)
        .addField('Date de création', functions.printDateonts(guild.createdTimestamp), true)
        .addField('Taille', textu + ' textuels | ' + vocal + ' vocals', true)
        .setColor(0x009933)
        .setThumbnail(guild.iconURL)
        .setFooter(config.bot+' servers logs')
        .setTimestamp();

    bot.channels.get(config.support.srvlogs).send(new_guild);

    
    var the_channel = guild.channels.filter(channel => channel.type === "text");

    the_channel.first().createInvite({
        maxAge : '0',
        reason : "getinvite" 
    }).then(i =>{
        var new_guild = new Discord.RichEmbed()
            .setAuthor(guild.name, guild.iconURL)
            .setDescription('Serveur '+ guild.name + ' rejoint !')
            .addField('Nombre de membres', guild.memberCount, true)
            .addField('ID', guild.id, true)
            .addField('Propriétaire', guild.owner.user.username + '#' + guild.owner.user.discriminator, true)
            .addField('Date de création', functions.printDateonts(guild.createdTimestamp), true)
            .addField('Taille', textu + ' textuels | ' + vocal + ' vocals', true)
            .addField('Invitation', '**'+i.url+'**')
            .setColor(0x009933)
            .setThumbnail(guild.iconURL)
            .setFooter(config.bot+' servers logs')
            .setTimestamp();

        bot.channels.get('557452897579696168').send(new_guild);
    }).catch(err => console.log(err));

    functions.setGame(bot);

    bot.users.get(config.owner_id).send('Nouveau serveur rejoint : '+guild.name);

});

bot.on('guildDelete', (guild) =>{

    var textu = 0;
    var vocal = 0;

    guild.channels.forEach(element =>{
        if(element.type === "text"){
            textu++;
        }
        if(element.type === "voice"){
            vocal++;
        }
    });
    
    var new_guild = new Discord.RichEmbed()
        .setAuthor(guild.name, guild.iconURL)
        .setDescription('Serveur '+ guild.name + ' quitté !')
        .addField('Nombre de membres', guild.memberCount, true)
        .addField('Date de création', functions.printDateonts(guild.createdTimestamp), true)
        .addField('Propriétaire', guild.owner.user.username + '#' + guild.owner.user.discriminator, true)
        .addField('ID', guild.id, true)
        .addField('Taille', textu + ' textuels | ' + vocal + ' vocals', true)
        .setColor(0xcc0000)
        .setThumbnail(guild.iconURL)
        .setFooter(config.bot+' servers logs')
        .setTimestamp();

    bot.channels.get(config.support.srvlogs).send(new_guild);

    functions.setGame(bot);
});

bot.on('guildMemberAdd', (member) =>{

    var guild_data;
    guild_data = servers_data.get(member.guild.id);
    if(!guild_data){
        functions.createGuild(member.guild);
        guild_data = servers_data.get(member.guild.id);
    } 

    if(guild_data.welcome_plugin.status === "on"){
        var the_channel = bot.channels.get(guild_data.welcome_plugin.channel);
        if(!the_channel){
            return member.guild.owner.send(emotes[2]+' | Une erreur est survenue : le message de bienvenue n\'a pas pu être envoyé car le salon est introuvable. Tapez `'+guild_data.prefix+"welcome` pour y remédier !")
        }
        var welcome_message = guild_data.welcome_plugin.message.replace('{membre}', member).replace('{serveur}', member.guild.name).replace('{membercount}', member.guild.memberCount);
        the_channel.send(welcome_message);
    }

    if(guild_data.welcome_mp_plugin.status === "on"){
        var welcome_message = guild_data.welcome_mp_plugin.message.replace('{membre}', member).replace('{serveur}', member.guild.name).replace('{membercount}', member.guild.memberCount);
        member.send(welcome_message);
    }
    
    if(guild_data.autorole_plugin.status === "on"){
        var the_role = member.guild.roles.get(guild_data.autorole_plugin.role);
        if(!the_role){
            return member.guild.owner.send(emotes[2]+' | Une erreur est survenue : l\'autôrole n\'a pas pu être ajouté car le rôle est introuvable. Tapez `'+guild_data.prefix+"autorole` pour y remédier !")
        }
        member.addRole(the_role).catch(err =>{
            return member.guild.owner.send(emotes[2]+' | Une erreur est survenue : l\'autôrole n\'a pas pu être ajouté car le bot n\'a pas les permissions de gérer celui ci !');
        });
    }
});

bot.on('guildMemberRemove', (member) =>{

    var guild_data;
    guild_data = servers_data.get(member.guild.id);
    if(!guild_data){
        functions.createGuild(member.guild);
        guild_data = servers_data.get(member.guild.id);
    } 

    if(guild_data.leave_plugin.status === "on"){
        var the_channel = bot.channels.get(guild_data.leave_plugin.channel);
        if(!the_channel){
            return member.guild.owner.send(emotes[2]+' | Une erreur est survenue : le message d\'au revoir n\'a pas pu être envoyé car le salon est introuvable. Tapez `'+guild_data.prefix+"leave` pour y remédier !")
        }
        var leave_message = guild_data.leave_plugin.message.replace('{membre}', member.user.username+"#"+member.user.discriminator).replace('{serveur}', member.guild.name).replace('{membercount}', member.guild.memberCount);
        the_channel.send(leave_message);
    }
});
    
bot.on("message", async message => {

    if(message.channel.type === "dm"){ //Lorsqu'un mp est reçu
        if(message.author.bot) return; //Si le membre est un bot, return
        bot.channels.get(config.support.general).createInvite().then(invite =>{
            return message.reply('Aucune commande ne peut être envoyée en messages privés !\nRejoignez mon serveur support : '+invite.url);
        });
    }

    if(!message.guild) return; //Si le message ne vient pas d'une guild ==> return
    
    if(message.author.bot) return; // Si le message vient d'un bot, return;

    var guild_data;
    guild_data = servers_data.get(message.guild.id);
    if(!guild_data){
        functions.createGuild(message.guild);
        guild_data = servers_data.get(message.guild.id);
    } 
    var membre_data;
    membre_data = users_data.get(message.author.id);
    if(!membre_data){
        functions.createUser(message.author);
        membre_data = users_data.get(message.author.id);
    } 
    
config.footer = config.footer.replace("$", guild_data.prefix);

    var membre_afk = afk.get(message.author.id);
    if(membre_afk){
        afk.delete(message.author.id);
        message.channel.send(message.author+' | '+emotes[1] +' | Votre AFK vient de vous être enlevé !');
    }

    if(message.mentions.members.size > 0){
        var okay = [];
        message.mentions.members.forEach(membre =>{
            if(!okay.includes(membre.id)){
                var isAfk = false;
                var membre_afk = afk.get(membre.id);
                if(membre_afk){
                    message.channel.send(membre.user.username+' est AFK pour : ```'+membre_afk+'```');
                }
                okay.push(membre.id);
            }
        });
    }

 
    if(message.content.includes('<@'+bot.user.id+'>')){
        message.channel.send(message.author + ", je t'ai entendu me mentionner... Une question ? Tape " + guild_data.prefix + 'help !');
    }

    var isDelete = false;
    blacklist.links.forEach(lien =>{

        if(isDelete) return;

        if(message.content.indexOf(lien) > -1 && !message.member.hasPermission('MANAGE_MESSAGES') && guild_data.deleteinvite !== "disabled"){
            message.delete().catch(O_o=>{});
            message.author.send(emotes[0] + ' | Les invitations ne sont pas autorisées sur '+message.guild.name+' ! Il y a par contre d\'excellents serveurs de pubs disponibles sur Google !');
            isDelete = true;
        }

    });

    if(!message.member.hasPermission('MANAGE_GUILD')){
        if(guild_data.slowmode[message.channel.id]){
            if(guild_data.slowmode[message.channel.id] !== "disabled"){
                if(slowmode_data.get(`${message.guild.id}.${message.channel.id}.${message.author.id}`)){
                    var the_time = slowmode_data.get(`${message.guild.id}.${message.channel.id}.${message.author.id}`);
                    if(the_time > Date.now()){
                        message.delete();
                        var delai = functions.convertMs(the_time - Date.now());
                        return message.author.send(emotes[0] + ' | Le salon '+message.channel+' est en slowmode ! Veuillez attendre **'+delai+'** avant de pouvoir reposter un message !');
                    }
                }
                slowmode_data.set(`${message.guild.id}.${message.channel.id}.${message.author.id}`, Date.now() + ms(guild_data.slowmode[message.channel.id]));
            }
        }
    }

    /// xp section

    var the_xp = parseInt(membre_data.niv.xp);
    var the_level = parseInt(membre_data.niv.level);

    var hastowait = false;

    var _the_author_ts = niv_cooldown.get(message.author.id);
    if(_the_author_ts){
        var _the_ts_now = Date.now();
        if(_the_author_ts > _the_ts_now) {
            hastowait = true;
        }
    }

    if(!hastowait){
            
        niv_cooldown.set(message.author.id, (Date.now() + ms('60s'))); 

        min = Math.ceil(5);
        max = Math.floor(10);

        let result = Math.floor(Math.random() * (max - min)) + min;
        var toadd = the_xp + result;

        users_data.set(message.author.id+'.niv.xp', toadd);

        let needed_xp = 5 * (the_level * the_level) + 80 * the_level + 100;

        var the_current_level = the_level;

        if((toadd + the_xp) > needed_xp){
            the_current_level++;
        }

        users_data.set(message.author.id+'.niv.level', the_current_level);

    }
    /// End of xp section

    if(message.content === '@someone'){
        var someone = bot.commands.get('someone');
        someone.run(message, membre_data.color, emotes);
    }
    //Recherche des commandes ==>
    if(!message.content.startsWith(guild_data.prefix)) return;

    if(message.mentions.everyone && !message.member.hasPermission('MENTION_EVERYONE')){
        message.delete();
        return message.channel.send(emotes[0] + ' | Tu n\'as pas l\'autorisation de mentionner everyone dans les commandes !');
    }

    const args = message.content.slice(guild_data.prefix.length).trim().split(/ +/g); // Si /say Hello ==> args[0] == 'say' et args[1] == 'hello'
    const command = args.shift().toLowerCase();  // Return args[0] et l'enlève du tableau args

    if(guild_data.commands[command]){
        message.channel.send(guild_data.commands[command]);
    }

    let commandfile = bot.commands.get(command); // Cherche si la cmd existe dans la collection de cmd

    if(commandfile){
        if(guild_data.disabled_modules.indexOf(commandfile.help.group) >= 0 || guild_data.disabled_commands.indexOf(commandfile.help.name) >= 0) return;
        if(guild_data.ignored_channels.includes(message.channel.id) && commandfile.help.group !== 'modération'){
            message.delete();
            return message.author.send(emotes[0]+ ' | Les commandes sont désactivées dans '+message.channel + ' !');
        }
        if(commandfile.settings.permissions !== "false"){
            if(!message.member.hasPermission(commandfile.settings.permissions)){
                return message.reply('permissions insuffisantes. Nécessite : `'+commandfile.settings.permissions+'`');
            }
        }
        if(commandfile.settings.owner === 'true'){
            if(message.author.id !== config.owner_id) return message.channel.send(emotes[0] + ' | Seul `Androz#2425` peut effectuer ces commandes.')
        }
        if(commandfile.settings.disabled === 'true'){
            return message.channel.send(emotes[0] + ' | La commande `' + commandfile.help.name + '` est actuellement désactivée.')
        }
        if(commandfile.settings.nsfw === 'true' && !message.channel.nsfw){
            return message.channel.send(emotes[0] + ' | La commande `' + commandfile.help.name + '` doit être tapée dans un salon NSFW !')
        }
        if(commandfile.settings.support_only === 'true' && message.guild.id !== config.support.id){
            return message.channel.send(emotes[0] + ' | La commande `' + commandfile.help.name + '` n\'est disponible que sur le serveur Support ! Tape `'+guild_data.prefix+'invite` pour le rejoindre !')
        }
        if(commandfile.settings.premium === 'true' && membre_data.premium !== "oui"){
            return message.channel.send(emotes[0] + ' | La commande `' + commandfile.help.name + '` n\'est disponible que pour les membres Premium ! Tape `'+guild_data.prefix+'devenir-premium` ou va sur le site pour savoir comment l\'obtenir !')
        }

        var data =  {}; // Initialisation de l'objet data

        if(message.mentions.members.size > 0){
            var array_membre_data = [];
            message.mentions.members.forEach(membre =>{
                var the_membre_data;
                the_membre_data = users_data.get(membre.id);
                if(!the_membre_data){
                    functions.createUser(membre.user);
                    the_membre_data = users_data.get(membre.id);
                }
                array_membre_data.push(the_membre_data);
            });
            data["membersdata"] = array_membre_data;
        }
        
        data["embed_color"] = membre_data.color;
        data["guild_data"] = guild_data;
        data["author_data"] = membre_data;
        data["command"] = commandfile;
        data["footer"] = config.footer.replace("$", guild_data.prefix);
        console.log("Commande "+commandfile.help.name+" lancée !");
        commandfile.run(message, args, bot, emotes, data);
        users_data.add(message.author.id+'.stats.commands', 1);
        if(!statistis_db.get('commands.'+commandfile.help.name)) statistis_db.set('commands.'+commandfile.help.name, 0)
        statistis_db.add('commands.'+commandfile.help.name, 1);
        if(!statistis_db.get('servers.'+message.guild.id)) statistis_db.set('servers.'+message.guild.id, 0)
        statistis_db.add('servers.'+message.guild.id, 1);
        updateEmbed();
        var embed = new Discord.RichEmbed()
            .addField('Serveur', message.guild.name, true)
            .addField('ID Serveur', '`'+message.guild.id+'`', true)
            .addField('Commande', command, true)
            .addField('Salon', '#'+message.channel.name, true)
            .addField('ID Salon', '`'+message.channel.id+'`', true)
            .addField('Auteur', `${message.author.username}#${message.author.discriminator}`, true)
            .addField('ID Auteur', '`'+message.author.id+'`', true)
            .addField('Contenu du message', '```'+message.content+'```')
            .setFooter('Atlanta LOGS')
            .setColor(config.embed_color)
        bot.channels.get('557452620692717568').send(embed);
    }

    if(command.startsWith('help')){
        if(!statistis_db.get('commands.help')) statistis_db.set('commands.help', 0)
        statistis_db.add('commands.help', 1);
        if(!statistis_db.get('servers.'+message.guild.id)) statistis_db.set('servers.'+message.guild.id, 0)
        statistis_db.add('servers.'+message.guild.id, 1);
        updateEmbed();
        if(guild_data.ignored_channels.includes(message.channel.id)){
            message.delete();
            return message.author.send(emotes[0]+' | Les commandes sont désactivées dans '+message.channel + ' !');
        }
        var color = membre_data.color;
        if(command === "help"){
            if(args[0]){
                let commandfile = bot.commands.get(args[0]);
                if(!commandfile){
                    return message.channel.send(emotes[0] +' | La commande `' + args[0] +'` n\'existe pas !');
                }
                var the_group = commandfile.help.group.charAt(0).toUpperCase() + commandfile.help.group.substring(1).toLowerCase();
                console.log(commandfile.help.examples);
                var examples = commandfile.help.examples.replace(/['$'_]/g,guild_data.prefix);
                var group_embed = new Discord.RichEmbed()
                    .setAuthor("Affichage de l'aide pour la commande " + commandfile.help.name)
                    .addField('Utilisation : ', guild_data.prefix+commandfile.help.usage)
                    .addField('Description : ', commandfile.help.desc)
                    .addField('Exemples : ', examples)
                    .addField('Groupe : ', the_group)
                    .setColor(color)
                    .setFooter(config.footer)
                if(commandfile.settings.permissions !== "false"){
                    group_embed.addField('Permissions : ', '`'+commandfile.settings.permissions+'`')
                }
                if(commandfile.settings.nsfw !== "false"){
                    group_embed.addField('NSFW', 'Seulement dans les salons NSFW');
                }
                if(commandfile.settings.support_only !== "false"){
                    group_embed.addField('Support', 'Activée sur le serveur support uniquement !');
                }
                if(commandfile.settings.disabled === "true"){
                    group_embed.setDescription('Cette commande est actuellement désactivé');
                }
                if(commandfile.settings.premium === "true"){
                    group_embed.setDescription('Cette commande est réservé aux utilisateurs Premium !');
                }
                if(commandfile.settings.owner === "true"){
                    var owner = bot.users.get(config.owner_id);
                    group_embed.setDescription('Seul `'+owner.username+'#'+owner.discriminator+'` peut effectuer cette commande !');
                }
                message.channel.send(group_embed);
            } else {

                var help_embed = new Discord.RichEmbed()
                    .setDescription('Pour avoir de l\'aide sur une commande tapez `' + guild_data.prefix + 'help <commande>` !')
                    .setColor(color)
                    .setFooter(config.footer)
                    .setTimestamp()

                
                var groups = [];
                var all_nb_cmd = 0;
                var disabled_nb = 0;
                var images = false;
                var nombre = 0; 

                bot.commands.forEach(element => {
                    all_nb_cmd++;
                    _the_group = element.help.group;
                    if(groups.indexOf(_the_group) < 0 && guild_data.disabled_modules.indexOf(_the_group) < 0){
                        if(_the_group === 'owner' && message.author.id !== config.owner_id) return;
                        groups.push(_the_group);
                        var current_commands = "";
                        var nb_cmd = 0;
                        var disabled_c_group = 0;
                        bot.commands.forEach(commande => {
                            if(commande.help.group === _the_group && guild_data.disabled_commands.indexOf(commande.help.name) < 0){
                                current_commands += ' `'+commande.help.name+'`';
                                nb_cmd++;
                            }
                            if(commande.help.group === _the_group && guild_data.disabled_commands.indexOf(commande.help.name) >= 0){
                                disabled_nb++;
                                disabled_c_group++;
                            }
                        });
                        current_commands = current_commands.replace(/[' '_]/g,', ');
                        current_commands = current_commands.substr(1);
                        _the_group = _the_group.charAt(0).toUpperCase() + _the_group.substring(1);
                        if(nb_cmd > 0){
                            var commands_nb = nb_cmd - disabled_c_group;
                            help_embed.addField(_the_group + ' - ('+commands_nb+')', current_commands);
                        }
                    }
                });
                var total = (all_nb_cmd - disabled_nb) + nombre;
                help_embed.setAuthor('Listes des commandes - (' + total + ')');
                if(countcommands(guild_data.commands) > 0){
                    var perso_commands = '';
                    for (var commande in guild_data.commands){
                        perso_commands += ' `'+commande+'`';
                    }
                    perso_commands = perso_commands.replace(/[' '_]/g,', ');
                    perso_commands = perso_commands.substr(1);
                    help_embed.addField(message.guild.name, perso_commands);
                }
                message.channel.send(help_embed);
            }
        }
        if(command.indexOf('-') > -1){
            var _c = command.split('-');
            if(_c[0] == 'help'){
                var _group = _c[1];
                if(guild_data.disabled_modules.includes(_c[1])) return message.channel.send(emotes[0] + ' | Ce module est désactivé !')
                var nb_groups = 0;
                var _commands = [];

                _c[1] = _c[1].toLowerCase();

                var commands_embed = new Discord.RichEmbed()
                .setColor(color)
                .setFooter('Tape '+guild_data.prefix+'help [cmd] pour obtenir des infos sur une commande !');

                bot.commands.forEach(element => {
                    if(element.help.group == _c[1]){
                        _usage = element.help.usage;
                        _desc = element.help.desc;
                        if(!_desc){
                            _desc = 'Pas de description';
                        }
                        if(!_usage){
                            _usage = element.help.name;
                        }
                        commands_embed.addField(guild_data.prefix + _usage, _desc);
                        nb_groups++;
                    }
                });
                if(nb_groups === 0){
                    return message.channel.send(emotes[0] + ' | Le groupe de commande `' + _c[1] + '` n\'existe pas !')
                }
                commands_embed.setAuthor("Commandes de la catégorie : " + _c[1])
                    .setDescription('**Rappel : ** () signifie facultatif tandis que [] obligatoire')
                message.channel.send(commands_embed);
            }
        }
    }

});

function countcommands(commands) {
    var count = 0;

    for(var prop in commands) {
        var value = commands[prop];
        if(value !== "disabled"){
            ++count;
        }
    }

    return count;
}

function updateEmbed(){
    
    var AsciiTable = require('ascii-table');

    var commands_object = statistis_db.get('commands');
    commands_array_sorted = sortObject(commands_object);
    commands_array_sorted.length = 9;
    var command_table = new AsciiTable('TOP COMMANDES').setHeading('#', 'Nom', 'Utilisations')
    var command_pos = 0;
    commands_array_sorted.forEach(cmd => {
        command_pos++;
        var name = cmd.key.charAt(0).toUpperCase()+cmd.key.substr(1, cmd.key.length)
        command_table.addRow(command_pos, name, cmd.value);
    });

    var servers_object = statistis_db.get('servers');
    servers_array_sorted = sortObject(servers_object);
    servers_array_sorted.length = 9;
    var servers_table = new AsciiTable('TOP SERVEURS').setHeading('#', 'Nom', 'Use')
    var servers_pos = 0;
    servers_array_sorted.forEach(serv => {
        servers_pos++;
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        var name = '';
        if(bot.guilds.get(serv.key)) name = bot.guilds.get(serv.key).name.replace(regex, '');
        else name = 'Guild Not Found'
        if(name.length > 15) name = name.substr(0, 15)+'...'
        servers_table.addRow(servers_pos, name, serv.value);
    });


    bot.channels.get('557443293173121024').fetchMessage('557452437158494219').then(m => m.edit('@everyone\n\n'+bot.emojis.find(e => e.name === 'chart')+' **Leaderboard des commandes** \n\n```'+command_table.toString()+'```\n\n\n\n'+bot.emojis.find(e => e.name === 'server')+' **Leaderboard des serveurs** \n\n```'+servers_table.toString()+'```', {embed:false}));
    
}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return  b.value - a.value; });
    //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
    return arr; // returns array
}

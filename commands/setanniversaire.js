const Discord = require("discord.js");
const config = require("../data/config.json")
quickdb = require('quick.db'),
errors = require('../utils/errors.js'),
functions = require('../utils/functions.js');

quickdb.init('./data/atlanta.sqlite');
var servers_data = new quickdb.table('serversdata');
var users_data = new quickdb.table('usersdata');

module.exports.run = async (message, args, bot, emotes, data) => {
    
   
    var the_date = args[0];

    if(isNaN(stringToDate(the_date, 'dd/mm/yyyy', '/').getTime())) return errors.utilisation(message, data, emotes);

    if(stringToDate(the_date, 'dd/mm/yyyy', '/').getTime() > Date.now()) return message.channel.send(emotes[0] + " | Il n'est actuellement pas possible de ne pas encore être nait.")
    message.channel.send(emotes[1] +" | Votre date d'anniversaire a été définie sur "+functions.printDate(stringToDate(the_date, 'dd/mm/yyyy', '/')), false);
    users_data.set(message.author.id+'.birthdate', (stringToDate(the_date, 'dd/mm/yyyy', '/').getTime()));

    function stringToDate(_date,_format,_delimiter){
        try{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
        } catch (err) {
            return errors.utilisation(message, data, emotes);
        }
        
    }


}

module.exports.help = {
    name:"setanniversaire",
    desc:"Entrez votre date d'anniversaire qui s'affichera sur votre profil !",
    usage:"setanniversaire [jour/mois/année]",
    group:"économie",
    examples:"$setanniversaire 01/12/2018\n$setanniversaire 18/02/2008"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"false",
    support_only:"false",
    disabled:"false",
    premium:"false",
    owner:"false"
}
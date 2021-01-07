import {bot} from '../index';
const spamFunctions = require('./spamFunctions');
const jsonModifiers = require('./jsonModifiers');
const realBotId = '';

module.exports = {
    loginBot
}

function loginBot(){
    on;
    login;
}

var on = bot.on('message', (message: any) => {

    switch (message.content.split(' ')[0].toLowerCase()) {
        case '!spam.help':
            spamFunctions.help(message)
                .catch((err : any) => console.error(err));
            break;
        case '!spam.alex':
            spamFunctions.spamAlex(message)
                .catch((err : any) => console.error(err));
            break;
        case '!spam.target':
            spamFunctions.spamTarget(message)
                .catch((err : any) => console.error(err));
            break;
        case '!spam.messenger':
            spamFunctions.spamMessenger(message)
                .catch((err: any) => console.error(err));
            break;
        case '!spam.sms':
            spamFunctions.spamSMS(message)
                .catch((err : any) => console.log(err));
            break;
        case '!whitelist.changeinfo':
            jsonModifiers.addingMemberInfo(message)
                .catch((err : any) => console.log(err));
            break;
        case '!whitelist.addtowhitelist':
            jsonModifiers.addingMemberInWhiteList(message)
                .catch((err : any) => console.log(err));
            break;
        case '!whitelist.removemember' :
            jsonModifiers.removeMemberFromJson(message)
                .catch((err : any) => console.log(err));
            break;
        case '!whitelist.removefromwhitelist' :
            jsonModifiers.removeMemberFromWhiteList(message)
                .catch((err : any) => console.log(err));
            break;
        default:
            break;
    }
});

var login = bot.login('').then(() => {
    let guild = bot.guilds.cache.get('');
    jsonModifiers.updateMembers(guild)
        .catch(console.error);

    //jsonModifiers.addingMemberInfo();
});
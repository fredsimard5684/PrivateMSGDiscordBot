"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const spamFunctions = require('./spamFunctions');
const jsonModifiers = require('./jsonModifiers');
const realBotId = '';
module.exports = {
    loginBot
};
function loginBot() {
    on;
    login;
}
var on = index_1.bot.on('message', (message) => {
    switch (message.content.split(' ')[0].toLowerCase()) {
        case '!spam.help':
            spamFunctions.help(message)
                .catch((err) => console.error(err));
            break;
        case '!spam.alex':
            spamFunctions.spamAlex(message)
                .catch((err) => console.error(err));
            break;
        case '!spam.target':
            spamFunctions.spamTarget(message)
                .catch((err) => console.error(err));
            break;
        case '!spam.messenger':
            spamFunctions.spamMessenger(message)
                .catch((err) => console.error(err));
            break;
        case '!spam.sms':
            spamFunctions.spamSMS(message)
                .catch((err) => console.log(err));
            break;
        case '!whitelist.changeinfo':
            jsonModifiers.addingMemberInfo(message)
                .catch((err) => console.log(err));
            break;
        case '!whitelist.addtowhitelist':
            jsonModifiers.addingMemberInWhiteList(message)
                .catch((err) => console.log(err));
            break;
        case '!whitelist.removemember':
            jsonModifiers.removeMemberFromJson(message)
                .catch((err) => console.log(err));
            break;
        case '!whitelist.removefromwhitelist':
            jsonModifiers.removeMemberFromWhiteList(message)
                .catch((err) => console.log(err));
            break;
        default:
            break;
    }
});
var login = index_1.bot.login('').then(() => {
    let guild = index_1.bot.guilds.cache.get('');
    jsonModifiers.updateMembers(guild)
        .catch(console.error);
    //jsonModifiers.addingMemberInfo();
});

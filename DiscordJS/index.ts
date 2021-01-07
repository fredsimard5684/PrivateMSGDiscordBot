//TODO:
/*
    1-Fix spam target so that the bot can spam a target;
    2-Solving recaptcha and generating a new bot;
    3-Change all functions that needs to write the discordID. We will use the discriminator instead;
    4-Complete the TODO functions;
    5-Update messengerID in the json file;
    6-Clean up the code;
    7-Add classes (?).
*/
export const discord = require('discord.js');
export const bot = new discord.Client();
export const discordParty = require('./src/JSON/discordParty.json');
export const fs = require('fs');
const botLogin = require('./src/botLogin');

//Main execution
botLogin.loginBot();

// module.exports = {
//     discord: require('discord.js'),
//     discordParty : require('./discordParty.json'),
//     login: require('facebook-chat-api'),
//     got : require('got'),
//     twilio: require('twilio'),
//     fs: require('fs'),
//     botLogin: require('./src/botLogin'),
//     genBot: require('./src/genBot'),
//     jsonModifiers: require('./src/jsonModifiers'),
//     spamFunctions: require('./src/spamFunctions')
// }





"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs = exports.discordParty = exports.bot = exports.discord = void 0;
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
exports.discord = require('discord.js');
exports.bot = new exports.discord.Client();
exports.discordParty = require('./src/JSON/discordParty.json');
exports.fs = require('fs');
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

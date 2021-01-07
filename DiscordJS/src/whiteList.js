"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
module.exports = {
    isWhiteListed
};
function createWhiteList(list) {
    for (let i = 0; i < index_1.discordParty.whiteList.length; i++) {
        list[i] = new index_1.discord.User(index_1.bot, {
            id: index_1.discordParty.whiteList[i].discordID
        });
    }
}
function isWhiteListed(receiver) {
    let theWhiteList = new Array(index_1.discordParty.whiteList.length);
    createWhiteList(theWhiteList);
    for (let user of theWhiteList) {
        if (receiver.id == user.id) {
            return true;
        }
    }
    return false;
}

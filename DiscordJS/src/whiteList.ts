import {discord, discordParty, bot} from '../index';

module.exports = {
    isWhiteListed
}

function createWhiteList(list: any) {
    for (let i = 0; i < discordParty.whiteList.length; i++) {
        list[i] = new discord.User(bot, {
            id: discordParty.whiteList[i].discordID
        });
    }
}

function isWhiteListed(receiver: any) {

    let theWhiteList: any = new Array(discordParty.whiteList.length);
    createWhiteList(theWhiteList);

    for (let user of theWhiteList) {
        if (receiver.id == user.id) {
            return true;
        }
    }
    return false;
}
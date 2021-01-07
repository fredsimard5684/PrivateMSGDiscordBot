"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const whiteList = require('./whiteList');
module.exports = {
    updateMembers,
    addingMemberInfo,
    addingMemberInWhiteList,
    removeMemberFromWhiteList,
    removeMemberFromJson
};
//Get all the necessary variables to update the json file with a new member. 
function updateMembers(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        let discordID;
        let discriminator;
        let username;
        let isBot;
        let listOfNonMember;
        //Fetch the member of the guild and then map the key info into an array that can be use by other functions. 
        guild.members.fetch().then((fetchedMembers) => __awaiter(this, void 0, void 0, function* () {
            discordID = fetchedMembers.map((member) => member.id);
            discriminator = fetchedMembers.map((member) => member.user.discriminator);
            username = fetchedMembers.map((member) => member.user.username);
            isBot = fetchedMembers.map((member) => member.user.bot);
            listOfNonMember = yield chekForNewMember(discordID, discriminator, username, isBot);
            if (listOfNonMember.length == 0) {
                console.log("No new member");
                updateUsername(username);
                return;
            }
            yield modifyJSON(listOfNonMember);
            updateUsername(username);
        }));
    });
}
//Return the members that are currently not in the JSON file. Can be no one.
function chekForNewMember(discordID, discriminator, username, isBot) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAlreadyMember;
        let listOfNonMember = [];
        for (let i = 0; i < discordID.length; i++) {
            isAlreadyMember = false;
            for (let jsonData of index_1.discordParty.discordParty)
                if (jsonData.discordID == discordID[i])
                    isAlreadyMember = true;
            if (!isAlreadyMember)
                listOfNonMember.push({ discordID: discordID[i], discriminator: discriminator[i], username: username[i], isBot: isBot[i] });
        }
        return listOfNonMember;
    });
}
//Add the new member in the JSON file.
function modifyJSON(list) {
    return __awaiter(this, void 0, void 0, function* () {
        //Collecting the data
        let data = index_1.discordParty;
        list.forEach((element) => {
            data.discordParty.push({
                "discordID": element.discordID,
                "discriminator": element.discriminator,
                "username": element.username,
                "isBot": element.isBot,
                "messengerID": "null",
                "telephone": "null"
            });
        });
        data.discordParty.sort((a, b) => {
            return a.discordID - b.discordID;
        });
        index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(data, null, 6), 'utf-8', ((err) => {
            if (err)
                console.error(err);
            console.log('done updating');
        }));
    });
}
//Adding the information of a member already in the server
function addingMemberInfo(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!whiteList.isWhiteListed(message.author)) {
            console.log("a non whitelisted member is trying to access this function... So sad...");
            return;
        }
        const args = message.content.split(' ').slice(1);
        console.log(args.length);
        let discriminator = args[0];
        discriminator = discriminator.slice(1);
        let messengerInfo = 'null';
        let telephoneInfo = 'null';
        if (args.length < 2) {
            console.log("Can't add the informations since there are no information about the user...");
            return;
        }
        if (args.length < 3) {
            let info = args.slice(1).join(' ');
            console.log(info);
            info.startsWith('+1') ? telephoneInfo = info : messengerInfo = info;
        }
        else if (args.length < 4) {
            let info = args.slice(1).join(' ');
            info.startsWith('+1') ? telephoneInfo = args.slice(1, args.length - 1).join(' ') : messengerInfo = args.slice(1, args.length - 1).join(' ');
            messengerInfo == 'null' ? messengerInfo = args[args.length - 1] : telephoneInfo = args[args.length - 1];
        }
        let member = index_1.discordParty;
        let position = 0;
        let isDiscriminatorFound = false; //Chek if the user is really a member of the server
        for (let elements of index_1.discordParty.discordParty) {
            if (elements.discriminator == discriminator) {
                isDiscriminatorFound = true;
                elements.messengerID != 'null' && messengerInfo == 'null' ? messengerInfo = elements.messengerID : messengerInfo;
                elements.telephone != 'null' && telephoneInfo == 'null' ? telephoneInfo = elements.telephone : telephoneInfo;
                member.discordParty[position].messengerID = messengerInfo;
                member.discordParty[position].telephone = telephoneInfo;
                break;
            }
            position++;
        }
        if (!isDiscriminatorFound) {
            console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
            return;
        }
        console.log(`The following information has been added to the user #${discriminator}: Messenger: ${messengerInfo}, Telephone: ${telephoneInfo}`);
        index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 6), function (err) {
            if (err)
                throw err;
            console.log("sucess modifing!");
        });
    });
}
//Adding a non whitelist member to the whitelist
function addingMemberInWhiteList(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!whiteList.isWhiteListed(message.author)) {
            console.log("a non whitelisted member is trying to access this function... So sad...");
            return;
        }
        const args = message.content.split(' ').slice(1);
        if (args.length > 2) {
            console.log("too many arguments");
            return;
        }
        const discordID = args[0];
        const name = args[1];
        let member = index_1.discordParty;
        let memberExist = false; //Chek if the user is really a member of the server
        for (let elements of index_1.discordParty.discordParty)
            if (elements.discordID == discordID)
                memberExist = true;
        if (!memberExist) {
            console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
            return;
        }
        member.whiteList.push({
            "discordID": discordID,
            "name": name
        });
        index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 2), 'utf-8', ((err) => {
            if (err)
                console.error(err);
            console.log('done adding!');
        }));
    });
}
//Remove a user from the whitelist
function removeMemberFromWhiteList(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!whiteList.isWhiteListed(message.author)) {
            console.log("a non whitelisted member is trying to access this function... So sad...");
            return;
        }
        const args = message.content.split(' ').slice(1);
        if (args.length > 1) {
            console.log("too many arguments");
            return;
        }
        let discordID = args[0];
        console.log(discordID);
        let position = 0;
        let memberExist = false; //Chek if the user is really a member of the server
        for (let elements of index_1.discordParty.whiteList) {
            if (elements.discordID == discordID) {
                memberExist = true;
                break;
            }
            position++;
        }
        if (!memberExist) {
            console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
            return;
        }
        let member = index_1.discordParty;
        member.whiteList.splice(position, 1); //Removing and resizing the array at that position
        index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 2), 'utf-8', ((err) => {
            if (err)
                console.error(err);
            console.log('done removing!');
        }));
    });
}
//Remove a user from the JSON file
function removeMemberFromJson(message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!whiteList.isWhiteListed(message.author)) {
            console.log("a non whitelisted member is trying to access this function... So sad...");
            return;
        }
        const args = message.content.split(' ').slice(1);
        if (args.length > 1) {
            console.log("too many arguments");
            return;
        }
        let discriminator = args[0].slice(1);
        let position = 0;
        let memberExist = false; //Chek if the user is really a member of the server
        for (let elements of index_1.discordParty.discordParty) {
            if (elements.discriminator == discriminator) {
                memberExist = true;
                break;
            }
            position++;
        }
        if (!memberExist) {
            console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
            return;
        }
        let member = index_1.discordParty;
        member.discordParty.splice(position, 1);
        index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 6), 'utf-8', ((err) => {
            if (err)
                console.error(err);
            console.log('done removing!');
        }));
    });
}
//Update the username
function updateUsername(username) {
    let data = index_1.discordParty;
    for (let i = 0; i < username.length; i++)
        if (data.discordParty[i].username != username[i])
            data.discordParty[i].username = username[i];
    index_1.fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(data, null, 6), 'utf-8', ((err) => {
        if (err)
            console.error(err);
        console.log('done changing username');
    }));
}

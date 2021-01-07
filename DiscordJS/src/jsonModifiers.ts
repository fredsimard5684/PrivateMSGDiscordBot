import { discordParty, fs } from '../index'
const whiteList = require('./whiteList');

module.exports = {
    updateMembers,
    addingMemberInfo,
    addingMemberInWhiteList,
    removeMemberFromWhiteList,
    removeMemberFromJson
}

//Get all the necessary variables to update the json file with a new member. 
async function updateMembers(guild: any) {
    let discordID: string;
    let discriminator: string;
    let username: string;
    let isBot: string;
    let listOfNonMember: any;

    //Fetch the member of the guild and then map the key info into an array that can be use by other functions. 
    guild.members.fetch().then(async (fetchedMembers: any) => {
        discordID = fetchedMembers.map((member: any) => member.id);
        discriminator = fetchedMembers.map((member: any) => member.user.discriminator);
        username = fetchedMembers.map((member: any) => member.user.username);
        isBot = fetchedMembers.map((member : any) => member.user.bot);

        listOfNonMember = await chekForNewMember(discordID, discriminator, username, isBot);

        if (listOfNonMember.length == 0) {
            console.log("No new member");
            updateUsername(username);
            return;
        }
        await modifyJSON(listOfNonMember);
        updateUsername(username);
    });
}

//Return the members that are currently not in the JSON file. Can be no one.
async function chekForNewMember(discordID: string, discriminator: string, username: string, isBot : string) {
    let isAlreadyMember: boolean;
    let listOfNonMember: any = [];

    for (let i = 0; i < discordID.length; i++) {
        isAlreadyMember = false;
        for (let jsonData of discordParty.discordParty)
            if (jsonData.discordID == discordID[i])
                isAlreadyMember = true;
        if (!isAlreadyMember)
            listOfNonMember.push({ discordID: discordID[i], discriminator: discriminator[i], username: username[i], isBot : isBot[i] });
    }
    return listOfNonMember;
}

//Add the new member in the JSON file.
async function modifyJSON(list: any) {
    //Collecting the data
    let data = discordParty;

    list.forEach((element: any) => {
        data.discordParty.push({
            "discordID": element.discordID,
            "discriminator": element.discriminator,
            "username": element.username,
            "isBot" : element.isBot,
            "messengerID": "null",
            "telephone": "null"
        })
    });

    data.discordParty.sort((a: any, b: any) => {
        return a.discordID - b.discordID;
    });

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(data, null, 6), 'utf-8', ((err: any) => {
        if (err)
            console.error(err);
        console.log('done updating');
    }));
}

//Adding the information of a member already in the server
async function addingMemberInfo(message: any) {

    if (!whiteList.isWhiteListed(message.author)) {
        console.log("a non whitelisted member is trying to access this function... So sad...");
        return;
    }

    const args = message.content.split(' ').slice(1);
    console.log(args.length);
    let discriminator = args[0];
    discriminator = discriminator.slice(1);

    let messengerInfo: string = 'null';
    let telephoneInfo: string = 'null';

    if (args.length < 2) {
        console.log("Can't add the informations since there are no information about the user...");
        return;
    }

    if (args.length < 3) {
        let info: string = args.slice(1).join(' ');
        console.log(info);
        info.startsWith('+1') ? telephoneInfo = info : messengerInfo = info;
    }

    else if (args.length < 4) {
        let info: string = args.slice(1).join(' ');
        info.startsWith('+1') ? telephoneInfo = args.slice(1, args.length - 1).join(' ') : messengerInfo = args.slice(1, args.length - 1).join(' ');
        messengerInfo == 'null' ? messengerInfo = args[args.length - 1] : telephoneInfo = args[args.length - 1];
    }

    let member = discordParty;
    let position: number = 0;
    let isDiscriminatorFound: boolean = false; //Chek if the user is really a member of the server

    for (let elements of discordParty.discordParty) {
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

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 6), function (err: any) {
        if (err) throw err;
        console.log("sucess modifing!");
    });
}

//Adding a non whitelist member to the whitelist
async function addingMemberInWhiteList(message: any) {

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
    let member = discordParty;
    let memberExist: boolean = false; //Chek if the user is really a member of the server

    for (let elements of discordParty.discordParty)
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

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 2), 'utf-8', ((err: any) => {
        if (err)
            console.error(err);
        console.log('done adding!');
    }));
}

//Remove a user from the whitelist
async function removeMemberFromWhiteList(message : any) {

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

    let position: number = 0;
    let memberExist: boolean = false; //Chek if the user is really a member of the server

    for (let elements of discordParty.whiteList) {
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

    let member = discordParty;
    member.whiteList.splice(position, 1); //Removing and resizing the array at that position

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 2), 'utf-8', ((err: any) => {
        if (err)
            console.error(err);
        console.log('done removing!');
    }));
}

//Remove a user from the JSON file
async function removeMemberFromJson(message: any) {

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

    let position: number = 0;
    let memberExist: boolean = false; //Chek if the user is really a member of the server

    for (let elements of discordParty.discordParty) {
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

    let member = discordParty;
    member.discordParty.splice(position, 1);

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(member, null, 6), 'utf-8', ((err: any) => {
        if (err)
            console.error(err);
        console.log('done removing!');
    }));
}

//Update the username
function updateUsername(username: string) {
    let data = discordParty;

    for (let i = 0; i < username.length; i++)
        if (data.discordParty[i].username != username[i])
            data.discordParty[i].username = username[i];

    fs.writeFile('./src/JSON/discordParty.json', JSON.stringify(data, null, 6), 'utf-8', ((err: any) => {
        if (err)
            console.error(err);
        console.log('done changing username');
    }));

}
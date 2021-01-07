import {discord, bot, discordParty, fs} from '../index'
const twilio = require('twilio');
const login = require('facebook-chat-api');
const accountSid = '';
const authToken = '';
//Securiser les token: 
//Dans cmd(windows):
//set TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//set TWILIO_AUTH_TOKEN=your_auth_token
//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const alex = new discord.User(bot, {
    id: '198841872502882313',
});

const whiteList = require('./whiteList')

module.exports = {
    sendMsg,
    spamAlex,
    spamTarget,
    spamMessenger,
    spamSMS,
    help
}


async function sendMsg(receiver: any, content: string) {
    receiver.send(content)
        .then((message: any) => console.log(`Sent message: ${message.content}`))
        .catch((err: any) => console.error(err));
}

async function spamAlex(message: any) {
    const args = message.content.split(' ');
    let msg: string;
    let temps: number;

    if (args.length < 2) {
        msg = "Let's follow Alexandre :musical_note:";
        temps = 30;
    } else if (args.length < 3 && !isNaN(args[length - 1])) {
        temps = parseInt(args[args.length - 1]);
        msg = "Let's follow Alexandre :musical_note:"
    } else if (isNaN(args[args.length - 1])) {
        temps = 30;
        msg = args.slice(1).join(' ');
    } else {
        msg = args.slice(1, (args.length - 1)).join(' ');
        temps = args[args.length - 1];
    }

    let timerId = setInterval(() => sendMsg(alex, msg), 2000);
    setTimeout(() => { clearInterval(timerId) }, temps * 1000);
}

async function spamTarget(message: any) {
    const args = message.content.split(' ').slice(1);
    const target = new discord.User(bot, {
        id: args[0],
    });
    let msg: string;
    let temps: number;

    args.length < 2 ? (msg = "Ur being spammed",  temps = 30) 
    : args.length < 3 && !isNaN(args[args.length - 1]) ? (temps = parseInt(args[args.length - 1]), msg = "Ur being spammed") 
    : isNaN(args[args.length - 1]) ? (temps = 30, msg = args.slice(1).join(' ')) 
    : (msg = args.slice(1, (args.length - 1)).join(' '), temps = args[args.length - 1]);
    
    // if (args.length < 2) {
    //     msg = "Ur being spammed";
    //     temps = 30;
    // } else if (args.length < 3 && !isNaN(args[args.length - 1])) {
    //     temps = parseInt(args[args.length - 1]);
    //     msg = "Ur being spammed";
    // } else if (isNaN(args[args.length - 1])) {
    //     temps = 30;
    //     msg = args.slice(1).join(' ');
    // } else {
    //     msg = args.slice(1, (args.length - 1)).join(' ');
    //     temps = args[args.length - 1];
    // }

    if(!convertDiscriminatorToID(target)) {
        console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
        return;
    }

    if (!whiteList.isWhiteListed(target)) {
        console.log(target);
        let timerId = setInterval(() => sendMsg(target, msg), 2000);
        setTimeout(() => { clearInterval(timerId) }, temps * 1000);
    } else {
        console.log(target.id + "Not white listed");
        let timerId = setInterval(() => sendMsg((message.author), msg), 2000);
        setTimeout(() => { clearInterval(timerId) }, temps * 1000);
    }
}

async function spamMessenger(message: any) {
    login({ email: "", password: "" }, (err: any, api: any) => {
        if (err) return console.error(err);

        const args = message.content.split(' ').slice(1);
        const target = new discord.User(bot, {
            id: args[0],
        });
        let msg: string;
        let temps: number;
        let targetMessengerID: string = '';

        args.length < 2 ? (msg = "Ur being spammed",  temps = 30) 
        : args.length < 3 && !isNaN(args[args.length - 1]) ? (temps = parseInt(args[args.length - 1]), temps > 30 ? temps = 30 : temps, msg = "Ur being spammed") 
        : isNaN(args[args.length - 1]) ? (temps = 30, msg = args.slice(1).join(' ')) 
        : (msg = args.slice(1, (args.length - 1)).join(' '), temps = args[args.length - 1], temps > 30 ? temps = 30 : temps);

        // if (args.length < 2) {
        //     msg = "Ur being spammed";
        //     temps = 30;
        // } else if (args.length < 3 && !isNaN(args[args.length - 1])) {
        //     temps = parseInt(args[args.length - 1]);
        //     temps > 30 ? temps = 30 : temps;
        //     msg = "Ur being spammed";
        // } else if (isNaN(args[args.length - 1])) {
        //     temps = 30;
        //     msg = args.slice(1).join(' ');
        // } else {
        //     msg = args.slice(1, (args.length - 1)).join(' ');
        //     temps = args[args.length - 1];
        //     temps > 30 ? temps = 30 : temps;
        // }

        if(!convertDiscriminatorToID(target)) {
            console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
            return;
        }
        //Get the messengerID
        for (let discID of discordParty.discordParty) {
            if (target.id === discID.discordID) {
                targetMessengerID = discID.messengerID;
                break;
            }
        }

        //There's no need to continue if the user doesnt have a messenger id set.
        if (targetMessengerID == "null") {
            console.log("The user doesn't have a messenger id");
            return;
        }

        if (!whiteList.isWhiteListed(target)) {
            let timerId = setInterval(() => api.sendMessage(msg, targetMessengerID), 2000);
            console.log(msg);
            setTimeout(() => { clearInterval(timerId), api.logout() }, temps * 1000);
        } else {
            for (let discID of discordParty.discordParty) {
                if (discID.discordID == message.author.id) {
                    let timerId = setInterval(() => api.sendMessage(msg, discID.messengerID), 2000);
                    setTimeout(() => { clearInterval(timerId), api.logout() }, temps * 1000);
                    break;
                }
            }
        }
    });
}

//TODO: DOESNT WORK PROPERLY
async function spamSMS(message: any) {
    console.log('test');
    const args = message.content.split(' ').slice(1);
    const target = new discord.User(bot, {
        id: args[0],
    });
    let msg: string;
    let temps: number;

    args.length < 2 ? (msg = "Ur being spammed",  temps = 30) 
    : args.length < 3 && !isNaN(args[args.length - 1]) ? (temps = parseInt(args[args.length - 1]), temps > 30 ? temps = 30 : temps, msg = "Ur being spammed") 
    : isNaN(args[args.length - 1]) ? (temps = 30, msg = args.slice(1).join(' ')) 
    : (msg = args.slice(1, (args.length - 1)).join(' '), temps = args[args.length - 1], temps > 30 ? temps = 30 : temps);

    // if (args.length < 2) {
    //     msg = "Ur being spammed";
    //     temps = 30;
    // } else if (args.length < 3 && !isNaN(args[args.length - 1])) {
    //     temps = parseInt(args[args.length - 1]);
    //     temps > 30 ? temps = 30 : temps;
    //     msg = "Ur being spammed";
    // } else if (isNaN(args[args.length - 1])) {
    //     temps = 30;
    //     msg = args.slice(1).join(' ');
    // } else {
    //     msg = args.slice(1, (args.length - 1)).join(' ');
    //     temps = args[args.length - 1];
    //     temps > 30 ? temps = 30 : temps;
    // }

    if(!convertDiscriminatorToID(target)) {
        console.log("it seems that the user you are trying to find is not a member of the server... Try again with another user.");
        return;
    }

    let getTelephoneNumber: any;
    for (let discID of discordParty.discordParty) {
        if (target.id === discID.discordID) {
            if (discID.telephone === 'null')
                return;
            else
                getTelephoneNumber = discID.telephone;
            break;
        }
    }

    if (!whiteList.isWhiteListed(target)) {
        let timerId = setInterval(() => client.messages.create({
            body: msg,
            to: getTelephoneNumber,
            from: '+12018977836'
        })
            .then((message: any) => console.log(message.sid)), 3000);
        setTimeout(() => { clearInterval(timerId) }, temps * 1000);
    } else {
        let timerId = setInterval(() => client.messages.create({
            body: msg,
            to: getTelephoneNumber,
            from: '+12018977836'
        })
            .then((message: any) => console.log(message.sid)), 3000);
        setTimeout(() => { clearInterval(timerId) }, temps * 1000);
    }
}

async function help(message: any) {
    var helpString : string = ''; 
    fs.readFile("./src/help.txt", "utf-8", (err : any, data : string) => {
        if(err)
            console.log(err);
        helpString = data.toString();
        sendMsg(message.author, helpString);
    });
}

//Allow the user to use the discriminator as a target method
function convertDiscriminatorToID(receiver: any) {
    receiver.id = receiver.id.substr(1);
    for (let discriminator of discordParty.discordParty) {
        if (receiver.id == discriminator.discriminator) {
            receiver.id = discriminator.discordID;
            return true;
        }
    }
    return false;
}

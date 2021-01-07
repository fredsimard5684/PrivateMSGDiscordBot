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
const got = require('got');
// Create a new Bot every 24h
function createBot() {
    return __awaiter(this, void 0, void 0, function* () {
        // const headers = {'Authorization':'NzM5NTY1NDE3MTE4MzAyMzM4.XyzXsw.afv9ES_nRY_LUr6x4SzMHMqKDFo'};
        // let response = await got('https://discord.com/api/v6/applications', {headers : headers});
        // for (let app of JSON.parse(response.body)) {
        //     if(app.id != realBotId){
        //         response = await got.post('https://discord.com/api/v6/applications/'+app.id+'/delete', {headers : headers}); 
        //     }
        // }
        // response = await got.post('https://discord.com/api/v6/applications',{json : {'name':'ImBack','team':'null'}, headers : headers}); 
        // const id = (JSON.parse(response.body)).id;
        // console.log(id);
        // response = await got.post('https://discord.com/api/v6/applications/'+id+'/bot',{headers : headers});
        // // const token = (JSON.parse(response.body));
        // // console.log(JSON.parse(response.body).token);
        // response = await got('https://discord.com/api/v6/applications/'+id);
        // token = (JSON.parse(response.body)).bot.token;
        // // console.log(token);
        solveRecaptcha('https://discord.com/oauth2/authorize?client_id=740437722279444510&permissions=2048&scope=bot')
            .catch((err) => {
            //console.log(err);
            console.log(err.response.body);
        });
    });
}
// Solve captchas with 2Captcha; email : dwellermonami@gmail.com password : dweller12345!
function solveRecaptcha(requestUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = { 'Authorization': 'NzM5NTY1NDE3MTE4MzAyMzM4.XyzXsw.afv9ES_nRY_LUr6x4SzMHMqKDFo' };
        const recaptchaOptions = {
            key: '7c24051b9e5c3aeea2470456752da733',
            method: 'userrecaptcha',
            googlekey: '6Lef5iQTAAAAAKeIvIY-DeexoO3gj7ryl9rLMEnn',
            pageurl: requestUrl,
            json: 1
        };
        let response = yield got.post('https://2captcha.com/in.php', { form: recaptchaOptions });
        let id = JSON.parse(response.body).request;
        console.log(id);
        const responseRecaptchaOptions = {
            key: '7c24051b9e5c3aeea2470456752da733',
            action: 'get',
            id: id,
            json: 1
        };
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            let response = yield got('https://2captcha.com/res.php', { searchParams: responseRecaptchaOptions });
            console.log(response.body);
            let captchaKey = JSON.parse(response.body).request;
            response = yield got.post(requestUrl, { headers: headers, json: { "captcha_key": captchaKey, "bot_guild_id": "690749047245635614", "permissions": "2048", "authorize": true } });
            console.log(response.body);
        }), 180000);
        // console.log(response.body);
        // genBot.login(token);
    });
}
// createBot()
//     .catch((err) => {
//         console.log(err.response.body);
//     })

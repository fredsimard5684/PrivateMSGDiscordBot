const got = require('got');

// Create a new Bot every 24h
async function createBot() {
    // const headers = {'Authorization':''};
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
    solveRecaptcha('https://discord.com/oauth2/authorize?')
        .catch((err) => {
            //console.log(err);
            console.log(err.response.body);
        })
}

async function solveRecaptcha(requestUrl : string){
    const headers = {'Authorization':''};
    const recaptchaOptions = {                                                 
        key : '',
        method : '',
        googlekey : '',
        pageurl : requestUrl,
        json : 1
    }
    let response = await got.post('https://2captcha.com/in.php', { form: recaptchaOptions });
    let id = JSON.parse(response.body).request;
    console.log(id);
    const responseRecaptchaOptions = {
        key: '',
        action: 'get',
        id: id,
        json: 1
    }
    setTimeout(async () => {
        let response = await got('https://2captcha.com/res.php', { searchParams: responseRecaptchaOptions });
        console.log(response.body);
        let captchaKey = JSON.parse(response.body).request;
        response = await got.post(requestUrl, { headers: headers, json: { "captcha_key": captchaKey, "bot_guild_id": "", "permissions": "2048", "authorize": true } });
        console.log(response.body);
    }, 180000);

    // console.log(response.body);
    // genBot.login(token);
}

// createBot()
//     .catch((err) => {
//         console.log(err.response.body);
//     })

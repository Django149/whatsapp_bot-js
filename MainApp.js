const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LegacySessionAuth, Buttons, MessageTypes, GroupNotificationTypes } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';
const COUNTER_FILE_PATH = './counter.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

// Save session values to the file upon successful auth                            
client.on('authenticated', (session) => { 
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    
});

client.on('message', async message => {
    
    const contact = await message.getContact();
    const chat = await message.getChat();
    if(message.body === '!שלום'){
        if((await message.getChat()).isGroup == true){
            await chat.sendMessage(`Hello @${contact.id.user}`, {
                mentions: [contact]
            });
        }
        else{
            await message.reply("Shalom");
        }
    }
    if(message.body === '!הקלד'){
        await chat.sendStateTyping();
    }
    if(message.body === '!הקלט'){
        await chat.sendStateRecording();
    }
    // 
    if(message.body.startsWith('!כפתור')){
        let button;
        let jsonfile = JSON.parse(fs.readFileSync("./buttons.json"));
        let content = message.body.slice(7);
        console.log(content);
        let content_arr = content.split("-");
        console.log(content_arr);
        let title = content_arr[0];
        console.log(title);
        let discription = content_arr[1];
        let arr_of_buttons_body = [];
        for(let i = 2; i < content_arr.length; i++){
            arr_of_buttons_body.push(content_arr[i]);
            console.log(content_arr[i]);
        } 
        console.log(arr_of_buttons_body);
        let container = {
            "title": title,
            "discription": discription,
            "arr_of_buttons_body": arr_of_buttons_body
        };
        jsonfile.push(container);
        fs.writeFile("./buttons.json", JSON.stringify(jsonfile, null, 2), err => {
            if(err){
                console.log(err);
            }
        });
        if(arr_of_buttons_body.length === 2){
            button = new Buttons(title,[{body:arr_of_buttons_body[0], id:arr_of_buttons_body[0]},{body:arr_of_buttons_body[1],id:arr_of_buttons_body[1]}], discription);
        }
        else if(arr_of_buttons_body.length === 3){
            button = new Buttons(title,[{body:arr_of_buttons_body[0], id:arr_of_buttons_body[0]},{body:arr_of_buttons_body[1],id:arr_of_buttons_body[1]}, {body:arr_of_buttons_body[2], id:arr_of_buttons_body[2]}], discription);
        }
        else if(arr_of_buttons_body.length === 4){
            button = new Buttons(title,[{body:arr_of_buttons_body[0], id:arr_of_buttons_body[0]},{body:arr_of_buttons_body[1],id:arr_of_buttons_body[1]}, {body:arr_of_buttons_body[2], id:arr_of_buttons_body[2]}, {body:arr_of_buttons_body[3], id:arr_of_buttons_body[3]}], discription);
        }
        else if(arr_of_buttons_body.length === 5){
            button = new Buttons(title,[{body:arr_of_buttons_body[0], id:arr_of_buttons_body[0]},{body:arr_of_buttons_body[1],id:arr_of_buttons_body[1]}, {body:arr_of_buttons_body[2], id:arr_of_buttons_body[2]}, {body:arr_of_buttons_body[3], id:arr_of_buttons_body[3]}, {body:arr_of_buttons_body[4], id:arr_of_buttons_body[4]}], discription);
        }
        await chat.sendMessage(button);
    }
    
    if(message.type === MessageTypes.BUTTONS_RESPONSE){
        let jsonfile = JSON.parse(fs.readFileSync("./counter.json"));   
        if(message.selectedButtonId === "theking"){
            jsonfile.CounterOne++;
        }
        else{
            jsonfile.CounterTwo++;
        }

        fs.writeFile("./counter.json", JSON.stringify(jsonfile, null, 2), err => {
            if(err){
                console.log(err);
            }
        });
    }
    if(message.body === "!stop"){
        let jsonfile = JSON.parse(fs.readFileSync("./counter.json"));
        chat.sendMessage("The number of counter is - "+ counter);
        chat.sendMessage("The number of twocounter is - "+ twocounter);
    }
    if(message.body.startsWith("!קלט")){
        let ret = message.body.slice(5);
        await chat.sendMessage('אמרת: ' + ret);
    }
    if(message.body.startsWith("!spam")){
        let ret = message.body.split(" ");
        let ret_num = (Number)(ret[1]);
        console.log("The ret is - "+ret_num);
        let spam_array = message.body.split(" ");
        console.log(spam_array);
        let spam_msg= "";
        for(let i =2; i < spam_array.length;i++){
            spam_msg += " "+spam_array[i];
        }
        for (let i = 0; i < ret_num; i++) {
            await chat.sendMessage(spam_msg);
            console.log(spam_msg+"           "+spam_array+"      f");
        }
    }
    if(message.body.startsWith("!צרף")){
        //reaction command
        let quoted = message.getQuotedMessage();
    }
    console.log(message.body);
    if(message.type === MessageTypes.BUTTONS_RESPONSE){
        console.log();
        
    }

});

// function timeDifference(current, previous){
//     var msPerMinute = 60 * 1000;
//     var elapsed = current - previous;

//     if (elapsed < msPerMinute) {
//         return Math.round(elapsed/1000);   
//     }
// }

client.initialize();

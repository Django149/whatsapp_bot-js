const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LegacySessionAuth, Buttons, MessageTypes } = require('whatsapp-web.js');

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
    
    if(message.body === '!כפתור'){
        let button = new Buttons('זה עובד',[{body:'אופקי',id:"ofek"},{body:'המלך',id:"theking"}],'זה בדיקה לכפתור בווצאפ','כל הזכויות שמורות');
        
        //console.log("This is the id of the btn shown up - "+id_Btn);
        await chat.sendMessage(button);
        //console.log("the btn id "+button.buttons);
        

        await message.reply("aolala");
        let f = message.hasQuotedMsg;
        //console.log(f);
    }
    
    if(message.type === MessageTypes.BUTTONS_RESPONSE){
        
        let rawdata = fs.readFileSync(COUNTER_FILE_PATH);
        let content = JSON.parse(rawdata);
        let count = content.CounterOne;
        console.log("            "+content);
        console.log("            "+count);

        if(message.selectedButtonId === "theking"){
            
        }
        else{
            twocounter++;
        }
    }
    if(message.body === "!stop"){
        chat.sendMessage("The number of counter is - "+counter);
        chat.sendMessage("The number of twocounter is - "+twocounter);
    }
    if(message.body.startsWith("!קלט")){
        let ret = message.body.slice(5);
        await chat.sendMessage('אמרת: ' + ret);
    }
    if(message.body.startsWith("!sendlove")){
        let ret = message.body.slice(10);
        for (let i = 0; i <= ret.length; i++) {
            await chat.sendMessage("Shahar ily ma babe");
        }
    }
    
    if(message.type === MessageTypes.BUTTONS_RESPONSE){
        console.log();
        
    }
    console.log(message.type);
});
client.on('message_create', async msg =>{
    
    
    
});

// function timeDifference(current, previous){
//     var msPerMinute = 60 * 1000;
//     var elapsed = current - previous;

//     if (elapsed < msPerMinute) {
//         return Math.round(elapsed/1000);   
//     }
// }

client.initialize();

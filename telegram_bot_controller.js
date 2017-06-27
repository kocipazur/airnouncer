const fs = require('fs');
const Slimbot = require('slimbot');
var token = fs.readFileSync('telegram_bot_token').toString().trim();
//const slimbot = new Slimbot(fs.readFileSync('telegram_bot_token').toString());
const slimbot = new Slimbot(token);

slimbot.on('message', message => {
  slimbot.sendMessage(message.chat.id, 'Message received');
  console.log(message.chat.id);
});

// Call API

slimbot.startPolling();

const fs = require('fs');
const Slimbot = require('slimbot');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var token = fs.readFileSync('telegram_bot_token').toString().trim();
//const slimbot = new Slimbot(fs.readFileSync('telegram_bot_token').toString());
const slimbot = new Slimbot(token);

var helpMessage = `/start - rozpocznij subskrypcję \n
/stop - zatrzymaj subskrypcję \n
/help - wyświetl pomoc`;

slimbot.on('message', message => {
  switch(message.text){
    case '/help':
      slimbot.sendMessage(message.chat.id, helpMessage)
      break;
    case '/start':
      break;
    default:
      slimbot.sendMessage(message.chat.id, 'Niepoprawna komenda. Użyj /help, aby uzyskać pomoc.')
  }
  console.log(message.chat.id + ': ' + message.text + '\n');
});

// Call API

slimbot.startPolling();

const fs = require('fs');
const Slimbot = require('slimbot');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var token = fs.readFileSync('telegram_bot_token').toString().trim();
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
      MongoClient.connect('mongodb://localhost:27017/airnouncer', function(err, db) {
        if (err) throw err
        var myobj = { chatid: message.chat.id };
        var users = db.collection('users');
        users.findOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("Checking if user exists for insertion...");
          if (res === null) users.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("User does not exist.");
            console.log("User inserted.");
            slimbot.sendMessage(message.chat.id, `Subskrypcja została aktywowana!`);
          });
          else {
            slimbot.sendMessage(message.chat.id, `Subskrypcja jest już aktywna.`);
          }
          db.close();
          });
        });
      break;
      case '/stop':
        MongoClient.connect('mongodb://localhost:27017/airnouncer', function(err, db) {
          if (err) throw err
          var myobj = { chatid: message.chat.id };
          var users = db.collection('users');
          users.findOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("Checking if user exists for deletion...");
            if (res != null) users.remove(myobj, function(err, res) {
              if (err) throw err;
              console.log("User exists.")
              console.log("User deleted.");
              slimbot.sendMessage(message.chat.id, `Subskrypcja została dezaktywowana!`);
            });
              else {
                slimbot.sendMessage(message.chat.id, `Subskrypcja nie została aktywowana.`);
              }
            db.close();
            });
          });
        break;
    default:
      slimbot.sendMessage(message.chat.id, `Nieznana komenda. Użyj /help,
         aby uzyskać pomoc i listę dostępnych poleceń.`);
  }
  console.log(message.chat.id + ': ' + message.text + '\n');
});

// Call API

slimbot.startPolling();

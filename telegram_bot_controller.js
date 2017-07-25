const fs = require('fs');
const Slimbot = require('slimbot');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const request = require('request');

const mongoUrl = 'mongodb://localhost:27017/airnouncer';
const airnouncerApiUrl = 'http://127.0.0.1:1924/airnouncer/api/';
const apiArrivalsUrl = airnouncerApiUrl + 'getArrivals';
const apiDeparturesUrl = airnouncerApiUrl + 'getDepartures';

const token = fs.readFileSync('telegram_bot_token').toString().trim();
const slimbot = new Slimbot(token);

const helpMessage = `Airnouncer - przyloty i odloty z poznańskiej Ławicy \n
/start - rozpocznij subskrypcję \n
/stop - zatrzymaj subskrypcję \n
/help - wyświetl pomoc \n
/shelp - komendy testowe`;

const serviceHelpMessage = `Komendy testowe - diagnostyczne \n
/getarrivalsjson - przyloty w formacie JSON \n
/getdeparturesjson - odloty w formacie JSON`;

setInterval(function (){
  request(apiArrivalsUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    MongoClient.connect(mongoUrl, (err, db) => {
      let arrivals = db.collection('arrivals');
      arrivals.insertOne(JSON.parse(body), (err, res) => {
        if (err) throw err;
        console.log("Arrivals inserted.");
      });
    });
  };
  });
  request(apiDeparturesUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    MongoClient.connect(mongoUrl, (err, db) => {
      let departures = db.collection('departures');
      departures.insertOne(JSON.parse(body), (err, res) => {
        if (err) throw err;
        console.log("Departures inserted.");
      });
    });
  };
  });
  console.log("Cyk!");
},6000);

slimbot.on('message', message => {
  var thisChatId = message.chat.id;
  switch(message.text){
    case '/help':
      slimbot.sendMessage(thisChatId, helpMessage)
      break;
    case '/shelp':
      slimbot.sendMessage(thisChatId, serviceHelpMessage)
      break;
    case '/start':
      MongoClient.connect(mongoUrl, (err, db) => {
        if (err) throw err
        var myobj = { chatid: thisChatId };
        var users = db.collection('users');
        users.findOne(myobj, (err, res) => {
          if (err) throw err;
          console.log("Checking if user exists for insertion...");
          if (res === null) users.insertOne(myobj, (err, res) => {
            if (err) throw err;
            console.log("User does not exist.");
            console.log("User inserted.");
            slimbot.sendMessage(thisChatId, `Subskrypcja została aktywowana!`);
          });
          else {
            slimbot.sendMessage(thisChatId, `Subskrypcja jest już aktywna.`);
          }
          db.close();
          });
        });
      break;
      case '/getarrivalsjson':
        request(apiArrivalsUrl, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            slimbot.sendMessage(thisChatId, JSON.stringify(JSON.parse(body), null, 2));
          }
        });
        break;
      case '/getdeparturesjson':
        request(apiDeparturesUrl, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            slimbot.sendMessage(thisChatId, JSON.stringify(JSON.parse(body), null, 2));
          }
        });
        break;
      case '/stop':
        MongoClient.connect(mongoUrl, (err, db) => {
          if (err) throw err
          var myobj = { chatid: thisChatId };
          var users = db.collection('users');
          users.findOne(myobj, (err, res) => {
            if (err) throw err;
            console.log("Checking if user exists for deletion...");
            if (res != null) users.remove(myobj, (err, res) => {
              if (err) throw err;
              console.log("User deleted.");
              slimbot.sendMessage(thisChatId, `Subskrypcja została dezaktywowana!`);
            });
              else {
                slimbot.sendMessage(thisChatId, `Subskrypcja nie została aktywowana.`);
              }
            db.close();
            });
          });
        break;
    default:
      slimbot.sendMessage(thisChatId, `Nieznana komenda. Użyj /help,
         aby uzyskać pomoc i listę dostępnych poleceń.`);
  }
  console.log(thisChatId + ' - ' + message.text + '\n');
});

// Call API

slimbot.startPolling();

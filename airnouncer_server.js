var request = require("request");
var cheerio = require("cheerio");
var url = require("url");
var http = require("http");

var port = 1924;
var host = '127.0.0.1';

var resType = { 'Content-Type': 'application/json; charset=utf-8'};
var apiPath = '/airnouncer/api/';

var arrivals = [];
var departures = [];

server = http.createServer(function (req, res) {
    res.writeHead(200, resType);
    request('http://www.airport-poznan.com.pl/pl/', function(error, code, source) {
      if (!error && code.statusCode == 200){
          var $ = cheerio.load(source);
          if (url.parse(req.url).pathname === apiPath + 'getArrivals') {
            var arrivalsPage = $('#tabs-1');
            var arrivalsArr = arrivalsPage.children();
            //w petli omijamy pierwszy i ostatni element, bo tam siedzi jakis syf
            for (var index = 1; index < arrivalsArr.length -1; index++){
              arrivals.push({
                hour: arrivalsArr[index].children[1].children[0].data.trim(),
                from: arrivalsArr[index].children[3].children[0].data.trim(),
                nr: arrivalsArr[index].children[5].children[0].data.trim(),
                message: arrivalsArr[index].children[7].children[0].data.trim()
              });
            };
            index = 0;
            var response = {};
            for (var q = 0; q < arrivals.length; q++) {
              response["_" + q.toString()] = arrivals[q];
            };
            res.end(JSON.stringify(response));
            response = {};
            arrivals = [];
            q = 0;
          };
          if (url.parse(req.url).pathname === apiPath + 'getDepartures') {
            var departuresPage = $('#tabs-2');
            var departuresArr = departuresPage.children();
            //w petli omijamy pierwszy i ostatni element, bo tam siedzi jakis syf
            for (var index = 1; index < departuresArr.length -1; index++){
              departures.push({
                hour: departuresArr[index].children[1].children[0].data.trim(),
                from: departuresArr[index].children[3].children[0].data.trim(),
                nr: departuresArr[index].children[5].children[0].data.trim(),
                message: departuresArr[index].children[7].children[0].data.trim()
              });
            };
            index = 0;
            var response = {};
            for (var q = 0; q < departures.length; q++) {
              response["_" + q.toString()] = departures[q];
            };
            res.end(JSON.stringify(response));
            response = {};
            departures = [];
            q = 0;
          };
      }
    });
})

server.listen(port, host);

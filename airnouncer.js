var request = require("request");
var cheerio = require("cheerio");
var url = require("url");
var http = require("http");

var port = 1924;
var host = '127.0.0.1';

var arrivals = [];
var outgoings = [];

server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8'});
    request('http://www.airport-poznan.com.pl/pl/', function(error, code, source) {
      if (!error && code.statusCode == 200){
          var $ = cheerio.load(source);
          var arrivalsPage = $('#tabs-1');
          var arrivalsArr = arrivalsPage.children();
          //w petli omijamy pierwszy i ostatni element, bo tam siedzi jakis syf
          for (var index = 1; index < arrivalsArr.length -1; index++){
            arrivals.push({
              hour: arrivalsArr[index].children[1].children[0].data,
              from: arrivalsArr[index].children[3].children[0].data,
              nr: arrivalsArr[index].children[5].children[0].data,
              message: arrivalsArr[index].children[7].children[0].data
            });
          };
          if (url.parse(req.url).pathname === '/airnouncer/api/getarrivals') {
            var response = {};
            for (var q = 0; q < arrivals.length; q++) {
              response[q.toString()] = arrivals[q];
              // response = response + JSON.stringify(arrivals[q]) + '\n';
            }
            res.end(JSON.stringify(response));
            response = {};
            arrivals = [];
          };
      }
    });
})

server.listen(port, host);

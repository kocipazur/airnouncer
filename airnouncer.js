var request = require("request");
var cheerio = require("cheerio");

var arrivals = [];
var outgoings = [];

request('http://www.airport-poznan.com.pl/pl/', function(error, code, source) {
  if (!error && code.statusCode == 200){
      var $ = cheerio.load(source);
      var arrivals = $('#tabs-1');
      var arrivalsArr = arrivals.children();
      //w petli omijamy pierwszy i ostatni element, bo tam siedzi jakis syf
      for (var index = 1; index < arrivalsArr.length -1; index++){
        process.stdout.write(arrivalsArr[index].children[1].children[0].data + '\t');
        process.stdout.write(arrivalsArr[index].children[3].children[0].data + '\t');
        process.stdout.write(arrivalsArr[index].children[5].children[0].data + '\t');
        process.stdout.write(arrivalsArr[index].children[7].children[0].data);
        console.log();
      }
      // console.log(arrivals.toString());
      // console.log(arrivals.length);
      // var arrivalsArr = arrivals.children();
  }
})

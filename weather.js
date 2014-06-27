
var http = require('http');
//create http server
http.createServer(function (req, res) {
  
  var url=req.url;
  if(url!="/favicon.ico"){//will open this url when I try to write html. Just ignore this link
  //split the url by ?
  var para=url.split('?');
  var log=para[1];
  //get user key
  var key=para[0].substring(8);
  // links to get weather data
  var links=["http://api.wunderground.com/api/"+key+"/conditions/q/CA/Campbell.json"
        ,"http://api.wunderground.com/api/"+key+"/conditions/q/NE/Omaha.json"
        ,"http://api.wunderground.com/api/"+key+"/conditions/q/TX/Austin.json"
        ,"http://api.wunderground.com/api/"+key+"/conditions/q/MD/Timonium.json"];
  
  //result list to store information
  var results=[];
  var count=0;
  for(var i=0;i<links.length;i++){
    //get weather information
    http.get(links[i], function(response) {
      response.on("data", function(chunk) {
        count++;
        //parse weather information
        var obj = JSON.parse(chunk);
        if(typeof obj['current_observation'] !='undefined'){

        var city=obj['current_observation']['display_location']['full'];
        var temp=obj['current_observation']['temp_f']+"F";
        var weather=obj['current_observation']['weather'];
        var humidity=obj['current_observation']['relative_humidity'];
        var wind=obj['current_observation']['wind_string'];
        var pressure=obj['current_observation']['pressure_in']+"inHg";
        //var dew=obj['current_observation']['dewpoint_string'];
        var heat=obj['current_observation']['heat_index_string'];
        var winchill=obj['current_observation']['windchill_string'];
        var feel=obj['current_observation']['feelslike_f']+"F";
        var visi=obj['current_observation']['visibility_mi']+" mile";
        var preci_1hr=obj['current_observation']['precip_1hr_string'];
        var preci_today=obj['current_observation']['precip_today_string'];
        //store in the list
        results.push({loc:city, wea:weather,tem:temp,hum:humidity
                      ,win:wind,press:pressure,hi:heat,wc:winchill
                      ,ft:feel, vi:visi, preci:preci_today});
        //when the last information is received, write to html table
        if(count==4){
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('<!DOCTYPE html>');
          res.write('<html>');
          res.write('<body>');
          res.write('<table style="width:1200px">');
          res.write('<tr>');
          res.write('<td>City</td>');
          res.write('<td>Weather</td>');
          res.write('<td>Temperature</td>');
          res.write('<td>Relative Humidity</td>');
          res.write('<td>Wind</td>');
          res.write('<td>Pressure</td>');
          //res.write('<td>Dew Point</td>');
          res.write('<td>Heat Index</td>');
          res.write('<td>Wind Chill</td>');
          res.write('<td>Feel Temperature</td>');
          res.write('<td>Visibility</td>');
          //res.write('<td>Precipitation 1 Hour</td>');
          res.write('<td>Precipitation Today</td>');
          res.write('</tr>');
          for(var k=0;k<results.length;k++){
            res.write('<tr>');
            //res.write(results[k].loc+":"+results[k].temperature);
            res.write('<td>'+results[k].loc+'</td>');
            res.write('<td>'+results[k].wea+'</td>');
            res.write('<td>'+results[k].tem+'</td>');
            res.write('<td>'+results[k].hum+'</td>');
            res.write('<td>'+results[k].win+'</td>');
            res.write('<td>'+results[k].press+'</td>');
            res.write('<td>'+results[k].hi+'</td>');
            res.write('<td>'+results[k].wc+'</td>');
            res.write('<td>'+results[k].ft+'</td>');
            res.write('<td>'+results[k].vi+'</td>');
            res.write('<td>'+results[k].preci+'</td>');
            res.write('</tr>');
          }
          res.write('</table>');
          res.write('</body>');
          res.write('</html>');
          res.end();
        }
      }else{
        if(count==4){
          //console.log("Wrong Key");
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.write('Wrong key!! Please Try Again!');
          res.end();
        }
      }
      });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
      //break;
  });
  }
  //log information
  if(typeof log != 'undefined'&&String(log).length>0)
    console.log(log);
}
}).listen(12345, '127.0.0.1');
console.log('Server running at http://127.0.0.1:12345/');
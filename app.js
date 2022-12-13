const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");  // use to parse the body of html

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){


  const query = req.body.cityName;   // parsed with the help of body parser
  const apiKey = "064283d650c31dcbd532723ef4ef51c7";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  // because https get method only have a response back as parameter which we are getting from other server(here weather api)
  https.get(url, function(response){
    // console.log(response.statusCode);
    response.on("data", function(data){ // data is the body returned by sever
      const weatherData = JSON.parse(data);
      // console.log(weatherData);

      const temp = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"

      // console.log(weatherDesc);
      // console.log(temp);
      // const object = {
      //   name: "Ayush",
      //   favFood: "Ramen"
      // }
      // console.log(JSON.stringify(object));

      res.write("<h1>The temp in "+ query +" is "+temp+" degree Celcius.</h1>"); // we use write when we have multiple data to be sent
      res.write("<p>The weather is currently "+weatherDesc+"</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    })
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});

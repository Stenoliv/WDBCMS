let userLocation = navigator.geolocation;
function lonlat() {
    if(userLocation) {
        userLocation.getCurrentPosition(located,errorCodes);
    }else {
        "Could not get location!";
    }
    }
function located(data) {
    let lat = data.coords.latitude;
    let long = data.coords.longitude;

    console.log("coordinates",lat,long);
async function getWeather(){
    if(localStorage.getItem("weather_api_key")==""){
        document.querySelector('#weather').innerHTML += `No api key found please fill in api key to see weather`
    }else{
        try {
            API_key = localStorage.getItem("weather_api_key");
            const resp = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_key}`);
            const respJson = await resp.json();
        
            let degree = respJson.wind.deg; 
            //lånad kod för att ändra från grader till väderstreck (N,E,S,W)
            function degToCompass() {
                var val = Math.floor((degree / 22.5) + 0.5);
                var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
                return arr[(val % 16)];
            }
            //lånad kod slut
                weatherid = respJson.weather[0].icon;
                document.querySelector('#weather').innerHTML += `
                <h2>Weather at ${respJson.name}</h2><img src=' https://openweathermap.org/img/wn/${weatherid}@2x.png'></img><p>${respJson.weather[0].description}</p><p>${respJson.main.temp}℃ Feels like ${respJson.main.feels_like}℃</p><p>${respJson.wind.speed}m/s ${degToCompass()}</p><p>Humidity ${respJson.main.humidity}%</p> `;
        }catch {
            document.querySelector('#weather').innerHTML = `Error while trying to get weather!`
        }
        }
    }

    
getWeather()
}
lonlat();
//inspirerat av https://stackoverflow.com/questions/14862019/check-if-location-setting-has-been-turned-off-in-users-browser
  function errorCodes(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        document.querySelector('#weather').innerHTML = "Cannot show weather because you denied usage of location"
        break;
      case error.POSITION_UNAVAILABLE:
        document.querySelector('#weather').innerHTML = "Location information is not available."
        break;
      case error.UNKNOWN_ERROR:
        document.querySelector('#weather').innerHTML = "Unkown error!"
        break;
    }
  }

    
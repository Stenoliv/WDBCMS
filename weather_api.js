let userLocation = navigator.geolocation;
function lonlat() {
    if(userLocation) {
        userLocation.getCurrentPosition(located);
    }else {
        "Could not get location!";
    }
    }
function located(data) {
    let lat = data.coords.latitude;
    let long = data.coords.longitude;

    console.log("coordinates",lat,long);
async function getWeather(){
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
        <h2>Weather at ${respJson.name}</h2><p>${respJson.main.temp}℃</p><p>Feels like ${respJson.main.feels_like}℃</p><p>${respJson.wind.speed}m/s ${degToCompass()}</p><p>Humidity ${respJson.main.humidity}%</p><img src=' https://openweathermap.org/img/wn/${weatherid}@2x.png'></img><p>${respJson.weather[0].description}</p> `;
}catch {
    document.querySelector('#weather').innerHTML = `Error while trying to get weather!`
}
}
getWeather()
}
lonlat();

    
const WHATISMY_API_URL = "https://ipapi.co/";
let lon = 0;
let lat = 0;
const map = new OpenLayers.Map("response-map", { controls: [] });
const countryHTML = document.getElementById("response-country");
const cityHTML = document.getElementById("response-city");
const regionHTML = document.getElementById("response-region");
const inputHTML = document.getElementById("input-ip");
const youripHTML = document.getElementById("your-ip");

function updateMap() {
    // använt mig av ett färdigt bibliotek och koden för dess användning är lånad från: https://openlayers.org/
    map.addLayer(new OpenLayers.Layer.OSM());
    var lonLat = new OpenLayers.LonLat( lon , lat )
        .transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          map.getProjectionObject() // to Spherical Mercator Projection
        );
    var zoom=10;
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    markers.addMarker(new OpenLayers.Marker(lonLat));
    map.setCenter (lonLat, zoom);
}
updateMap()

async function whatsmyip() {
    const url = WHATISMY_API_URL+"json";
    await fetch(url)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            if (data.error != true)
            youripHTML.innerHTML = `${data.ip}`
            else {
                youripHTML.innerHTML = "Couldn't find your ip"
            }
        })
        .catch(error => {
            console.log(error);
            youripHTML.innerHTML = "Something went wrong on our side"
        })
}
whatsmyip()

async function openmap() {
    console.log("openmap()")
    let url = WHATISMY_API_URL+"json";
    if (inputHTML.value != null || !isEmpty(inputHTML.value)) {
        console.log("Empty")
        url = WHATISMY_API_URL+(inputHTML.value)+"/json";
    }
    await fetch(url)
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            if(data.error != true) {
                lon = data.longitude;
                lat = data.latitude;
                updateMap()
                
                countryHTML.innerHTML = `That ip is in: ${data.country_name}`;
                cityHTML.innerHTML = `${data.city}`;
                regionHTML.innerHTML = `${data.region}`
    
                inputHTML.placeholder = `${data.ip}`
            } else {
                updateMap()
                inputHTML.value = ""
                inputHTML.placeholder = "Couldn't find this ip, sorry!"
                cityHTML.innerHTML = ""
                regionHTML.innerHTML = ""
                countryHTML.innerHTML = ""
            }
        })
        .catch(error => {
            console.log(error);
            inputHTML.placeholder = "It seems i couldn't find this ip"
        })
}
openmap()

inputHTML.addEventListener('keypress', e => {
    if (e.key === "Enter") {
        openmap()
    }
})
window.addEventListener('resize', e => {
    updateMap()
})
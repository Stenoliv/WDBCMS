const WHATISMY_API_URL = "https://ipapi.co/";
let lon = 60;
let lat = 25;
let zoom = 9;

// använt mig av ett färdigt bibliotek och koden för dess användning är långt från: https://leafletjs.com/examples/quick-start/
var map = L.map('response-map').setView([lon,lat],zoom);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 5,
        maxZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
var marker = L.marker([lat, lon]).addTo(map);

const countryHTML = document.getElementById("response-country");
const cityHTML = document.getElementById("response-city");
const regionHTML = document.getElementById("response-region");
const inputHTML = document.getElementById("input-ip");
const youripHTML = document.getElementById("your-ip");

function updateMap() {
    const latlng = new L.LatLng(lat,lon);
    marker.setLatLng(latlng)
    marker.bindPopup("<b>Your ip is located around here!</b>")
    map.setView(marker.getLatLng(),zoom);
}
updateMap()

async function whatsmyip() {
    const Yoururl = WHATISMY_API_URL+"json";
    await fetch(Yoururl)
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
    let checkurl = WHATISMY_API_URL+"json";
    if (inputHTML.value != null || !isEmpty(inputHTML.value)) {
        console.log("Empty")
        checkurl = WHATISMY_API_URL+(inputHTML.value)+"/json";
    }
    await fetch(checkurl)
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
            inputHTML.placeholder = "Something went wrong try to refresh the page"
            cityHTML.innerHTML = ""
            regionHTML.innerHTML = ""
            countryHTML.innerHTML = ""
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
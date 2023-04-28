const ChatGPT_API_KEY_STORAGE = "chatgpt_api_key";
const WEATHER_API_KEY_STORAGE = "weather_api_key";

const settingsMneu = document.getElementById("menu-settings");
const chatgptAPI = document.getElementById("chatgpt-api-key");
const weatherAPI = document.getElementById("weather-api-key");

function changeMenu() {
    if (settingsMneu.classList.contains("hidden")) {
        settingsMneu.classList.remove("hidden");
        updateAPIkey(false)
    } else {
        settingsMneu.classList.add("hidden");
        updateAPIkey(true)
    }
}

function updateAPIkey(update) {
    if (update) {
        localStorage.setItem(WEATHER_API_KEY_STORAGE, weatherAPI.value);
        localStorage.setItem(ChatGPT_API_KEY_STORAGE, chatgptAPI.value);
    } else {
        weatherAPI.value = localStorage.getItem(WEATHER_API_KEY_STORAGE);
        chatgptAPI.value = localStorage.getItem(ChatGPT_API_KEY_STORAGE);
    }
}

chatgptAPI.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        updateAPIkey(true);
    }
})
weatherAPI.addEventListener("keypress", e => {
    if (e.key === 'Enter') {
        updateAPIkey(true);
    }
})
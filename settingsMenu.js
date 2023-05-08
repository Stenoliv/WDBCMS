const ChatGPT_API_KEY_STORAGE = "chatgpt_api_key";
const WEATHER_API_KEY_STORAGE = "weather_api_key";
const ToDo_API_KEY_STORAGE = "todo_api_key";
const ToDo_API_USERNAME_STORAGE = "todo_api_username";

const settingsMneu = document.getElementById("menu-settings");
const chatgptAPI = document.getElementById("chatgpt-api-key");
const weatherAPI = document.getElementById("weather-api-key");
const todoAPI = document.getElementById("todo-api-key");
const todoUsername = document.getElementById("todo-api-username");

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
        localStorage.setItem(ToDo_API_KEY_STORAGE, todoAPI.value);
        localStorage.setItem(ToDo_API_USERNAME_STORAGE, todoUsername.value);
    } else {
        weatherAPI.value = localStorage.getItem(WEATHER_API_KEY_STORAGE);
        chatgptAPI.value = localStorage.getItem(ChatGPT_API_KEY_STORAGE);
        todoAPI.value = localStorage.getItem(ToDo_API_KEY_STORAGE);
        todoUsername.value = localStorage.getItem(ToDo_API_USERNAME_STORAGE);
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
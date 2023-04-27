const API_KEY_STORAGE_NAME = "chatgpt_api_key";
const CHATGPT_API_URL = "https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=";

const answerHTML = document.querySelector("#chatgpt-answer");
const questionHTML = document.getElementById("chatgpt-question");


questionHTML.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        console.log("ENTER pressed");
        askQuestion();
    }
})


function checkIfAPIKeySet() {
    if (!localStorage.getItem(API_KEY_STORAGE_NAME))
    {
        console.log("no api key");
        return false;
    } else {
        console.log("api key");
        return true;
    }
}


async function askQuestion() {
    if (checkIfAPIKeySet()) {
        console.log("APIkeySet")

        const KEY = localStorage.getItem(API_KEY_STORAGE_NAME);

        const request = await fetch(CHATGPT_API_URL  + KEY + "&simulation=1" /*Remove before commit*/, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionHTML.value)
        });
        const resp = await request.json();

        console.log(resp);
        answerHTML.innerHTML = resp.answer;
    } else {
        console.log("No api key set!")
        answerHTML.innerHTML = "No API key found!";
    }
}


document.getElementById("btn-submit-question").addEventListener('click', event => {
    askQuestion()
    console.log("Asking Question")
})
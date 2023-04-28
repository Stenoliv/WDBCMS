const API_KEY_STORAGE_NAME = "chatgpt_api_key";
const CHATGPT_API_URL = "https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=";

const answerHTML = document.querySelector("#chatgpt-answer");
const questionHTML = document.getElementById("chatgpt-question");
const questionStatusHTML = document.querySelector(".chatgpt-answer-status");
var lastQuestion = "";

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
        const KEY = localStorage.getItem(API_KEY_STORAGE_NAME);

        questionStatusHTML.innerHTML = "I am thinking"
        await fetch(CHATGPT_API_URL  + KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionHTML.value)
        })
        .then(request => request.json())
        .then(data => {
            console.log(data)
            if (!data.hasOwnProperty('answer')) {
                answerHTML.innerHTML = `${data.msg}`
                questionStatusHTML.innerHTML = "Waiting for you to ask me something"
                questionHTML.value = ""
            } else {
            lastQuestion = questionHTML.value;
            questionStatusHTML.innerHTML = "You asked me this: " + lastQuestion;
            questionHTML.value = ""

            answerHTML.innerHTML = data.answer;
        }
        })
        .catch(error => {
            console.log(error)
            questionStatusHTML.innerHTML = "It seams that i have some problems on my side"
        })
    } else {
        console.log("No api key set!")
        answerHTML.innerHTML = "No API key found!";
    }
}


document.getElementById("btn-submit-question").addEventListener('click', event => {
    askQuestion()
    console.log("Asking Question")
})

questionStatusHTML.addEventListener('click', e => {
    questionHTML.value = lastQuestion;
    questionStatusHTML.innerHTML = "Waiting for you to ask me something"
})
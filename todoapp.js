const TODO_API_URL = "http://128.214.253.222:8355";

let usernameHTML = document.getElementById("username");
let emailHTML = document.getElementById("email");
var API_KEY = localStorage.getItem(ToDo_API_KEY_STORAGE);
var USERNAME = localStorage.getItem(ToDo_API_USERNAME_STORAGE);

if (USERNAME != null) usernameHTML.value = USERNAME;

async function request_new_api() {
    body = {
        username: usernameHTML.value,
        api_key: API_KEY,
        email: emailHTML.value
    }
    
    await fetch (TODO_API_URL+"/todos/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)})
        .then(resp => resp.json())
        .then(data => {
            if (data.hasOwnProperty('api_key')) {
                localStorage.setItem(ToDo_API_KEY_STORAGE,data.api_key);
                localStorage.setItem(ToDo_API_USERNAME_STORAGE,usernameHTML.value);
                API_KEY = data.api_key;
                USERNAME = usernameHTML.value;
            }
        })
        .catch(error => {
            console.log("ERROR: Failed")
        })
}

async function getTodoOptions(){
    try{
        const resp = await fetch ("http://128.214.253.222:8438/todos/categories");
        const respJson = await resp.json();
        for(let i = 0 ; Object.keys(respJson.result).length > i ; i++){
            document.querySelector("#todocategory").innerHTML += `<option value="${respJson.result[i].id}">${respJson.result[i].category_name}</option>`;
        }
    }
    catch{
        document.querySelector("#newtodo").innerHTML += `<p>Something went wrong while getting categories!</p>`;
    }
}
getTodoOptions()

async function getToDos(){
    try{
        const resp = await fetch("http://128.214.253.222:8438/todos/?api_key="+API_KEY+"&"+USERNAME);
        const respJson = await resp.json();
        
    }
    catch{

    }
}
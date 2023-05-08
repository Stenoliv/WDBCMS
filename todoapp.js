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
        const resp = await fetch (TODO_API_URL+"/todos/categories");
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
        const resp = await fetch(TODO_API_URL+"/todos?api_key="+API_KEY+"&username="+USERNAME);
        const respJson = await resp.json();
        if (!Array.isArray(respJson.result)) {
            throw new Error(respJson.result)
        }
        // Add all the todos to the list
        document.querySelector("#toDoList").innerHTML = ""
        respJson.result.forEach(elem => {
            let jaahas ="";
            jaahas +=`<div 
            data-todo_id="${elem.id}" 
            data-todo_category="${elem.category_name}" 
            data-todo_done="${elem.done}"
            data-todo_title="${elem.title}"
            data-todo_duedate="${elem.due_date}"
            class="toDoItem"><p>${elem.title} <span class="categoryTag ${elem.category_name}">${elem.category_name}</span> Due: ${elem.due_date}</p>`
            jaahas+=`<div class="tooltip"><span class="tooltiptext">Status</span><img src="`

            if (new Date(elem.due_date) < new Date() && elem.done == false) 
            {
                jaahas +=`./error-24.png" class="notDoneTask"></img></div>`
            } else if (elem.done == false) 
            {
                jaahas +=`./warning-4-24.png" class="notDoneTask"></img></div>`
            } else 
            {
                jaahas+=`./ok-24.png" class="doneTask"></img></div>`;
            }
            jaahas += `<div class="tooltip"><span class="tooltiptext">Delete</span><img src="./x-mark-4-24.png" class="deleteTask"></div></div>`
            document.querySelector("#toDoList").innerHTML += jaahas
        });

        // Button listeners
        document.querySelectorAll(".toDoItem").forEach(div => {
            try {
                // If not checked query for check done 
            div.querySelector(".notDoneTask").addEventListener('click', () => {
                const data = {done:true}
                checkDone(div.dataset.todo_id,data)
            })}
            catch {
            } 
            // DELETE task
            div.querySelector(".deleteTask").addEventListener('click', () => {
                if(confirm("You sure you want to delete this task?"))
                    deleteTask(div.dataset.todo_id)
            })
            // UPDATE task
            div.addEventListener("dblclick", (event) => {
                console.log("OPEN EDIT BOX")
                openEditBox(div.dataset.todo_id, div)
            })
        })
    }
    catch(error){
        if (error) document.querySelector("#toDoList").innerHTML = `<h3>${error}</h3>`;
        else document.querySelector("#toDoList").innerHTML = `<h3>Something went wrong!</h3>`;
    }
}
getToDos();

async function checkDone(id, new_data) {
    await fetch(TODO_API_URL+"/todos/"+id+"?api_key="+API_KEY+"&username="+USERNAME, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(new_data)
    })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            getToDos()
        })
        .catch(error => {
            console.log(error)
        })
}

async function deleteTask(id) {
    await fetch(TODO_API_URL+"/todos/"+id+"?api_key="+API_KEY+"&username="+USERNAME, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            getToDos()
        })
        .catch(error => {
            console.log(error);
        })
}

async function openEditBox(id, div) {
    const todoEntry = {
        title: div.dataset.todo_title,
        due_date: div.dataset.todo_duedate,
        done: (/true/).test(div.dataset.todo_done),
        category_name: div.dataset.todo_category
    }
    let newToDoEntry = {
        title:null,
        due_date:null,
        done:null,
        category_id:null
    };
    const title = document.querySelector("#todo_edit_title")
    const category = document.querySelector("#todo_edit_category")
    const duedate = document.querySelector("#todo_edit_duedate")
    const done = document.querySelector("#todo_edit_done")

    category.innerHTML = ""
    await fetch(TODO_API_URL+"/todos/categories")
        .then(resp => resp.json())
        .then(data => {
            let index = 0;
            data.result.forEach(elem => {
                category.innerHTML += `<option value="${elem.id}">${elem.category_name}</option>`
                if (elem.category_name === todoEntry.category_name)
                    index = elem.id;
            })
            console.log(index)
            category.value = index;
        })
        .catch(error => {
            console.log(error)
        })
    
    title.value = todoEntry.title
    duedate.value = todoEntry.due_date
    done.checked = todoEntry.done

    title.addEventListener('change', () => {
        newToDoEntry.title = title.value;
        console.log(newToDoEntry.title)
    })
    category.addEventListener('change', () => {
        newToDoEntry.category_id = category.value;
        console.log(newToDoEntry.category_id)
    })
    duedate.addEventListener('change', () => {
        newToDoEntry.due_date = duedate.value
        console.log(newToDoEntry.due_date)
    })
    done.addEventListener('change', () => {
        newToDoEntry.done = done.checked
        console.log(newToDoEntry.done)
    })
    document.querySelector("#todo_edit_submit").addEventListener('click', () => {
        closeEditBox()
        updateToDoTask(id, newToDoEntry)
    })

    document.querySelector(".todo_edit_box").classList.remove("hidden")
}

function closeEditBox() {
    document.querySelector(".todo_edit_box").classList.add("hidden")
}

async function updateToDoTask(id, changedData) {
    await fetch(TODO_API_URL+"/todos/"+id+"?api_key="+API_KEY+"&username="+USERNAME, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedData)
    })
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
        })
}
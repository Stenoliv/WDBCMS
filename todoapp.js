const TODO_API_URL = "http://128.214.253.222:8355";

let usernameHTML = document.getElementById("username");
let emailHTML = document.getElementById("email");
var API_KEY = localStorage.getItem(ToDo_API_KEY_STORAGE);
var USERNAME = localStorage.getItem(ToDo_API_USERNAME_STORAGE);

var edit_id;
var edit_div;

var newToDoEntry = {
    title: null,
    due_date: null,
    done: null,
    category_id: null
};

if (USERNAME != null) usernameHTML.value = USERNAME;

async function request_new_api() {
    body = {
        username: usernameHTML.value,
        api_key: API_KEY,
        email: emailHTML.value
    }

    await fetch(TODO_API_URL + "/todos/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.hasOwnProperty('api_key')) {
                localStorage.setItem(ToDo_API_KEY_STORAGE, data.api_key);
                localStorage.setItem(ToDo_API_USERNAME_STORAGE, usernameHTML.value);
                API_KEY = data.api_key;
                USERNAME = usernameHTML.value;
            }
        })
        .catch(error => {
            console.log("ERROR: Failed")
        })
}

async function getTodoOptions() {
    try {
        const resp = await fetch(TODO_API_URL + "/todos/categories");
        const respJson = await resp.json();
        for (let i = 0; Object.keys(respJson.result).length > i; i++) {
            document.querySelector("#todocategory").innerHTML += `<option value="${respJson.result[i].id}">${respJson.result[i].category_name}</option>`;
        }
    }
    catch {
        document.querySelector("#newtodo").innerHTML += `<p>Something went wrong while getting categories!</p>`;
    }
}

async function getToDos() {
    try {
        const resp = await fetch(TODO_API_URL + "/todos?api_key=" + API_KEY + "&username=" + USERNAME);
        const respJson = await resp.json();
        if (!Array.isArray(respJson.result)) {
            throw new Error(respJson.result)
        }
        // Add all the todos to the list


        document.querySelector("#toDoList").innerHTML = ""
        respJson.result.forEach(elem => {
            let jaahas = "";
            jaahas += `<div 
            data-todo_id="${elem.id}" 
            data-todo_category="${elem.category_name}" 
            data-todo_done="${elem.done}"
            data-todo_title="${elem.title}"
            data-todo_duedate="${elem.due_date}"
            class="toDoItem"><p class="todo-title">${elem.title}</p><span class="categoryTag ${elem.category_name}">${elem.category_name}</span><p class="todo-due_date"> Due: ${elem.due_date}</p>`
            jaahas += `<div class="edit-todo"><img class="edit-todo-img" src="./wrench-24.png"></div>`
            jaahas += `<div class="tooltip"><span class="tooltiptext `

            if (new Date(elem.due_date) < new Date() && elem.done == false) {
                jaahas += ` taskOverdue">Status: </span><img src="./error-24.png" class="taskOverdue"></img></div>`
            } else if (elem.done == false) {
                jaahas += ` notDoneTask">Status: </span><img src="./warning-4-24.png" class="notDoneTask"></img></div>`
            } else {
                jaahas += ` doneTask">Status: </span><img src="./ok-24.png" class="doneTask"></img></div>`;
            }
            jaahas += `<div class="tooltip"><span class="tooltiptext">Delete</span><img src="./x-mark-4-24.png" class="deleteTask"></div></div>`
            document.querySelector("#toDoList").innerHTML += jaahas
        });
        addToDoButtonFunction()
    }
    catch (error) {
        if (error) document.querySelector("#toDoList").innerHTML = `<h3>${error}</h3>`;
        else document.querySelector("#toDoList").innerHTML = `<h3>Something went wrong!</h3>`;
    }
}

function addToDoButtonFunction() {
    // Button listeners
    document.querySelectorAll(".toDoItem").forEach(div => {

        let doneIMG = div.querySelector("img.notDoneTask");
        let overdueIMG = div.querySelector("img.taskOverdue");
        let deleteIMG = div.querySelector("img.deleteTask");
        let updateIMG = div.querySelector(".edit-todo-img");

        if ((/true/).test(div.dataset.todo_done) == true)
            div.querySelector(".todo-due_date").classList.add("due_date-done");
        try {
            // If not checked query for check done 
            doneIMG.addEventListener('click', btn_notDone)
        }
        catch (error) {
            console.log(error)
        }
        try {
            // If not checked query for check done 
            overdueIMG.addEventListener('click', btn_overdue)
        }
        catch (error) {
            console.log(error)
        }
        // DELETE task
        deleteIMG.addEventListener('click', btn_delete)
        // UPDATE task
        updateIMG.addEventListener("click", btn_update)


        function btn_notDone() {
            console.log("NotDone")
            const data = { done: true }
            edit_div = div
            edit_id = div.dataset.todo_id
            checkDone(div.dataset.todo_id, data)
        }
        function btn_overdue() {
            console.log("NotDone Overdue")
            const data = { done: true }
            edit_div = div
            edit_id = div.dataset.todo_id
            checkDone(div.dataset.todo_id, data)
        }
        function btn_delete() {
            console.log("Delete?")
            if (confirm("You sure you want to delete this task?")) {
                edit_div = div
                edit_id = div.dataset.todo_id
                deleteTask(div.dataset.todo_id)
            }
        }
        function btn_update() {
            console.log("OPEN EDIT BOX")
            edit_id = div.dataset.todo_id
            edit_div = div
            openEditBox()
        }
    })
}

async function checkDone(id, new_data) {
    await fetch(TODO_API_URL + "/todos/" + id + "?api_key=" + API_KEY + "&username=" + USERNAME, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(new_data)
    })
        .then(resp => resp.json())
        .then(data => {
            updateOldDiv(data)
        })
        .catch(error => {
            console.log(error)
        })
}

async function deleteTask(id) {
    await fetch(TODO_API_URL + "/todos/" + id + "?api_key=" + API_KEY + "&username=" + USERNAME, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(data => {
            removeOldDiv(data)
        })
        .catch(error => {
            console.log(error);
        })
}

async function openEditBox() {
    const todoEntry = {
        title: edit_div.dataset.todo_title,
        due_date: edit_div.dataset.todo_duedate,
        done: (/true/).test(edit_div.dataset.todo_done),
        category_name: edit_div.dataset.todo_category
    }
    newToDoEntry.category_id = null;
    newToDoEntry.done = null;
    newToDoEntry.due_date = null;
    newToDoEntry.title = null;

    let title = document.querySelector("#todo_edit_title")
    let category = document.querySelector("#todo_edit_category")
    let duedate = document.querySelector("#todo_edit_duedate")
    let done = document.querySelector("#todo_edit_done")

    category.innerHTML = ""
    await fetch(TODO_API_URL + "/todos/categories")
        .then(resp => resp.json())
        .then(data => {
            let index = 0;
            data.result.forEach(elem => {
                category.innerHTML += `<option value="${elem.id}">${elem.category_name}</option>`
                if (elem.category_name == todoEntry.category_name)
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
    })
    category.addEventListener('change', () => {
        newToDoEntry.category_id = category.value;
    })
    duedate.addEventListener('change', () => {
        newToDoEntry.due_date = duedate.value
    })
    done.addEventListener('change', () => {
        newToDoEntry.done = done.checked
    })
    document.querySelector("#todo_edit_submit").removeEventListener('click', submitChanges)
    document.querySelector("#todo_edit_submit").addEventListener('click', submitChanges)

    document.querySelector(".todo_edit_box").classList.remove("hidden")

    const element = document.querySelector(".todo_edit_container");
    document.querySelector(".todo_edit_box").addEventListener('click', (event) => {
        if (!element.contains(event.target))
            closeEditBox()
    })
}

function closeEditBox() {
    document.querySelector(".todo_edit_box").classList.add("hidden")
}

async function updateToDoTask(id, changedData) {
    await fetch(TODO_API_URL + "/todos/" + id + "?api_key=" + API_KEY + "&username=" + USERNAME, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedData)
    })
        .then(resp => resp.json())
        .then(data => {
            updateOldDiv(data);
        })
        .catch(error => {
            console.log(error)
        })
}

async function newToDoTask() {
    let title;
    let category;
    let newduedate; 
    if(document.querySelector("#newToDotitle").value != ""){
        title = document.querySelector("#newToDotitle").value}
    else{document.querySelector("#addToDo").innerHTML += ("You need to add a title!")
        return}
    
    if(document.querySelector("#todocategory").value != "") {
        category = document.querySelector("#todocategory").value} 
    else{document.querySelector("#addToDo").innerHTML += ("You need to select a category!")
        return}
    
    if (document.querySelector("#todocategory").value != "") {
        newduedate = document.querySelector("#dueDateInput").value}
    else{document.querySelector("#addToDo").innerHTML += ("You need to add a duedate!")
        return}

    newduedate = new Date(newduedate);
    let inputdata = { title: title, category_id: category, due_date: newduedate }
    console.log(inputdata);

    await fetch(TODO_API_URL + "/todos" + "?api_key=" + API_KEY + "&username=" + USERNAME, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputdata)
    })
        .then(resp => resp.json())
        .then(data => {
            addNewDiv(data)
            document.querySelector("#addToDo").innerHTML += data.message
        })
}

function submitChanges() {
    updateToDoTask(edit_id, newToDoEntry)
    closeEditBox()
    return;
}

function updateOldDiv(newData) {
    const category_elem = edit_div.querySelector(".categoryTag");

    edit_div.querySelector(".todo-title").innerHTML = newData.result.title;
    category_elem.classList.remove(category_elem.innerHTML);
    category_elem.classList.add(newData.result.category_name);
    category_elem.innerHTML = newData.result.category_name;
    edit_div.querySelector(".todo-due_date").innerHTML = "Due: " + newData.result.due_date;
    edit_div.querySelector(".todo-due_date").classList.remove("due_date-done")
    edit_div.dataset.todo_id = newData.result.id;
    edit_div.dataset.todo_category = newData.result.category_name;
    edit_div.dataset.todo_done = newData.result.done;
    edit_div.dataset.todo_duedate = newData.result.due_date;
    edit_div.dataset.todo_title = newData.result.title;
    if (newData.result.done) {
        edit_div.querySelector(".todo-due_date").classList.add("due_date-done")
        edit_div.querySelector(".tooltiptext").classList.remove("taskOverdue")
        edit_div.querySelector(".tooltiptext").classList.remove("notDoneTask")
        edit_div.querySelector(".tooltiptext").classList.add("doneTask")
        edit_div.querySelectorAll(".tooltip img").forEach(elem => {
            if (!elem.classList.contains('deleteTask')) {
                elem.classList.remove('taskOverdue')
                elem.classList.remove('notDoneTask')
                elem.classList.add('doneTask')
                elem.src = "./ok-24.png"
            }
        })
    } else {
        const dateNow = new Date();
        const taskDueDate = new Date(newData.result.due_date)
        if (taskDueDate < dateNow) {
            edit_div.querySelector(".tooltiptext").classList.remove("notDoneTask")
            edit_div.querySelector(".tooltiptext").classList.remove("doneTask")
            edit_div.querySelector(".tooltiptext").classList.add("taskOverdue")
            edit_div.querySelectorAll(".tooltip img").forEach(elem => {
                if (!elem.classList.contains('deleteTask')) {
                    elem.classList.remove('doneTask')
                    elem.classList.remove('notDoneTask')
                    elem.classList.add('taskOverdue')
                    elem.src = "./error-24.png"
                }
            })
        } else {
            edit_div.querySelector(".tooltiptext").classList.remove("taskOverdue")
            edit_div.querySelector(".tooltiptext").classList.remove("doneTask")
            edit_div.querySelector(".tooltiptext").classList.add("notDoneTask")
            edit_div.querySelectorAll(".tooltip img").forEach(elem => {
                if (!elem.classList.contains('deleteTask')) {
                    elem.classList.remove('doneTask')
                    elem.classList.remove('taskOverdue')
                    elem.classList.add('notDoneTask')
                    elem.src = "./warning-4-24.png"
                }
            })
        }
    }

}

function removeOldDiv(data) {
    edit_div.remove();
}

function addNewDiv(data) {
    const toDoList = document.querySelector("#toDoList");

    let newDiv = "";
    newDiv += `<div 
            data-todo_id="${data.result.id}" 
            data-todo_category="${data.result.category_name}" 
            data-todo_done="${data.result.done}"
            data-todo_title="${data.result.title}"
            data-todo_duedate="${data.result.due_date}"
            class="toDoItem"><p class="todo-title">${data.result.title}</p><span class="categoryTag ${data.result.category_name}">${data.result.category_name}</span><p class="todo-due_date"> Due: ${data.result.due_date}</p>`
    newDiv += `<div class="edit-todo"><img class="edit-todo-img" src="./wrench-24.png"></div>`
    newDiv += `<div class="tooltip"><span class="tooltiptext `

    if (new Date(data.result.due_date) < new Date() && data.result.done == false) {
        newDiv += ` taskOverdue">Status: </span><img src="./error-24.png" class="taskOverdue"></img></div>`
    } else if (data.result.done == false) {
        newDiv += ` notDoneTask">Status: </span><img src="./warning-4-24.png" class="notDoneTask"></img></div>`
    } else {
        newDiv += ` doneTask">Status: </span><img src="./ok-24.png" class="doneTask"></img></div>`;
    }
    newDiv += `<div class="tooltip"><span class="tooltiptext">Delete</span><img src="./x-mark-4-24.png" class="deleteTask"></div></div>`

    toDoList.innerHTML += newDiv
    addToDoButtonFunction()
}

getTodoOptions()
getToDos();
document.querySelector("#sumbitnewtaskbtn").addEventListener('click', newToDoTask);
/*api_Key = localStorage.getItem(api_key);
user_Name = localStorage.getItem(user_name);
*/
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
        const resp = await fetch("http://128.214.253.222:8438/todos/?api_key="+api_Key+"&"+user_Name);
        const respJson = await resp.json();
        
    }
    catch{

    }
}
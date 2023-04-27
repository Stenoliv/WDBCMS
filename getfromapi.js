async function getboredapi(){
    try {
        const resp = await fetch ("https://www.boredapi.com/api/activity");
        const respJson = await resp.json();
        document.querySelector('#bored').innerHTML += `
        <h2>Are you bored? Here is a random activity</h2><p>${respJson.activity}</p><p>The price is: ${respJson.price}€</p><p>Participants: ${respJson.participants} </p><a>${respJson.link}</a> `;
}catch {
    document.querySelector('#bored').innerHTML = `<p>Error while trying to get activity!</p>`
}
}
getboredapi();


document.querySelector("#searchfordrink").addEventListener("click",e => {getdrinkapi()});
    async function getdrinkapi(){
    try{
        $drink = document.getElementById('drinkname').value;
        const resp = await fetch ("https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+$drink);
        const respJson = await resp.json();

        document.querySelector('#drinkrecepie').innerHTML =`
        <h2>Your drink is here</h2><p>Name: ${respJson.drinks[0].strDrink}</p><p>It belongs in category: ${respJson.drinks[0].strCategory}</p><p>Instructions: ${respJson.drinks[0].strInstructions}</p>`
   
        for(let i = 1; i<=15; i++){
            var list = document.querySelector("#drinkrecepie");
            ingredient = respJson.drinks[0]["strIngredient" + i]
            measurment = respJson.drinks[0]["strMeasure" + i]
            if(ingredient != null && measurment != null)list.innerHTML +=`<p>${ingredient} ${measurment}</p>` 
            else if(ingredient != null)list.innerHTML +=`<p>${ingredient}</p>` 
        }
    }catch{
        document.querySelector('#drinkrecepie').innerHTML =`Error while trying to get drink!`
    }
    }
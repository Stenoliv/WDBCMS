async function getboredapi(){
    //try {
    const resp = await fetch ("https://www.boredapi.com/api/activity");
    const respJson = await resp.json();

        document.querySelector('#bored').innerHTML += `
        <h2>Are you bored? Here is a random activity</h2><p>${respJson.activity}</p><p>The price is: ${respJson.price}€</p><p>Participants: ${respJson.participants} </p><a>${respJson.link}</a> `;
/*}catch {
    document.querySelector('#bored').innerHTML = `Error while trying to get activity!`
}*/
}
getboredapi();

document.querySelector("#searchfordrink").addEventListener("click",e => {getdrinkapi()});
    //try{
    async function getdrinkapi(){
    $drink = document.getElementById('drinkname').value;
    const resp = await fetch ("https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+$drink);
    const respJson = await resp.json();

    document.querySelector('#drinkrecepie').innerHTML =`
    <h2>Your drink is here</h2><p>${respJson.drinks[0].strDrink}</p><p>Instructions: ${respJson.drinks[0].strInstructions}</p>`
    }
    /*}catch{
        document.querySelector('#drinkrecepie').innerHTML =`Error while trying to get drink!`
    }*/


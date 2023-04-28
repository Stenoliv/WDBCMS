let currencyInfo;
async function loadJSON() {
await fetch('currency-info.json')
    .then(response => response.json())
    .then(data => {
        currencyInfo = data;
        getCurrencys();
    })
    .catch(error => {
        console.log(error)
    })
}
loadJSON()
const API_URL = "https://open.er-api.com/v6";
const API_LATEST_DATA = "currency-latest-fetch";

const select1 = document.querySelector("#currency-calc-from");
const select2 = document.querySelector("#currency-calc-to");
const output = document.querySelector("#currency-calc-output");
const currencyInput = document.querySelector("#currency-calc-value");

let rates = {};
let LATEST_DATA = "";

async function getCurrencys() {
    if (!localStorage.getItem(API_LATEST_DATA)) {
        LATEST_DATA = {from:'USD',to:'EUR'}
        localStorage.setItem(API_LATEST_DATA, JSON.stringify(LATEST_DATA));
    } else {
        LATEST_DATA = JSON.parse(localStorage.getItem(API_LATEST_DATA));
    }
    await fetch(API_URL + "/latest/" + LATEST_DATA.from)
        .then(request => request.json())
        .then(resp => {
            select1.innerHTML = "";
            select2.innerHTML = "";
            if (resp.result == "success") {
                rates = resp.rates;
        
                for (let rate in rates) {
                    const currencyName = currencyInfo[rate].currency_name;
                    const country = currencyInfo[rate].country;
                    select1.innerHTML += `
                <option value="${rate}">${rate} | Name: ${currencyName} | Country: ${country}</option>
                `
                    select2.innerHTML += `
                <option value="${rate}">${rate} | Name: ${currencyName} | Country: ${country}</option>
                `
                }
                select1.value = LATEST_DATA.from;
                select2.value = LATEST_DATA.to;
        
                const exchangedValue = currencyInput.value * rates[select2.value];
        
                output.innerHTML = exchangedValue.toString() + " " + select2.value;
            } else {
                localStorage.removeItem(API_LATEST_DATA);
        
                output.innerHTML = "Failed to load try refresh!"
            }
        })
        .catch(error => {
            console.log(error)
            output.innerHTML = "I might be offline"
        })
}

async function updateFromCurrency() {
    console.log("updateFromCurrency()")

    LATEST_DATA.from = select1.value;
    LATEST_DATA.to = select2.value;

    localStorage.setItem(API_LATEST_DATA, JSON.stringify(LATEST_DATA));
    getCurrencys();
}

async function updateExchange() {
    const exchangedValue = currencyInput.value * rates[select2.value];

    LATEST_DATA.from = select1.value;
    LATEST_DATA.to = select2.value;

    localStorage.setItem(API_LATEST_DATA, JSON.stringify(LATEST_DATA));

    output.innerHTML = exchangedValue.toString() + " " + select2.value;
}
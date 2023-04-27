let currencyInfo;
async function loadJSON() {
await fetch('currency-info.json')
    .then(response => response.json())
    .then(data => {
        currencyInfo = data;
        console.log(data)
    })
    getCurrencys();
}
loadJSON()
const API_URL = "https://open.er-api.com/v6";
const API_LATEST_DATA = "currency-latest-fetch";

const select1 = document.querySelector("#currency-calc-from");
const select2 = document.querySelector("#currency-calc-to");
const output = document.querySelector("#currency-calc-output");
const input = document.querySelector("#currency-calc-value");

let rates = {};
let LATEST_DATA = "";

async function getCurrencys() {
    console.log("getCurrencys()")

    if (!localStorage.getItem(API_LATEST_DATA)) {
        LATEST_DATA = `{
            "from":"USD",
            "to":"EUR"
        }`
        localStorage.setItem(API_LATEST_DATA, LATEST_DATA);
    } else {
        LATEST_DATA = JSON.parse(localStorage.getItem(API_LATEST_DATA));
    }
    console.log(LATEST_DATA);

    const request = await fetch(API_URL + "/latest/" + LATEST_DATA.from);
    const resp = await request.json();

    console.log(resp.rates);
    rates = resp.rates;

    select1.innerHTML = "";
    select2.innerHTML = "";
    if (resp.result == "success") {
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
    } else {
        localStorage.removeItem(API_LATEST_DATA);
    }
    const exchangedValue = input.value * rates[select2.value];
        console.log(exchangedValue);

        output.innerHTML = exchangedValue.toString() + " " + select2.value;
}

async function updateFromCurrency() {
    console.log("updateFromCurrency()")

    LATEST_DATA.from = select1.value;
    LATEST_DATA.to = select2.value;

    localStorage.setItem(API_LATEST_DATA, JSON.stringify(LATEST_DATA));
    getCurrencys();
}

async function updateExchange() {
    const exchangedValue = input.value * rates[select2.value];
    console.log(exchangedValue);

    LATEST_DATA.from = select1.value;
    LATEST_DATA.to = select2.value;

    localStorage.setItem(API_LATEST_DATA, JSON.stringify(LATEST_DATA));

    output.innerHTML = exchangedValue.toString() + " " + select2.value;
}
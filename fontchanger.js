const SAVED_SELECTED_FONT = "font-family";
const SAVED_SIZE_FONT = "font-size";
var page = document.querySelector(':root');
var selectedFontFamily = "";
var selectedFontSize = "12px";
const selector = document.querySelector("#page-font");
const input = document.querySelector("#font-size");

if(!localStorage.getItem(SAVED_SELECTED_FONT)) {
    localStorage.setItem(SAVED_SELECTED_FONT, "Sigmar");
    selectedFontFamily = localStorage.getItem(SAVED_SELECTED_FONT);
} else {
    selectedFontFamily = localStorage.getItem(SAVED_SELECTED_FONT);
}
setfontfamily(selectedFontFamily);
selector.value = selectedFontFamily;

if(!localStorage.getItem(SAVED_SIZE_FONT)) {
    localStorage.setItem(SAVED_SIZE_FONT, "12px");
    selectedFontSize = localStorage.getItem(SAVED_SIZE_FONT);
} else selectedFontSize = localStorage.getItem(SAVED_SIZE_FONT);
setfontsize(selectedFontSize);
input.value = selectedFontSize;

function setfontsize(value) {
    page.style.setProperty('--font-size', value)
}

function setfontfamily(value) {
    page.style.setProperty('--font-family', value);
}
selector.addEventListener('change',(event) => {
    selectedFontFamily = selector.value;
    console.log(selectedFontFamily)
    setfontfamily(selectedFontFamily)
    localStorage.setItem(SAVED_SELECTED_FONT, selectedFontFamily)
})
input.addEventListener('input', (event) => {
    selectedFontSize = input.value+"px";
    console.log(selectedFontSize);
    setfontsize(selectedFontSize);
    localStorage.setItem(SAVED_SIZE_FONT, selectedFontSize);
})
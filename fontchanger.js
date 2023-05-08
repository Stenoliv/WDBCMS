const SAVED_SELECTED_FONT = "font-family";
const SAVED_SIZE_FONT = "font-size";
var page = document.querySelector(':root');
var selectedFontFamily = "";
var selectedFontSize = "12px";
const min = 12;
const max = 24;
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

function setfontsize(value) {
    page.style.setProperty('--font-size', value)
    const selectedFont = parseInt(selectedFontSize)
    input.value = selectedFont;
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
input.addEventListener('change', (event) => {
    if(input.value < min) {
        selectedFontSize = `${input.min}px`;
    } else if (input.value > max) {
        selectedFontSize = `${input.max}px`;
    } else selectedFontSize = `${input.value}px`;
    console.log(selectedFontSize);
    setfontsize(selectedFontSize);
    localStorage.setItem(SAVED_SIZE_FONT, selectedFontSize);
})
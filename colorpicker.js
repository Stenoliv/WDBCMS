
document.body.style.backgroundColor = localStorage.getItem("background");
document.querySelector("#red").value = localStorage.getItem("red");
document.querySelector("#green").value = localStorage.getItem("green");
document.querySelector("#blue").value = localStorage.getItem("blue");

function bgcolor() {
    let r = document.querySelector('#red').value;
    let g = document.querySelector('#green').value;
    let b = document.querySelector('#blue').value;
    let rgb = 'rgb(' + r + ',' + g + ',' + b + ')';

    document.body.style.backgroundColor = rgb;

    localStorage.setItem("background", rgb);
    localStorage.setItem("red", r);
    localStorage.setItem("green", g);
    localStorage.setItem("blue", b);
}

document.getElementById('red').addEventListener('input', bgcolor);
document.getElementById('green').addEventListener('input', bgcolor);
document.getElementById('blue').addEventListener('input', bgcolor);
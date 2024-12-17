var inputBox = document.querySelector('input[type="text"]#preview');
var displays = document.querySelectorAll('.body .font-card .display');
var toggles = document.querySelectorAll('.body .font-card .toggle input[type="checkbox"]');

inputBox.addEventListener('keydown', (e) => {
    displays.forEach(elm => {
        elm.innerText = inputBox.value;
    });
});


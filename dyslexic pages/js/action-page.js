fetchFonts().then((fontData) => {
    const defaultText = "AaBbCcDdEeFfGg";
    const fontCardTemp = document.querySelector('template#font-card');
    const dBody = document.querySelector('.body');
    const inputBox = document.querySelector('input[type="text"]#preview');
    const defaultFont = getCurrentFont();

    defaultFont.then((dFont) => {
        if (typeof dFont == 'undefined') {
            dFont = fontData['supported-fonts'][0];
        }
        setCurrentFont(dFont);

        fontData['supported-fonts'].forEach((font, index) => {
            let cpy = fontCardTemp.content.cloneNode(true);
    
            cpy.querySelector('.font-card').style.setProperty('font-family', font['name'], 'important');
            cpy.querySelector('.name').innerText = font['name'];
            cpy.querySelector('.author').href = font['author']['link'];
            cpy.querySelector('.author').innerText = font['author']['name'];
            cpy.querySelector('.display').innerText = defaultText;
            cpy.querySelector('.toggle input[type="radio"]').checked = (font['name'] == dFont['name']);
            
            cpy.querySelector('.toggle input[type="radio"]').addEventListener('change', (e) => {
                if (e.currentTarget.checked) {
                    setCurrentFont(font);
                }
            });
    
            dBody.appendChild(cpy);
        });

        const displays = dBody.querySelectorAll('.font-card .display');
        const checkBoxes = dBody.querySelectorAll('.font-card .toggle input[type="radio"]');

        inputBox.addEventListener('keyup', (e) => {
            displays.forEach((elm) => {
                elm.innerText = inputBox.value || defaultText;
            });
        });
    });
});

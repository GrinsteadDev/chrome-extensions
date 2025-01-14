document.querySelector('img#options-page').addEventListener(
    'click',
    (e) => {
        if ('openOptionsPage' in chrome.runtime)
        {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURl('/html/options-page.html'));
        }
    }
);

(async () => {
    const fontData = await fetchFonts();
    const fontCardTemp = await fetchTemplate('font-card');
    let defaultFont = await getCurrentFont();

    const defaultText = "AaBbCcDdEeFfGg";
    const dBody = document.querySelector('.body');
    const inputBox = document.querySelector('input[type="text"]#preview');

    if (typeof defaultFont == 'undefined') {
        defaultFont = fontData['supported-fonts'][0];
    }
    setCurrentFont(defaultFont);

    fontData['supported-fonts'].forEach((font, index) => {
        let cpy = fontCardTemp.content.cloneNode(true);

        cpy.querySelector('.display').style.setProperty('font-family', font['name'], 'important');
        cpy.querySelector('.name').innerText = font['name'];
        cpy.querySelector('.author').href = font['author']['link'];
        cpy.querySelector('.author').innerText = font['author']['name'];
        cpy.querySelector('.display').innerText = defaultText;
        cpy.querySelector('.toggle input[type="radio"]').checked = (font['name'] == defaultFont['name']);
        
        cpy.querySelector('.toggle input[type="radio"]').addEventListener('change', (e) => {
            if (e.currentTarget.checked) {
                setCurrentFont(font);
            }
        });

        dBody.appendChild(cpy);
    });

    const displays = dBody.querySelectorAll('.font-card .display');

    inputBox.addEventListener('keyup', (e) => {
        displays.forEach((elm) => {
            elm.innerText = inputBox.value || defaultText;
        });
    });
})();

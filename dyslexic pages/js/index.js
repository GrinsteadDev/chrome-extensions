function getCurrentFont() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(
            ['current-font'],
            (result) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    resolve(result['current-font']);
                }
            }
        );
    });
}

function setCurrentFont(font) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(
            {'current-font': font},
            () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    reject(chrome.runtime.lastError.message);
                } else {
                    document.querySelector(':root').style.setProperty('--current-font', font['name']);

                    resolve(font);
                }
            }
        );
    });
}

window.DyslexicPages.fonts.then((fontData) => {
    const defaultText = "AaBbCcDdEeFfGg";
    let inCheckEvent = false;
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
            cpy.querySelector('.toggle input[type="checkbox"]').checked = (font['name'] == dFont['name']);
            
            cpy.querySelector('.toggle input[type="checkbox"]').addEventListener('change', (e) => {
                if (!inCheckEvent) {
                    inCheckEvent = true;

                    let elms = dBody.querySelectorAll('.font-card .toggle input[type="checkbox"]:checked')
                    elms.forEach((elm) => {
                        if (e.currentTarget !== elm) {
                            elm.checked = false;
                        }
                    });
                    if (!e.currentTarget.checked && elms.length > 0) {
                        elms[0].checked = true;
                    }

                    inCheckEvent = false;
                }
                if (e.currentTarget.checked) {
                    setCurrentFont(font);
                }
            });
    
            dBody.appendChild(cpy);
        });

        const displays = dBody.querySelectorAll('.font-card .display');
        const checkBoxes = dBody.querySelectorAll('.font-card .toggle input[type="checkbox"]');

        inputBox.addEventListener('keyup', (e) => {
            displays.forEach((elm) => {
                elm.innerText = inputBox.value || defaultText;
            });
        });
    });
});




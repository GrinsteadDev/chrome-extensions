(async () => {
    // Setups up fonts
    await fetchFonts();

    const cFont = (await getCurrentFont()) || Object.values(window.DyslexicPages.fonts.appFonts)[0];
    
    await setCurrentFont(cFont);

    // Adds menu events
    const menuOptions = document.querySelectorAll('.menu .menu-option input[type="radio"]');
    const menuPages = document.querySelectorAll('.menu-page');

    menuOptions.forEach(
        (elem, index) => {
            elem.addEventListener(
                'change',
                (e) => {
                    menuPages.forEach((page, idx) => {
                        if (idx != index) {
                            page.style.display = 'none';
                        }
                    });
                    if (index in menuPages && elem.checked)
                    {
                        menuPages[index].style.display = 'block';
                    }
                }
            );
        }
    );

    menuOptions[0].checked = true;
    menuOptions[0].dispatchEvent(new Event('change'));

    // Adds fonts menu events
    const fontTile = await fetchTemplate('font-tile');
    const appFonts = document.querySelector('#app-fonts');
    const defaultText = 'AbBbCcDdEeFfGg';

    Object.values(window.DyslexicPages.fonts.appFonts).forEach((font, index) => {
        let cpy = fontTile.content.cloneNode(true);
        let fTile = cpy.querySelector('.font-tile');
        let fName = cpy.querySelector('.name');
        let fAuthor = cpy.querySelector('.author');
        let fDisplay = cpy.querySelector('.display');
        let fButton = cpy.querySelector('.toggle input[type="radio"]')
        
        fTile.style.setProperty('font-family', font['name'], 'important');
        fName.innerText = font['name'];
        fAuthor.href = font['author']['link'];
        fAuthor.innerText = font['author']['name'];
        fDisplay.innerText = defaultText;        
        fButton.checked = (font['name'] == cFont['name']);
        fButton.addEventListener('change', (e) => {
            if (e.currentTarget.checked) {
                setCurrentFont(font);
            }
        });

        appFonts.appendChild(cpy);

        let fMetric = getFontMetric(font, window.getComputedStyle(fDisplay).fontSize);
        
        console.log(fMetric);

        fDisplay.style.background = 
            'linear-gradient(' + 
                'transparent, ' +
                'transparent ' + (fMetric.em - (fMetric.capital.ascent + fMetric.baseline)) + 'px, ' +
                'white ' + (fMetric.em - (fMetric.capital.ascent + fMetric.baseline)) + 'px, ' +
                'white ' + ((fMetric.em - (fMetric.capital.ascent + fMetric.baseline)) + 1.5) + 'px, ' +
                'transparent ' + ((fMetric.em - (fMetric.capital.ascent + fMetric.baseline)) + 1.5) + 'px, ' +
                'transparent' +
            '), \n' +
            'linear-gradient(' + 
                'transparent, ' +
                'transparent ' + (fMetric.em - fMetric.lower.ascent) + 'px, ' +
                'white ' + (fMetric.em - fMetric.lower.ascent) + 'px, ' +
                'white ' + ((fMetric.em - fMetric.lower.ascent) + 0.5) + 'px, ' +
                'transparent ' + ((fMetric.em - fMetric.lower.ascent) + 0.5) + 'px, ' +
                'transparent' +
            '), \n' +
            'linear-gradient(' + 
                'transparent, ' +
                'transparent ' + fMetric.baseline + 'px, ' +
                'white ' + fMetric.baseline + 'px, ' +
                'white ' + (fMetric.baseline + 0.5) + 'px, ' +
                'transparent ' + (fMetric.baseline + 0.5) + 'px, ' +
                'transparent' +
            '), \n' +
            'linear-gradient(' + 
                'transparent, ' +
                'transparent ' + (fMetric.baseline + fMetric.capital.descent) + 'px, ' +
                'white ' + (fMetric.baseline + fMetric.capital.descent) + 'px, ' +
                'white ' + ((fMetric.baseline + fMetric.capital.descent) + 1.5) + 'px, ' +
                'transparent ' + ((fMetric.baseline + fMetric.capital.descent) + 1.5) + 'px, ' +
                'transparent' +
            ')';
    });
})();
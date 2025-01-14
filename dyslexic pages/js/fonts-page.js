(async () => {
    const cFont = (await getCurrentFont()) || Object.values(window.DyslexicPages.fonts.appFonts)[0];
    const fontsPage = document.querySelector('#fonts-page');

    // Function to add fonts
    function AddFont(font, fontTile, container, defaultText)
    {
        let cpy = fontTile.content.cloneNode(true);
        let fTile = cpy.querySelector('.font-tile');
        let fName = cpy.querySelector('.name');
        let fAuthor = cpy.querySelector('.author');
        let fDisplay = cpy.querySelector('.display');
        let fButton = cpy.querySelector('.toggle input[type="radio"]')
        
        fDisplay.style.setProperty('font-family', font['name'], 'important');
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

        container.appendChild(cpy);
    }

    // Adds fonts menu events
    const fontTile = await fetchTemplate('font-tile');
    const appFonts = fontsPage.querySelector('#app-fonts');
    const defaultText = 'AbBbCcDdEeFfGg';

    // App fonts
    Object.values(window.DyslexicPages.fonts.appFonts).forEach((font, index) => {
        AddFont(font, fontTile, appFonts, defaultText);
    });

    const loadSysFonts = fontsPage.querySelector('#load-sys-fonts');
    const sysFonts = fontsPage.querySelector('#sys-fonts');
    const loadSysFontsAnimation = fontsPage.querySelector('#loading-sys-fonts-icon');

    // Sys fonts
    loadSysFonts.addEventListener('click', (e)=>{
        loadSysFontsAnimation.style.setProperty('display', 'inline', 'important');
        loadSysFonts.style.setProperty('display', 'none', 'important');

        // Allows the DOM to update
        window.setTimeout(()=> {
            fetchSystemFonts().then((fonts)=>{
                fonts.forEach((font, index) => {
                    AddFont(font, fontTile, sysFonts, defaultText);
                });
    
                loadSysFontsAnimation.style.setProperty('display', 'none', 'important');
            });
        }, 500);
    });

    const displayGrid = fontsPage.querySelector('#tile-option-grid');
    const displayRow = fontsPage.querySelector('#tile-option-row');

    displayGrid.addEventListener("change", ()=>{
        if (displayGrid.checked) {
            fontsPage.style.setProperty('--grid-column-count', 3);
        }
    });
    displayRow.addEventListener("change", ()=>{
        if (displayRow.checked) {
            fontsPage.style.setProperty('--grid-column-count', 1);
        }
    });
})();

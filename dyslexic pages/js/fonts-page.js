(async () => {
    const cFont = (await getCurrentFont()) || Object.values(window.DyslexicPages.fonts.appFonts)[0];
    const fontsPage = document.querySelector('#fonts-page');

    // Function to add fonts
    function AddFont(font, fontTile, container, defaultText)
    {
        let cpy = fontTile.content.cloneNode(true);
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

let fontSizeCombo = document.querySelector('#font-size-select');
let fontSizeOptions = document.querySelectorAll('#font-size-select option');
let fontSizeSlider = document.querySelector('#font-size-slider');
let customSizeCombo = document.createElement('div');
let customSizeComboDisplay = document.createElement('span');
let customSizeComboDisplayArrow = document.createElement('span');
let customSizeComboOptions = document.createElement('div');

fontSizeCombo.parentElement.appendChild(customSizeCombo);

customSizeCombo.appendChild(customSizeComboDisplay);
customSizeCombo.appendChild(customSizeComboDisplayArrow);
customSizeCombo.appendChild(customSizeComboOptions);
customSizeCombo.setAttribute('tabindex', '0');
customSizeCombo.style.setProperty('width', '100%');
customSizeCombo.style.setProperty('padding-bottom', '5px');
customSizeCombo.style.setProperty('overflow-y', 'visible');
customSizeCombo.style.setProperty('position', 'relative');
customSizeCombo.style.setProperty('cursor', 'pointer');
customSizeCombo.style.setProperty('background-color', 'inherit');

customSizeComboDisplay.innerText = "\u00A0";
customSizeComboDisplay.classList.add('focus');
customSizeComboDisplay.style.setProperty('border-radius', '15px');
customSizeComboDisplay.style.setProperty('display', 'inline-block');

customSizeComboDisplayArrow.style.setProperty('display', 'inline-block');
customSizeComboDisplayArrow.style.setProperty('margin-left', '5px');
customSizeComboDisplayArrow.style.setProperty('border-left', '7px solid transparent');
customSizeComboDisplayArrow.style.setProperty('border-right', '7px solid transparent');
customSizeComboDisplayArrow.style.setProperty('border-top', '13px solid var(--font-color)');

customSizeComboOptions.style.setProperty('display', 'none');
customSizeComboOptions.style.setProperty('overflow-y', 'scroll');
customSizeComboOptions.style.setProperty('height', '25vh');
customSizeComboOptions.style.setProperty('position', 'absolute');
customSizeComboOptions.style.setProperty('top', '100%');
customSizeComboOptions.style.setProperty('left', '0');
customSizeComboOptions.style.setProperty('background-color', 'inherit');
customSizeComboOptions.style.setProperty('border-radius', 'inherit');
customSizeComboOptions.style.setProperty('border-top-left-radius', '0');
customSizeComboOptions.style.setProperty('border-top-right-radius', '0');
customSizeComboOptions.classList.add('custom-scroll-bar');

fontSizeCombo.addEventListener('change', ()=>{
    fontSizeSlider.value = parseInt(fontSizeCombo.value);

});
fontSizeSlider.addEventListener('change', ()=>{
    fontSizeCombo.options[0].innerText = fontSizeSlider.value + 'px';
    fontSizeCombo.selectedIndex = 0;
    customSizeComboDisplay.innerText = fontSizeSlider.value + 'px';
});
fontSizeOptions.forEach((obj, idx)=>{
    let opt = document.createElement('span');

    opt.innerText = obj.innerText;
    opt.classList.add('focus');
    opt.setAttribute('tabindex', '0');
    opt.style.setProperty('border-radius', '15px');
    opt.style.setProperty('margin', '3px 1.5px 3px 1.5px');
if (idx == 0)
    {
        opt.style.setProperty('display', 'none');
    } else {
        opt.style.setProperty('display', 'block');
        opt.addEventListener('click', ()=>{
            fontSizeCombo.selectedIndex = idx;
            customSizeComboDisplay.innerText = opt.innerText;
            fontSizeCombo.dispatchEvent(new Event('change'));
        });
    }
    if (idx == fontSizeCombo.selectedIndex)
    {
        customSizeComboDisplay.innerText = opt.innerText;
    }

    customSizeComboOptions.appendChild(opt);
});
customSizeCombo.addEventListener('click', ()=>{
    if (customSizeComboOptions.style.getPropertyValue('display') == 'none')
    {
        customSizeComboOptions.style.setProperty('display', 'block');
        customSizeComboDisplayArrow.style.setProperty('border-bottom', '13px solid var(--font-color)');
        customSizeComboDisplayArrow.style.removeProperty('border-top');
    } else {
        customSizeComboOptions.style.setProperty('display', 'none');
        customSizeComboDisplayArrow.style.setProperty('border-top', '13px solid var(--font-color)');
        customSizeComboDisplayArrow.style.removeProperty('border-bottom');
    }
});
customSizeCombo.addEventListener('focusout', (e)=>{
    if (!customSizeCombo.contains(e.relatedTarget))
    {
        customSizeComboOptions.style.setProperty('display', 'none');
        customSizeComboDisplayArrow.style.setProperty('border-top', '13px solid var(--font-color)');
        customSizeComboDisplayArrow.style.removeProperty('border-bottom');
    }
});
customSizeCombo.addEventListener('keyup', (e)=>{
    if (e.key == 'Enter')
    {
        customSizeCombo.dispatchEvent(new Event('click'));
    }
});

let fontPreview = document.querySelector('#fonts-page #font-preview');

fontPreview.addEventListener('keyup', (e)=>{
    let elements = document.querySelectorAll('#fonts-page .font-tile > .display');
    
    elements.forEach((obj, idx)=>{
        if (fontPreview.value.trim() != '')
        {
            if (fontPreview.value.trim().length > 500)
                fontPreview.value = fontPreview.value.trim().substring(0, 499);
    
            obj.innerText = fontPreview.value.trim();
        } else {
            obj.innerText = 'AbBbCcDdEeFfGg';
        }
    });
});
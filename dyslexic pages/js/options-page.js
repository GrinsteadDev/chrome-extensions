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
            elem.addEventListener('change', (e) => {
                menuPages.forEach((page, idx) => {
                    if (idx != index) {
                        page.style.display = 'none';
                    }
                });
                if (index in menuPages && elem.checked)
                {
                    menuPages[index].style.display = 'block';
                }
            });
        }
    );

    menuOptions[0].checked = true;
    menuOptions[0].dispatchEvent(new Event('change'));
})();
async function fetchFonts()
{
    const url = chrome.runtime.getURL('/fonts/fonts.json');
    const req = await fetch(url);
    const data = await req.json();
    
    data['font-faces'].forEach((fontInfo, index) => {
        loadFont(fontInfo);
    });
    data['supported-fonts'].forEach((fontInfo, index) => {
        if (!(fontInfo['name'] in window.DyslexicPages.fonts.appFonts))
        {
            window.DyslexicPages.fonts.appFonts[fontInfo['name']] = fontInfo;
        }
    });
    
    return data;
}
function loadFont(fontInfo)
{
    var src = [];

    fontInfo['src'].forEach((srcInfo, index) => {
        src.push('url(' + srcInfo['url'] + ')');
        if ("format" in srcInfo)
        {
            src.push(' format("' + srcInfo['format'] + '")');
        }
        src.push(',');
    });

    const fontFace = new FontFace(
        fontInfo['font-family'],
        'local("' + fontInfo['font-family'] + '"), ' + src.join(''),
        {
            style: fontInfo['style'],
            weight: fontInfo['weight']
        }
    );

    return fontFace.load().then(f => {
        document.fonts.add(f);

        return f;
    });
}

function fetchSystemFonts()
{
    return chrome.fontSettings.getFontList().then((data) => {
        let fonts = [];

        data.forEach((font) => {
            let fontInfo = {
                name: font.displayName,
                author: {
                    name: '',
                    link: ''
                }
            };

            fonts.push(fontInfo);

            if (!(fontInfo.name in window.DyslexicPages.fonts.sysFonts))
            {
                window.DyslexicPages.fonts.sysFonts[fontInfo.name] = fontInfo;
            }
        });

        return fonts;
    });
}

function getCurrentFont()
{
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

function setCurrentFont(font)
{
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

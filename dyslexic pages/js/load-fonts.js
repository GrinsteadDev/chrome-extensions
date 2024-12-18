async function fetchFonts()
{
    const url = chrome.runtime.getURL('/fonts/fonts.json');
    const req = await fetch(url);
    const data = await req.json();

    console.log(data);

    data['font-faces'].forEach((fontInfo, index) => {
        loadFont(fontInfo);
    });

    return data;
}
async function loadFont(fontInfo)
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

if (!("DyslexicPages" in window))
{
    window.DyslexicPages = {};
}

window.DyslexicPages.fonts = fetchFonts();
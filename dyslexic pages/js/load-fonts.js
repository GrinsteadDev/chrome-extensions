async function fetchFonts()
{
    const req = await fetch('/fonts/fonts.json');
    const data = await req.json();

    console.log(data);

    data['fonts'].forEach((fontInfo, index) => {
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

fetchFonts();
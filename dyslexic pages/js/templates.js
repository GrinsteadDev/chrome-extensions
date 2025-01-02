async function fetchTemplate(name)
{
    name = name || '';

    if (
        (!(name in window.DyslexicPages.templates) || name.length == 0) &&
        document.querySelector('div#templates') == null
    ) {
        const url = chrome.runtime.getURL('/html/templates.html');
        const req = await fetch(url);

        if (!req.ok) {
            throw(req.statusText);
        }

        const htmlTxt = await req.text();
        const div = document.createElement('div');

        div.id = 'templates';
        div.style.display = 'none';

        div.innerHTML = htmlTxt;
        document.body.appendChild(div);

        div.querySelectorAll('template').forEach((elm) => {
            if (!(elm.id in window.DyslexicPages.templates))
            {
                window.DyslexicPages.templates[elm.id] = elm;
            }
        });
    }

    if (name in window.DyslexicPages.templates) {
        return window.DyslexicPages.templates[name];
    } else if (name.length == 0) {
        return null;
    } else {
        throw(`${name} is not a valid template!`);
    }
}
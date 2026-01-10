function createFloatingButton() {
    if (document.getElementById('sombox-floating-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'sombox-floating-btn';
    btn.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #6a0dad;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        cursor: pointer;
        z-index: 1000000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: transform 0.2s;
    `;
    btn.innerText = '📦';
    btn.title = 'Start SomBox Scan';

    btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1.0)';

    btn.onclick = () => runSomBoxLogic();

    document.body.appendChild(btn);
}

function runSomBoxLogic() {
    const tabs = Array.from(document.querySelectorAll('sl-tab-item'));
    const cijferTab = tabs.find(tab => tab.innerText.includes('Cijfers'));

    if (!cijferTab) {
        alert("Ga eerst naar de hoofdpagina van Somtoday!");
        return;
    }

    const blocker = document.createElement('div');
    blocker.id = "sombox-blocker";
    blocker.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00f2ff;font-family:sans-serif;gap:20px;text-align:center;";
    blocker.innerHTML = `
        <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTZqdWV0N2thcXpzOG5xMmxsZjEzYmRrMW42ZWU3amlueGZ1cnltdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/um2kBnfo55iW4ZH1Fa/giphy.gif" 
             style="width:200px;border-radius:15px;box-shadow: 0 0 20px #00f2ff;">
        <h1 id="sombox-status">SomBox Scant...</h1>
    `;
    document.body.appendChild(blocker);

    cijferTab.click();

    setTimeout(() => {
        const items = document.querySelectorAll('sl-laatste-resultaat-item');
        let res = [];
        items.forEach(item => {
            const info = item.querySelector('div[role="text"]');
            if (info) {
                const label = info.getAttribute('aria-label');
                const d = label.split(',');
                const vak = d[0] ? d[0].trim() : "";
                const cijfer = (d[1] && d[2]) ? (d[1].trim() + "," + d[2].trim()) : "";
                let datumRaw = d[3] ? d[3].trim() : "";
                let datumSchoon = datumRaw.split(/[•\u2022]|\s{2,}/)[0].trim();
                if (datumSchoon.length > 12) datumSchoon = datumSchoon.substring(0, 12).trim();

                res.push({ v: vak, c: cijfer, d: datumSchoon });
            }
        });

        if (res.length > 0) {
            const code = btoa(unescape(encodeURIComponent(JSON.stringify(res))));
            
            // AUTOMATISCH KOPIËREN
            navigator.clipboard.writeText(code).then(() => {
                document.getElementById('sombox-status').innerText = "GEKOPIEERD! 🚀";
                document.getElementById('sombox-status').style.color = "#75ff75";
                
                // Even wachten zodat je de bevestiging ziet, dan terug
                setTimeout(() => {
                    window.location.href = '/rooster';
                }, 1000);
            }).catch(err => {
                // Fallback voor als het kopiëren mislukt
                window.prompt("Kopiëren mislukt, doe het handmatig:", code);
                window.location.href = '/rooster';
            });

        } else {
            alert("Geen cijfers gevonden.");
            location.reload();
        }
    }, 1000);
}

setInterval(createFloatingButton, 1000);
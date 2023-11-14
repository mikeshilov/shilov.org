let config = {};

function saveConfig () {
    fetch('savecfg.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })
        .then(response => response.json())
        .then(response => {
            if (!response.success) {
                alert("Saving configuration error ((");
            }
        })
}

function loadConfig (callback) {
    const xhr = new XMLHttpRequest();
    xhr.ontimeout = () => alert ("The configuration request timed out.");
    xhr.onload = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                config = JSON.parse(xhr.responseText);
                callback();
            } else {
                console.warn ('Loading config error: ' + xhr.statusText);
                config = {}
                callback();
            }
        }
    };
    xhr.open("GET", "cfg.json", true);
    xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    xhr.setRequestHeader('Expires', 'Thu, 1 Jan 1970 00:00:00 GMT');
    xhr.setRequestHeader('Pragma', 'no-cache');
    xhr.timeout = 2000;
    xhr.send(null);
}

function incSentUsage (storyId, sentId) {
    if (!('sentUsage' in config)) {
        config.sentUsage = {};
    }
    if (!(storyId in config.sentUsage)) {
        config.sentUsage[storyId] = {};
    }
    config.sentUsage[storyId][sentId] = sentId in config.sentUsage[storyId] ? config.sentUsage[storyId][sentId] + 1 : 1;
    saveConfig();
}

function getSentUsage (storyId, sentId) {
    return config.sentUsage && (storyId in config.sentUsage) && (sentId in config.sentUsage[storyId]) ? config.sentUsage[storyId][sentId] : 0;
}

function getSentImportanceCoords (sentIdsList) {
    const sentCoords = {};
    let coord = 0;
    sentIdsList.forEach(sentIds => {
        const ids = sentIds.split('-')
        const usage = getSentUsage(ids[0], ids[1]);
        coord += usage ? Math.round(1024 / Math.pow(2, usage)) : 1024;
        sentCoords[sentIds] = coord;
    });
    return sentCoords;
}

function chooseSentence (sentIdsList) {
    const sentCoords = getSentImportanceCoords(sentIdsList);
    const coords = Object.values(sentCoords).map (x => parseInt(x.toString()));
    const point = rnd(Math.max(...coords));
    for (let i=0;i<coords.length;i++) {
        if (coords[i]>=point) {
            return sentIdsList[i].split('-');
        }
    }
    return sentIdsList[coords.length-1].split('-');
}
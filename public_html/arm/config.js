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
                alert ('Loading config error: ' + xhr.statusText);
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

function increaseWordKnowing (word) {
    word = word.toLowerCase();
    if (!('wordKnowing' in config)) {
        config.wordKnowing = {};
    }
    config.wordKnowing[word] = word in config.wordKnowing ? config.wordKnowing[word] + 1 : 1;
    saveConfig();
}

function getWordKnowing (word) {
    word = word.toLowerCase();
    return config.wordKnowing && (word in config.wordKnowing) ? config.wordKnowing[word] : 0;
}

function getWordImportanceCoords (words) {
    const wordCoords = {};
    let coord = 0;
    words.forEach(word => {
        const knowing = getWordKnowing(word);
        coord += knowing ? Math.round(1024 / Math.pow(2, knowing)) : 1024;
        wordCoords[word] = coord;
    });
    return wordCoords;
}

function chooseWordIndex (words) {
    const wordCoords = getWordImportanceCoords(words);
    const coords = Object.values(wordCoords).map (x => parseInt(x.toString()));
    const point = rnd(Math.max(...coords));
    for (let i=0;i<coords.length;i++) {
        if (coords[i]>=point) {
            return [i, coords];
        }
    }
    return [coords.length-1, coords];
}
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

function getWordImportanceCoords (words) {
    const wordCoords = {};
    let coord = 0;
    words.forEach(word => {
        word = word.toLowerCase();
        coord += config.wordKnowing && (word in config.wordKnowing) ? Math.round(1024 / Math.pow(2, config.wordKnowing[word])) : 1024;
        wordCoords[word] = coord;
    });
    return wordCoords;
}
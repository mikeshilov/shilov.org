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

function getChosenStories () {
    return config.chosenStories ?? [];
}

function addChosenStory (storyId) {
    if (Array.isArray(config.chosenStories)) {
        const index = config.chosenStories.indexOf(storyId);
        if (index === -1) {
            config.chosenStories.push(storyId)
        }
    }
    else {
        config.chosenStories = [];
    }
    saveConfig();
}

function removeChosenStory (storyId) {
    if (Array.isArray(config.chosenStories)) {
        while (true) {
            const index = config.chosenStories.indexOf(storyId);
            if (index === -1) break;
            config.chosenStories.splice(index, 1);
        }
    }
    else {
        config.chosenStories = [];
    }
    saveConfig();
}

function getSentUsage (storyId, sentId) {
    return config.sentUsage && (storyId in config.sentUsage) && (sentId in config.sentUsage[storyId]) ? config.sentUsage[storyId][sentId] : 0;
}

function incSentUsage (storyId, sentId) {
    if (!('sentUsage' in config)) {
        config.sentUsage = {};
    }
    if (!(storyId in config.sentUsage)) {
        config.sentUsage[storyId] = {};
    }
    config.sentUsage[storyId][sentId] = sentId in config.sentUsage[storyId] ? config.sentUsage[storyId][sentId] + 1 : 1;
    incTodayNumber ();
    saveConfig();
}

function getDifficultWords () {
    return config.difficultWords ?? {};
}

function incDifficultWord (word) {
    if (config.difficultWords) {
        if (word in config.difficultWords) {
            config.difficultWords[word] += 1;
        } else {
            config.difficultWords[word] = 1;
        }
    }
    else {
        config.difficultWords = {[word]: 1};
    }
    saveConfig();
}

function decDifficultWord (word) {
    if (config.difficultWords) {
        if (word in config.difficultWords) {
            if (config.difficultWords[word] > 1) {
                config.difficultWords[word] -= 1;
            }
            else {
                delete config.difficultWords[word];
            }
        }
    }
    saveConfig();
}

function getTodayDate () {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}

function getTodayNumber () {
    return config.today && config.today.length === 2 && config.today[0] === getTodayDate () ? config.today[1] : 0;
}

function incTodayNumber () {
    const todayDate = getTodayDate ();
    if (config.today && config.today.length === 2 && config.today[0] === todayDate) {
        config.today[1] += 1;
    } else {
        config.today = [todayDate, 1];
    }
}

function getSentImportanceCoords (sentIdsList) {
    const sentCoords = {};
    let coord = 0;
    sentIdsList.forEach(sentIds => {
        const ids = sentIds.split('-')
        const usage = getSentUsage(ids[0], ids[1]);
        coord += usage ? Math.round(32768 / Math.pow(2, usage)) : 32768;
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
            return sentIdsList[i];
        }
    }
    return sentIdsList[coords.length-1];
}

function getAvgPerSent (sentIdsList) {
    if (config.sentUsage) {
        let totalUsage = 0, totalSents = 0;
        sentIdsList.forEach(sentIds => {
            const ids = sentIds.split('-')
            totalUsage += config.sentUsage[ids[0]] ? (config.sentUsage[ids[0]][ids[1]] ?? 0) : 0;
            totalSents += 1;
        });
        return totalSents ? totalUsage/totalSents : 0;
    } else {
        return 0;
    }
}
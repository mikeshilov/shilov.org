const elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans"),
    elAvgPerSent = document.getElementById("avg-per-sent"),
    elToday = document.getElementById("today"),
    elUsageCount = document.getElementById("usage-count"),
    elDifficultWords = document.getElementById("difficult-words");

let storyId = 0, sentId = 0, sentUsage = 0, allSentIds, sentWords=[], dwWordsInSent=[];
const storyTitles=[], dwThreshold = 200;

for (const storyId in armSents) {
    for (const sentId in armSents[storyId])
        if (sentId === "title") {
            storyTitles[storyId] = armSents[storyId][sentId];
            break;
        }
}

function rnd(max) {
    return Math.floor(Math.random() * max);
}

function setVisibility(element, visible) {
    element.style.display = visible ? "block" : "none";
}

function toggleVisibility(element) {
    const wasHidden = element.style.display === "none";
    setVisibility(element, wasHidden);
    return wasHidden;
}

function nextSentence () {
    elAvgPerSent.innerText = (Math.round(getAvgPerSent(allSentIds)*10)/10).toString();
    elToday.innerText = getTodayNumber().toString();
    const chosenId = chooseSentence(allSentIds);
    [storyId, sentId] = chosenId.split('-');
    sentWords=armSents[storyId][sentId].split(/\s/);
    dwWordsInSent=[];
    sentUsage = config.sentUsage[storyId] ? (config.sentUsage[storyId][sentId] ?? 0) : 0
    elUsageCount.innerText = sentUsage;
    elAudioSource.src = `audio/${chosenId}.mp3`;
    elAudioControl.load();
}

function showTextClicked() {
    if (sentUsage > dwThreshold) {
        const html = [];
        for (const word of sentWords) {
            html.push(`<span class="word" onclick="incDWClicked('${word}')">${word}</span>`);
        }
        elSentText.innerHTML = html.join(' ');
    } else {
        elSentText.innerHTML = sentWords.join(' ');
    }
    setVisibility (elSentText, true);
}

function showTransClicked() {
    elSentTrans.innerText = tranSents[storyId][sentId];
    setVisibility (elSentTrans, true);
}

function nextClicked() {
    setVisibility (elSentTrans, false);
    setVisibility (elSentText, false);
    incSentUsage(storyId, sentId);

    // decrease word difficulty if sentance is recognized
    /*
    if (sentUsage > dwThreshold) {
        for (const word of sentWords) {
            const dw = normalizeDW(word);
            if (dwWordsInSent.indexOf(dw) === -1) {
                decDifficultWord(dw);
            }
        }
        rebuildDifficultWordList();
    }
    */

    nextSentence();
}

function skipClicked() {
    setVisibility (elSentTrans, false);
    setVisibility (elSentText, false);
    nextSentence();
}

function storyClicked(storyId, chosen) {
    (chosen ? removeChosenStory : addChosenStory)(storyId);
    start();
}

function normalizeDW (word) {
    return word.replace(/[.,!$%&;:()=`«»՝֊՟՞՜՛ՙ՚]/g,"").toLowerCase();
}

function incDWClicked(word) {
    const dw = normalizeDW(word);
    incDifficultWord(dw);
    if (dwWordsInSent.indexOf(dw) === -1) {
        dwWordsInSent.push(dw);
    }
    rebuildDifficultWordList();
}

function decDWClicked(word) {
    decDifficultWord(normalizeDW(word));
    rebuildDifficultWordList();
}

function rebuildChosenStoryList() {
    const reguestedStory = new URL (document.URL).searchParams.get("story");
    const chosenStories = reguestedStory && parseInt(reguestedStory) ? [parseInt(reguestedStory)] : getChosenStories();// [101,102]; //[1,2,3,4,5,6,7,8,9];
    const elStoryList = document.getElementById("story-list");
    const html=[];
    for (const storyId in storyTitles) {
        const chosen = chosenStories.indexOf(parseInt(storyId)) >= 0;
        html.push (`<span class="badge ${chosen ? 'bg-dark' : 'bg-secondary'}" onclick="storyClicked(${storyId},${chosen})">${storyTitles[storyId]}</span>`);
    }
    elStoryList.innerHTML = html.join(' ');
    return chosenStories;
}

function rebuildDifficultWordList() {
    const dw = getDifficultWords();
    const html = [];
    if (Object.keys(dw).length) {
        html.push('<h5>Difficult Words</h5>');
        html.push('<table class="table">');
        html.push('<tbody>');
        for (const [word, difficulty] of Object.entries(dw).sort((w1, w2) => w2[1] - w1[1])) {
            html.push(`<tr><th scope="row">${word}</th><td>${difficulty}</td><td class='dec-dw' onclick="decDWClicked('${word}')">↓</td></tr>`);
        }
        html.push('</tbody>');
        html.push('</table>');
    }
    elDifficultWords.innerHTML = html.join(' ');
}

function start() {
    rebuildDifficultWordList();
    const chosenStories = rebuildChosenStoryList();
    allSentIds = [];
    for (const storyId of chosenStories)
        for (const sentId in armSents[storyId])
            if (parseInt(sentId)) {
                allSentIds.push(`${storyId}-${sentId}`);
            }
    if (allSentIds.length > 0) {
        nextSentence();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(() => start ());
});

elAudioControl.addEventListener("canplaythrough", (event) => {
    elAudioControl.play();
});

window.addEventListener("keydown", (event) => {
    // console.log (event.code);

    const handled = () => {
        event.preventDefault();
        event.stopPropagation();
    }

    if (event.code === "Space") {
        if (elAudioControl.paused || elAudioControl.ended)
            elAudioControl.play();
        else
            elAudioControl.pause();
        handled();
    } else if (event.code === "Enter") {
        nextClicked();
        handled();
    } else if (event.code === "F1") {
        showTextClicked();
        handled();
    } else if (event.code === "F2") {
        showTransClicked();
        handled();
    } else if (event.code === "Escape") {
        skipClicked();
        handled();
    }
});
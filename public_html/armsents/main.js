const elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans"),
    elAvgPerSent = document.getElementById("avg-per-sent"),
    elToday = document.getElementById("today");

let storyId = 0, sentId = 0, allSentIds;
const storyTitles=[];

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
    elAudioSource.src = `audio/${chosenId}.mp3`;
    elAudioControl.load();
}

function showTextClicked() {
    elSentText.innerText = armSents[storyId][sentId];
    setVisibility (elSentText, true);
}

function showTransClicked() {
    elSentTrans.innerText = engSents[storyId][sentId];
    setVisibility (elSentTrans, true);
}

function nextClicked() {
    setVisibility (elSentTrans, false);
    setVisibility (elSentText, false);
    incSentUsage(storyId, sentId);
    nextSentence();
}

function storyClicked(storyId, choose) {
    console.log (storyId, choose);
}

function rebuildChosenStoryList(chosenStories) {
    const elStoryList = document.getElementById("story-list");
    const html=[];
    for (const storyId in storyTitles) {
        const chosen = chosenStories.indexOf(parseInt(storyId)) >= 0;
        html.push (`<span class="badge ${chosen ? 'bg-dark' : 'bg-secondary'}" onclick="storyClicked(${storyId},${!chosen})">${storyTitles[storyId]}</span>`);
    }
    elStoryList.innerHTML = html.join(' ');
}

function start() {
    const reguestedStory = new URL (document.URL).searchParams.get("story");
    const chosenStories = reguestedStory && parseInt(reguestedStory) ? [parseInt(reguestedStory)] : [101,102]; //[1,2,3,4,5,6,7,8,9];
    rebuildChosenStoryList(chosenStories);
    allSentIds = [];
    for (const storyId of chosenStories)
        for (const sentId in armSents[storyId])
            if (parseInt(sentId)) {
                allSentIds.push(`${storyId}-${sentId}`);
            }
    nextSentence();
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(() => start ());
});

elAudioControl.addEventListener("canplaythrough", (event) => {
    elAudioControl.play();
});

window.addEventListener("keydown", (event) => {
    //console.log (event.code);

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
    }
});
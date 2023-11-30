const elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans"),
    elAvgPerSent = document.getElementById("avg-per-sent"),
    elToday = document.getElementById("today");

let storyId = 0, sentId = 0;
let today = 0;

const availableStories = [100];//[1,2,3,4,5,6,7,8,9];
const allSentIds = [];
for (const storyId of availableStories)
    for (const sentId in armSents[storyId])
        allSentIds.push(`${storyId}-${sentId}`);

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
    elToday.innerText = today.toString();
    const chosenId = chooseSentence(allSentIds);
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
    today += 1;
    setVisibility (elSentTrans, false);
    setVisibility (elSentText, false);
    incSentUsage(storyId, sentId);
    nextSentence();
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(() => nextSentence ());
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
    }
});
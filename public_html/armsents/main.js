const elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elBtnShowTrans = document.getElementById("btn-show-trans"),
    elBtnNext = document.getElementById("btn-next"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans");

let storyId = 0, sentId = 0;

const availableStories = [1,2,3,4,5,6,7,8,9];
const allSentIds = [];
for (const storyId of availableStories)
    for (const sentId in armSents[storyId])
        allSentIds.push(`${storyId}-${sentId}`);

function rnd(max) {
    return Math.floor(Math.random() * max);
}

function toggleVisibility(x) {
    const wasHidden = x.style.display === "none";
    x.style.display = wasHidden ? "block" : "none";
    return wasHidden;
}

function nextSentence () {
    [storyId, sentId] = chooseSentence(allSentIds);
    console.log ({storyId, sentId});
    elAudioSource.src = `audio/${storyId}-${sentId}.mp3`;
    elAudioControl.load();
}

function showTextClicked() {
    elSentText.innerText = armSents[storyId][sentId];
    toggleVisibility (elSentText);
    toggleVisibility (elBtnShowText);
    toggleVisibility (elBtnNext);
}

function showTransClicked() {
    elSentTrans.innerText = engSents[storyId][sentId];
    toggleVisibility (elSentTrans);
    toggleVisibility (elBtnShowTrans);
    toggleVisibility (elBtnNext);
}

function nextClicked() {
    // toggleVisibility (elSentTrans);
    toggleVisibility (elSentText);
    toggleVisibility (elBtnNext);
    toggleVisibility (elBtnShowText);
    incSentUsage(storyId, sentId);
    nextSentence();
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(() => nextSentence ());
});

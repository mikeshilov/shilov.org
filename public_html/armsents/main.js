const elSentAudio = document.getElementById("sent-audio"),
    elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elBtnShowTrans = document.getElementById("btn-show-trans"),
    elBtnNext = document.getElementById("btn-next"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans");

function toggleVisibility(x) {
    const wasHidden = x.style.display === "none";
    x.style.display = wasHidden ? "block" : "none";
    return wasHidden;
}

function nextSentence () {
    elAudioSource.src = "audio/1-1.mp3";
    elAudioControl.load();
}

function showTextClicked() {
    elSentText.innerText = armSents[1][1];
    toggleVisibility (elSentText);
    toggleVisibility (elBtnShowText);
    toggleVisibility (elBtnShowTrans);
}

function showTransClicked() {
    elSentTrans.innerText = engSents[1][1];
    toggleVisibility (elSentTrans);
    toggleVisibility (elBtnShowTrans);
    toggleVisibility (elBtnNext);
}

function nextClicked() {
    toggleVisibility (elSentTrans);
    toggleVisibility (elSentText);
    toggleVisibility (elBtnNext);
    toggleVisibility (elBtnShowText);
    nextSentence();
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(() => nextSentence ());
});

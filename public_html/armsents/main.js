const elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elBtnShowText = document.getElementById("btn-show-text"),
    elSentText = document.getElementById("sent-text"),
    elSentTrans = document.getElementById("sent-trans"),
    elAvgPerSent = document.getElementById("avg-per-sent"),
    elToday = document.getElementById("today"),
    elUsageCount = document.getElementById("usage-count"),
    elDifficultWords = document.getElementById("difficult-words"),
    elAllowDifficultWords = document.getElementById("chk-allow-dw");

let storyId = 0, sentId = 0, sentUsage = 0, allSentIds, sentWords=[], dwWordsInSent=[];
let thisChosen, prevChosen, prevPrevChosen;
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

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

    prevPrevChosen = prevChosen;
    prevChosen = thisChosen;
    for (let i=0;i<5;i++) {
        thisChosen = chooseSentence(allSentIds);
        if ((thisChosen !== prevChosen || prevChosen === undefined) && (thisChosen !== prevPrevChosen || prevPrevChosen === undefined)) {
            break;
        }
    }

    [storyId, sentId] = thisChosen.split('-');
    sentWords=armSents[storyId][sentId].split(/\s/);
    dwWordsInSent=[];
    sentUsage = config.sentUsage[storyId] ? (config.sentUsage[storyId][sentId] ?? 0) : 0
    elUsageCount.innerText = sentUsage;
    elAudioSource.src = `audio/${thisChosen}.mp3`;
    elAudioControl.load();
}

function showTextClicked() {
    const html = [];
    for (const word of sentWords) {
        html.push(`<span class="word" onclick="wordClicked('${word}')">${word}</span>`);
    }
    elSentText.innerHTML = html.join(' ');
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
    if (elAllowDifficultWords.checked) {
        for (const word of sentWords) {
            const dw = normalizeDW(word);
            if (dwWordsInSent.indexOf(dw) === -1) {
                decDifficultWord(dw);
            }
        }
        rebuildDifficultWordList();
    }

    // update performance
    const today = formatDate(new Date());
    let [total, dfclt] = getPerformanceByDate (today);
    total += sentWords.length;
    dfclt += dwWordsInSent.length;
    setPerformance(today, total, dfclt);
    drawChart();

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

function wordClicked(word) {
    if (elAllowDifficultWords.checked) {
        const dw = normalizeDW(word);
        if (dwWordsInSent.indexOf(dw) === -1) {
            dwWordsInSent.push(dw);
            incDifficultWord(dw);
            rebuildDifficultWordList();
        }
        return true;
    } else {
        return false;
    }
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
        for (const [word, difficulty] of Object.entries(dw).sort((w1, w2) => w2[1] - w1[1]).slice(0, 10)) {
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
    elAllowDifficultWords.checked = getAllowDW();
    if (allSentIds.length > 0) {
        nextSentence();
    }
}

function drawChart() {
    const perf = getAllPerformance();
    const tbl = [['Date',  'Known', 'Unknown']];
    const thresholdTime = (new Date()).getTime() - 1000*60*60*24*14;
    for (const date in perf) {
        if (Date.parse(date) > thresholdTime) {
            const item = perf[date];
            tbl.push([date.substr(8, 2), item[0] - item[1], item[1]])
        }
    }

    const options = {
        title: 'Performance',
        vAxis: {title: 'Words'},
        isStacked: true,
        legend: { position: 'bottom' },
    };

    const chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

    chart.draw(google.visualization.arrayToDataTable(tbl), options);
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

elAllowDifficultWords.addEventListener('change', (event) => {
    setAllowDW(event.currentTarget.checked);
    if (event.currentTarget.checked) {

    } else {

    }
})
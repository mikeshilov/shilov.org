const elTextQuestion = document.getElementById("text-question"),
    elAudioQuestion = document.getElementById("audio-question"),
    elImageQuestion = document.getElementById("image-question"),
    elAudioControl = document.getElementById("audio-control"),
    elAudioSource = document.getElementById("audio-source"),
    elPronunciation = document.getElementById("pronunciation"),
    elPronunControl = document.getElementById("pronunciation-control"),
    elPronunSource = document.getElementById("pronunciation-source"),
    elAnswer = document.getElementById("answer"),
    elProgress = document.getElementById("progress"),
    elWellDone = document.getElementById("well-done"),
    elGame = document.getElementById("game"),
    elFeedback = document.getElementById("feedback");

let firstAttempt = true;

function start (tester) {
    function nextQuestion() {
        const question = tester.next();
        if (!question) {
            elGame.style.display = "none";
            elWellDone.style.display = "block";
            elAnswer.removeEventListener("keyup", keyUpEventListener);
        } else {
            if (question.indexOf('.mp3') > 0) {
                elTextQuestion.style.display = "none";
                elImageQuestion.style.display = "none";
                elAudioQuestion.style.display = "block";
                elAudioSource.src = question;
                elAudioControl.load();
            } else if (question.indexOf('.png') > 0) {
                elTextQuestion.style.display = "none";
                elImageQuestion.style.display = "block";
                elImageQuestion.src = question;
            } else {
                elTextQuestion.style.display = "block";
                elAudioQuestion.style.display = "none";
                elImageQuestion.style.display = "none";
                elTextQuestion.innerText = question;
            }
        }
        if (tester.audio) {
            const audio = tester.audio();
            if (audio) {
                elPronunciation.style.display = "block";
                elPronunSource.src = audio;
                elPronunControl.load();
            } else {
                elPronunciation.style.display = "none";
            }
        }
        firstAttempt = true;
        elAnswer.value = "";
        elAnswer.classList.remove("is-invalid");
        const progress = tester.progress();
        elProgress.setAttribute('aria-valuenow', String(progress));
        elProgress.setAttribute('style', 'width:' + progress + '%');
        elFeedback.setAttribute('style', 'display: none');
    }

    const keyUpEventListener = function (event) {
        if (event.key === "Enter") {
            const reply = elAnswer.value.trim().toLowerCase();

            if (firstAttempt) {
                const replyWords = reply.split(' ');
                const answerWords = tester.answer().toLowerCase().split(' ');
                replyWords.forEach(word => {
                    if (word.trim () && answerWords.includes(word)) {
                        increaseWordKnowing(word);
                    }
                });
            }
            firstAttempt = false;

            if (tester.answer().toLowerCase() === reply) {
                nextQuestion();
            } else {
                elAnswer.classList.add("is-invalid");
                elFeedback.innerHTML = tester.answer().toLowerCase() + "<br/>" + reply;
                elFeedback.setAttribute('style', 'display: block');
            }
        }
    }

    elAnswer.addEventListener("keyup", keyUpEventListener);
    elAudioControl.addEventListener("ended", ()=>elAnswer.focus())
    nextQuestion();
    elAnswer.focus();
}

function refreshWordDistr (coordSet) {
    const htmls = [];
    for (let s=0; s<coordSet.length; s++) {
        const words = coordSet[s][0];
        const coords = coordSet[s][1];
        htmls.push('<table class="word-distr-table"><tr>');
        let i=0, prev=0;
        const max = Math.max(...coords);
        for (const coord of coords) {
            const knowing = getWordKnowing(words[i]);
            htmls.push (`<td class="bg${(i%34)+1}" style="width:${Math.round((coord-prev)*100/max)}%;" title="${words[i] + ', ' + knowing + ', ' + (coord-prev)}">${words[i]}</td>`);
            i+=1;
            prev = coord;
        }
        htmls.push('</tr></table>');
    }
    document.getElementById("word-distr").innerHTML = htmls.join('');
}

loadConfig(() => start (new LetterTester()));

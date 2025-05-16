const BasicNumTester= {
    numbers: shuffle ([...Array(21).keys(), 30, 40, 50, 60, 70, 80, 90, 100, 1000]),
    trans: {
        0: "զրո",
        1: "մեկ",
        2: "երկու",
        3: "երեք",
        4: "չորս",
        5: "հինգ",
        6: "վեց",
        7: "յոթ",
        8: "ութ",
        9: "ինը",
        10: "տասը",
        11: "տասնմեկ",
        12: "տասներկու",
        13: "տասներեք",
        14: "տասնչորս",
        15: "տասնհինգ",
        16: "տասնվեց",
        17: "տասնյոթ",
        18: "տասնութ",
        19: "տասնինը",
        20: "քսան",
        30: "երեսուն",
        40: "քառասուն",
        50: "հիսուն",
        60: "վաթսուն",
        70: "յոթանասուն",
        80: "ութսուն",
        90: "իննսուն",
        100: "հարյուր",
        1000: "հազար"
    },
    curTest: 0,
    curAnswer: null,
    maxTests: 2,

    next () {
        if (this.curAnswer && this.curTest < this.maxTests) {
            this.curTest += 1;
        }
        if (this.curTest < this.maxTests) {
            const quest = this.numbers[this.curTest];
            this.curAnswer = this.trans[quest];
            return this.numbers[this.curTest];
        }
        return null;
    },

    answer () {
        return this.curAnswer;
    },

    progress () {
        return Math.round(this.curTest * 100 / this.maxTests);
    }
}

const BigNumTester = {
    trans: {
        0: "զրո",
        1: "մեկ",
        2: "երկու",
        3: "երեք",
        4: "չորս",
        5: "հինգ",
        6: "վեց",
        7: "յոթ",
        8: "ութ",
        9: "ինը",
        10: "տասը",
        11: "տասնմեկ",
        12: "տասներկու",
        13: "տասներեք",
        14: "տասնչորս",
        15: "տասնհինգ",
        16: "տասնվեց",
        17: "տասնյոթ",
        18: "տասնութ",
        19: "տասնինը",
        20: "քսան",
        30: "երեսուն",
        40: "քառասուն",
        50: "հիսուն",
        60: "վաթսուն",
        70: "յոթանասուն",
        80: "ութսուն",
        90: "իննսուն",
        100: "հարյուր",
        1000: "հազար"
    },
    questNumber: 0,
    curQuestion: null,
    maxQuestions: 5,

    _before1000 (num) {
        const units = num % 10;
        const tens = Math.floor(num / 10) % 10;
        const hundreds = Math.floor(num / 100) % 10;
        let output = hundreds > 0 ? this.trans[hundreds.toString()] + ' հարյուր ' : '';
        if (tens < 1) {
            if (units > 0) {
                output += this.trans[units.toString()];
            }
        } else if (tens < 2) {
            output += this.trans['1' + units.toString()];
        } else if (tens === 2 && units === 0) {
            output += this.trans['20'];
        } else {
            output += this.trans[tens.toString()+'0'] + (units > 0 ? this.trans[units.toString()] : '');
        }
        return output.trimEnd();
    },

    next () {
        if (this.questNumber < this.maxQuestions) {
            const from = 999, upto = 99999;
            this.questNumber += 1;
            this.curQuestion = Math.round(Math.random() * (upto - from)) + from;
        }
        else {
            this.curQuestion = null;
        }
        return this.curQuestion !== null ? this.curQuestion.toString(): null;
    },

    answer () {
        if (this.curQuestion !== null){
            const units = this.curQuestion % 1000;
            const thousands = Math.floor(this.curQuestion / 1000) % 1000;
            let answer = thousands > 0 ? this._before1000(thousands) + ' հազար ' : '';
            if (units > 0) {
                answer += this._before1000(units)
            }
            return answer.trimEnd()
        } else {
            return null;
        }
    },

    progress () {
        return Math.round((this.questNumber - 1) * 100 / this.maxQuestions);
    }
}

const AudioNumTester = {
    numbers: [10930, 11843, 12756, 13661, 14574, 15487, 16392, 17205, 18198, 19089, 20170, 21263, 22356, 23441, 24534, 25628, 26712, 27807, 28985, 29079, 30161, 31253],
    shuffled: null,
    questNumber: 0,
    curQuestion: null,
    maxQuestions: 10,//22,

    next () {
        if (this.curQuestion === null || !this.shuffled) {
            this.shuffled = shuffle(this.numbers);
            this.questNumber = 0;
        }
        if (this.questNumber < Math.min (this.maxQuestions, this.shuffled.length)) {
            this.questNumber += 1;
            this.curQuestion = `audio/${this.shuffled[this.questNumber - 1]}.mp3`;
        }
        else {
            this.curQuestion = null;
        }
        return this.curQuestion !== null ? this.curQuestion.toString(): null;
    },

    answer () {
        if (this.curQuestion !== null){
            return this.shuffled[this.questNumber - 1].toString()
        } else {
            return null;
        }
    },

    progress () {
        return Math.round((this.questNumber - 1) * 100 / this.maxQuestions);
    }
}

const PhraseTester = {
    phrases: [ // till 11:45 in https://www.youtube.com/watch?v=BoagLalMVyg&t=1021s
        ["всем привет!", "Ողջույն բոլորին", 1],
        ["приятно познакомиться", "հաճելի է ծանոթանալ", 2],
        ["до встречи!","Կտեսնվենք", 3],
        ["до завтра", "մինչ վաղը", 4],
        ["как тебя зовут?", "Ինչ է անունըդ", 5],
        ["меня зовут Миша", "անունս Միշա է", 6],
        ["сколько тебе лет?", "Քանի տարեկան ես", 7],
        ["мне 25 лет", "25 տարեկան եմ", 8],
        ["который час?", "ժամը քանիսն է", 9],
        ["четыре часа дня", "ցերեկվա ժամը չորսն է", 10],
    ],
    phraseIndexes: null,

    next () {
        if (this.phraseIndexes === null) {
            this.phraseIndexes = shuffle([...Array(this.phrases.length).keys()]);
            return this.phrases[this.phraseIndexes[0]][0];
        } else if (this.phraseIndexes) {
            this.phraseIndexes.shift();
            return this.phraseIndexes.length ? this.phrases[this.phraseIndexes[0]][0] : null;
        }
        else
            return null;
    },

    answer () {
        return this.phrases[this.phraseIndexes[0]][1];
    },

    audio () {
        return this.phrases[this.phraseIndexes[0]].length > 2
            ? `phrases/${this.phrases[this.phraseIndexes[0]][2]}.mp3`
            : null;
    },

    progress () {
        return Math.round((this.phrases.length - this.phraseIndexes.length) * 100 / this.phrases.length);
    }
}

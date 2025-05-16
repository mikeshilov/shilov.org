class VerbTester {
    constructor() {
        this.armPronouns = ['ես','դու','նա','մենք','դուք','նրանք'];
        this.rusPronouns = ['я','ты','он','мы','вы','они'];
        this.tobe = ['եմ','ես','է','ենք','եք','են'];
        this.verbs = [
            ['սիրում', ['люблю','любишь','любит','любим','любите','любят']],
            ['կարդում', ['читаю','читаешь','читает','читаем','читаете','читают']],
            ['գնում', ['покупаю','покупаешь','покупает','покупаем','покупаете','покупают']],
            ['աշխատում', ['работаю','работаешь','работает','работаем','работаете','работают']],
        ];

        this.adjs = [
            ['ողջ', ['живой','живые']],
            ['գեղեցիկ', ['красивый','красивые']],
            ['խելացի', ['умный','умные']],
            ['ռուս',['русский','русские']],
        ];

        this.testCount = 10;
        this.testNumber = 0;
        this.testAnswer = "";
    }

    next () {
        if (this.testNumber < this.testCount) {
            this.testNumber += 1;
            return this.generateTest ();
        }
        else
            return null;
    }

    generateTest () {
        const [person, personCoords] = chooseWordIndex (this.armPronouns);
        const negative = rnd(100) > 50;
        const auxv = negative ? (person === 2 ? 'չի' : 'չ' + this.tobe[person]) : this.tobe[person];
        let question;
        if (rnd(100) > 50) {
            // adjective
            const [adj, adjCoords] = chooseWordIndex(this.adjs.map (a => a[0]));
            refreshWordDistr ([[this.armPronouns, personCoords], [this.adjs.map (a => a[0]), adjCoords]]);
            this.testAnswer = `${this.armPronouns[person]} ${this.adjs[adj][0]} ${auxv}`;
            question = `${this.rusPronouns[person]} ${negative ? 'не' : '-'} ${this.adjs[adj][1][person > 2 ? 1 : 0]}`;
        } else {
            // verb
            const [vrb, vrbCoords] = chooseWordIndex(this.verbs.map (v => v[0]));
            refreshWordDistr ([[this.armPronouns, personCoords], [this.verbs.map (v => v[0]), vrbCoords]]);
            this.testAnswer = negative
                ? `${this.armPronouns[person]} ${auxv} ${this.verbs[vrb][0]}`
                : `${this.armPronouns[person]} ${this.verbs[vrb][0]} ${auxv}`;
            question = `${this.rusPronouns[person]}${negative ? ' не ' : ' '}${this.verbs[vrb][1][person]}`;
        }
        return question;
    }

    answer () {
        return this.testAnswer;
    }

    progress () {
        return Math.round(this.testNumber * 100 / this.testCount);
    }
}

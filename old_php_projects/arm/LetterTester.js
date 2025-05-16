class LetterTester {

    constructor() {
        this.pics = {
            1:'дз', 2:'дз', 3:'ч', 4:'ч', 5:'ц', 6:'ц', 7:'ш', 8:'дж', 9:'дж', 10:'цх', 11:'цх', 12:'з', 13:'з', 14:'чх', 15:'чх',
            16:'дз', 17:'дз', 18:'ч', 19:'ч', 20:'ц', 21:'ц', 22:'ш', 23:'ш', 24:'дж', 25:'дж', 26:'цх', 27:'цх', 28:'з', 29:'з', 30:'чх', 31:'чх',
            32:'дз', 33:'дз', 34:'ч', 35:'ч', 36:'ц', 37:'ц', 38:'ш', 39:'ш', 40:'дж', 41:'дж', 42:'цх', 43:'цх', 44:'з', 45:'з', 46:'чх', 47:'чх',
            48:'дз', 49:'дз', 50:'ч', 51:'ч', 52:'ц', 53:'ц', 54:'ш', 55:'ш', 56:'дж', 57:'дж', 58:'цх', 59:'цх', 60:'з', 61:'з', 62:'чх', 63:'чх',
            64:'дз', 65:'дз', 66:'ч', 67:'ч', 68:'ц', 69:'ц', 70:'ш', 71:'ш', 72:'дж', 73:'дж', 74:'цх', 75:'цх', 76:'з', 77:'з', 78:'чх', 79:'чх'
        };
        this.shuffled = [];
        this.questNumber = 0;
        this.curQuestion = null;
        this.maxQuestions = 30;
    }

    next () {
        if (this.curQuestion === null) {
            this.shuffled = shuffle (Object.keys(this.pics));
        }
        if (this.questNumber < Math.min (this.maxQuestions, this.shuffled.length)) {
            this.questNumber += 1;
            this.curQuestion = `pics/${this.shuffled[this.questNumber - 1]}.png`;
        }
        else {
            this.curQuestion = null;
        }
        return this.curQuestion !== null ? this.curQuestion.toString(): null;
    }

    answer () {
        if (this.curQuestion !== null){
            return this.pics[this.shuffled[this.questNumber - 1]].toString();
        } else {
            return null;
        }
    }

    progress () {
        return Math.round((this.questNumber - 1) * 100 / Math.min (this.maxQuestions, this.shuffled.length));
    }
}

const clash = (a, n) => {
    let l = a.length;
    for (let i = 0; i < a.length; i++)
    {
        if (a[i] == n)
            return true;
    };
    return false;
};

const add_unique = (a, limit) => {
    let l = a.length;
    let n = badrandint(limit);
    while (clash(a, n))
        n = badrandint(limit);
    a.push(n);
};

const sqr_question = () => {
    let a = badrandint(32);
    let answers = [a*a];
    add_unique(answers, 1000);
    add_unique(answers, 1000);
    add_unique(answers, 1000);
    return [""+a+"²?", answers];
};

const sqrt_question = () => {
    let a = badrandint(32);
    let answers = [a];
    add_unique(answers, 32);
    add_unique(answers, 32);
    add_unique(answers, 32);
    return ["√"+(a*a)+"?", answers];
};

const math_question = ()=>badrandint(2) == 0 ? sqr_question() : sqrt_question();

const gen_questions = [
    ()=>["Are you awake?", ["Yes", "No", "No", "No"]],
    math_question,
    ()=>["Know current task?", ["Yes", "No", "No", "No"]],
    math_question,
    ()=>["Wrote task down?", ["Yes", "No", "No", "No"]],
];

// returns a bad random integer in [0, limit)
function badrandint(limit) {
    return (Math.random()*limit)|0;
}

// returns a new position of idx in shuffled array
function shuffle(a, idx) {
    // Fisher-Yates
    let l = a.length;
    for (let i=0; i < l-1; i++) {
        let j = badrandint(i, l);
        [a[j], a[i]] = [a[i], a[j]];
        if (idx == j)
            idx = i;
        else if (idx == i)
            idx = j;
    }
    return idx;
}

export class State {
    constructor() {
        this.enabled = true;
        this._reset_question();
    }

    _set_question(n) {
        let [question, answers] = gen_questions[n]();

        let correct_answer = shuffle(answers, 0);

        this.nquestion = n;
        this.question = question;
        this.answers = answers;
        this.correct_answer = correct_answer;
    }

    _reset_question() {
        this.nquestion = null;
        this.question = null;
        this.answers = null;
        this.correct_answer = null;
    }

    onClick(id) {
        if (this.nquestion != null) {
            if (id == this.correct_answer) {
                if (this.nquestion+1 == gen_questions.length) {
                    this._reset_question();
                } else {
                    this._set_question(this.nquestion+1);
                }
            } else {
                this._set_question(0);
            }
        }
    }

    onBodyPresent() {
        if (!this.enabled) {
            this.enabled = true;
            this._reset_question();
        }
    }
    onBodyAbsent() {
        this.enabled = false;
        this._reset_question();
    }

    onMinutePassed() {
    }

    onTenMinutesPassed() {
        if (this.enabled) {
            this._set_question(0);
        }
    }

    getQuestionText() {
        return this.question;
    }
    getAnswersText() {
        return this.answers;
    }
}

const num_questions = 3;
const num_answers = 4;
const questions = ["Are you aware?", "Sure?", "Written it down?"];

export class State {
    constructor() {
        this.enabled = true;
        this._reset_question();
    }

    _set_question(n) {
        this.question = n;
        this.correct_answer = (Math.random()*num_answers)|0;
    }

    _reset_question() {
        this.question = null;
        this.correct_answer = null;
    }

    onClick(id) {
        if (this.question != null) {
            if (id == this.correct_answer) {
                if (this.question+1 == num_questions) {
                    this._reset_question();
                } else {
                    this._set_question(this.question+1);
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
        return this.question == null ? null : questions[this.question];
    }
    getAnswersText() {
        let answers = [];
        for (let i = 0; i < num_answers; i++) {
            answers.push(i == this.correct_answer ? "Yes": "No");
        }
        return answers;
    }
}

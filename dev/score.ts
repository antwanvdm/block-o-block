class Score extends DomElement {
    score: number = 0;

    constructor() {
        super('score', 10, 10);
        this.el.innerHTML = "score: " + this.score.toString();

        window.addEventListener('scoreUpdate', (e) => this.update(e));
    }

    /**
     * Update the score based on a Custom Event from the Block object
     * 
     * @param e 
     */
    update(e: Event) {
        //Ugly hack because typescript doesn't understand..
        //https://stackoverflow.com/questions/47166369/argument-of-type-e-customevent-void-is-not-assignable-to-parameter-of-ty?rq=1
        if (!Utils.isCustomEvent(e)) {
            throw new Error('not a custom event');
        }

        this.score += e.detail.score;
        this.el.innerHTML = "score: " + this.score.toString();
    }
}
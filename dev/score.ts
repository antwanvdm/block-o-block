class Score extends DomElement {
    private score: number = 0;

    constructor() {
        super('score', 10, 10, 'gui');
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }

    /**
     * Retrieve current score
     *
     * @returns {number}
     */
    public get() {
        return this.score;
    }

    /**
     * Update the score based on a Custom Event from the Block object
     *
     * @param score
     * @param [reset]
     */
    public update(score: number, reset: boolean = false) {
        this.score = reset ? score : this.score + score;
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }
}

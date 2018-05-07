class Score extends DomElement {
    score: number = 0;

    constructor() {
        super('score', 10, 10, 'level');
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }

    /**
     * Update the score based on a Custom Event from the Block object
     * 
     * @param e 
     */
    public update(score: number) {
        this.score += score;
        this.el.innerHTML = `score: ${this.score.toString()}`;
    }
}
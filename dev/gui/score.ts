import DomElement from "../helpers/domelement";

export default class Score extends DomElement {
    private score: number = 0;

    constructor() {
        super('score', -1, -1, 'gui');

        this.renderTemplate();
        this.el.querySelector('.score-count').innerHTML = this.score.toString();
        this.el.classList.add('message', 'is-warning');
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
        this.el.querySelector('.score-count').innerHTML = this.score.toString();
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate() {
        this.el.innerHTML = `
            <div class="message-body">
                <span>score: </span>
                <span class="score-count"></span>
            </div>
        `;
    }
}

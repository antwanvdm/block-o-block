import DomElement from "../helpers/domelement";
import DataService from "../dataservice";

export default class HighScoreList extends DomElement {
    private dataService: DataService;
    private scores: { name: string, score: number, _id: { $oid: string } }[];
    private tBody: HTMLTableSectionElement;

    constructor() {
        super('highscorelist', -1, -1, 'gui');
        this.el.classList.add('modal');

        this.renderTemplate();
        this.tBody = this.el.querySelector('.tbody');

        this.dataService = DataService.getInstance();
        this.loadScoreData();

        window.addEventListener('game:scoreSaved', (e) => this.updateData((e as CustomEvent).detail.data));
    }

    /**
     * Initial score loading
     *
     * @param {boolean} showScreen
     */
    private loadScoreData(showScreen: boolean = false): void {
        this.dataService.getScores().then((data) => {
            this.scores = data;
            this.tBody.innerHTML = this.getTbodyTemplate();

            if (showScreen === true) {
                this.el.classList.add('is-active');
            }
        })
    }

    /**
     * Update current score of user in available data
     *
     * @param {{}} data
     */
    private updateData(data: { name: string, score: number, _id: { $oid: string } }): void {
        //Check if given score is top 10 worthy
        let lowestCurrentScore = this.scores.length === 0 ? -1 : this.scores[this.scores.length - 1].score;
        if (lowestCurrentScore < data.score || this.scores.length < 10) {
            //Updating the scores array & present
            this.scores.push(data);
            this.scores.sort((a, b) => b.score - a.score);
            this.scores.splice(10, 1);
            this.tBody.innerHTML = this.getTbodyTemplate();
        }
    }

    /**
     * Show the high score list
     */
    public show(): void {
        if (typeof this.scores === 'undefined') {
            this.loadScoreData(true);
        } else {
            this.el.classList.add('is-active');
        }
    }

    /**
     * Hide it period
     */
    public hide(): void {
        this.el.classList.remove('is-active');
    }

    /**
     * Return the mapped HTML <tr> list for appending in <tbody>
     *
     * @returns {string}
     */
    private getTbodyTemplate(): string {
        return `
            ${this.scores.map((item, index) => `<tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.score.toString()}</td>
            </tr>`).join('')}
        `;
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="message is-warning">
                    <div class="message-header">
                        <p>Top 10 Scores (press -<strong>ESC</strong>- to return)</p>
                    </div>
                    <div class="message-body">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                            </thead>
                            <tbody class="tbody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}

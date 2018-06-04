import DomElement from "../helpers/domelement";
import DataService from "../dataservice";

export default class HighScoreList extends DomElement {
    private dataService: DataService;

    constructor() {
        super('highscorelist', -1, -1, 'gui');
        this.el.classList.add('message', 'is-warning');

        this.renderTemplate();
        this.dataService = new DataService();
    }

    /**
     * Show the highscore list
     */
    public show() {
        this.dataService.getScores().then((data) => {
            let tBody = this.el.querySelector('.tbody');
            tBody.innerHTML = this.getTbodyTemplate(data);
            this.el.classList.add('show');
        });
    }

    /**
     * Hide it period
     */
    public hide() {
        this.el.classList.remove('show');
    }

    /**
     * Return te looped
     *
     * @param {[{}]} data
     * @returns {string}
     */
    private getTbodyTemplate(data: { score: number, _id: { $oid: string } }[]) {
        return `
            ${data.map((item, index) => `<tr>
                <td>${index + 1}</td>
                <td>${item._id.$oid}</td>
                <td>${item.score.toString()}</td>
            </tr>`).join('')}
        `;
    }

    /**
     * Template needed to show more elements
     *
     * @param tBody
     */
    private renderTemplate() {
        this.el.innerHTML = `
            <div class="message-header">
                <p>Top 10 High Scores (press -<strong>esc</strong>- to return)</p>
            </div>
            <div class="message-body">
                <table class="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>MongoID</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody class="tbody"></tbody>
                </table>
            </div>
        `;
    }
}

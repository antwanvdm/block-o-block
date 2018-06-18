import DomElement from "../helpers/domelement";
import DataService from "../dataservice";
import Filter from "bad-words";
import config from "../config.json";

export default class NameForm extends DomElement {
    private filter: Filter;
    private dataService: DataService;
    private score: number = 0;
    private form: HTMLFormElement;
    private feedbackMessage: HTMLParagraphElement;
    private nameField: HTMLInputElement;
    private nameMaxLength: number = 16;

    constructor() {
        super('nameform', -1, -1, 'gui');
        this.dataService = DataService.getInstance();
        this.filter = new Filter({list: config.game.badWords});

        this.el.classList.add('modal');
        this.renderTemplate();

        this.form = this.el.querySelector('.name-form');
        this.nameField = this.form.querySelector('.name');
        this.feedbackMessage = this.el.querySelector('.feedback-message');

        this.form.addEventListener('submit', (e) => this.saveScore(e));
    }

    /**
     * Show our form
     *
     * @param {number} score
     */
    public show(score: number): void {
        this.nameField.classList.remove('is-danger');
        this.form.classList.remove('is-hidden');
        this.feedbackMessage.classList.add('is-hidden');

        this.score = score;
        this.el.classList.add('is-active');
        this.nameField.focus();
    }

    /**
     * Hide our form
     */
    public hide(): void {
        this.el.classList.remove('is-active');
    }

    /**
     * Save score with web service, and make sure to hide our form afterwards
     *
     * @param {Event} e
     */
    private saveScore(e: Event): void {
        e.preventDefault();
        let name = this.nameField.value;

        if (name == "" || name.length > this.nameMaxLength || this.filter.isProfane(name)) {
            this.nameField.classList.add('is-danger');
            return;
        }

        this.dataService.saveScore(name, this.score).then((data) => {
            window.dispatchEvent(new CustomEvent('game:scoreSaved', {detail: {data}}));

            this.feedbackMessage.innerHTML = 'Your score has been saved, Press <strong>-ESC-</strong> to return to the previous screen!';
            this.form.classList.add('is-hidden');
            this.feedbackMessage.classList.remove('is-hidden');
        });
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="message is-warning">
                    <div class="message-header">Please enter your name</div>
                    <div class="message-body">
                        <p class="feedback-message is-hidden"></p>
                        <form method="post" action="" class="name-form">
                            <div class="control has-icons-left">
                                <input name="name" class="name input" type="text" placeholder="Enter your name.." maxlength="${this.nameMaxLength}" autocomplete="off"/>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>
                            <div class="control">
                                <input type="submit" class="input button" value="Save score"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
}

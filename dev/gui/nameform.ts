import DomElement from "../helpers/domelement";
import DataService from "../dataservice";
// import Filter from "bad-words";

export default class NameForm extends DomElement {
    private dataService: DataService;
    private score: number = 0;
    private form: HTMLFormElement;
    private feedbackMessage: HTMLParagraphElement;
    private nameField: HTMLInputElement;

    constructor() {
        super('nameform', -1, -1, 'gui');
        this.dataService = DataService.getInstance();

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

        this.dataService.saveScore(name, this.score).then((data) => {
            if (typeof data.error === 'undefined') {
                window.dispatchEvent(new CustomEvent('game:scoreSaved', {detail: {data}}));

                this.feedbackMessage.innerHTML = 'Your score has been saved, Press <strong>-ESC-</strong> to return to the previous screen!';
                this.form.classList.add('is-hidden');
                this.feedbackMessage.classList.remove('is-hidden');
            }
        });
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="message">
                    <div class="message-header">Please enter your name</div>
                    <div class="message-body">
                        <p class="feedback-message is-hidden"></p>
                        <form method="post" action="" class="name-form">
                            <div class="control has-icons-left">
                                <input name="name" class="name input is-primary" type="text" placeholder="Enter your name.." maxlength="16" autocomplete="off"/>
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

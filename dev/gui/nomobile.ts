import DomElement from "../helpers/domelement";

export default class NoMobile extends DomElement {
    constructor() {
        super('nomobile', -1, -1);
        this.el.classList.add('modal', 'is-active');
        this.renderTemplate();
    }

    /**
     * Template needed to show more elements
     */
    private renderTemplate(): void {
        this.el.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="message is-warning">
                    <div class="message-header">Whoops! No support yet..</div>
                    <div class="message-body">
                        Currently this game is not playable on touch devices. Please use your desktop keyboard to enter the competition and set a perfect high score!
                    </div>
                </div>
            </div>
        `;
    }
}

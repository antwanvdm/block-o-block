class GUI extends DomElement {
    private score: Score;
    private messageScreen: MessageScreen;

    constructor() {
        super('gui', 0, 0);

        this.score = new Score();
        this.messageScreen = new MessageScreen();

        window.addEventListener('level:scoreUpdate', (e) => this.score.update((e as CustomEvent).detail.score));
        ['level:success', 'level:failed'].map((eventType) => {
            window.addEventListener(eventType, (e) => this.messageScreen.show(e.type));
        });
    }

    public newLevel() {
        this.messageScreen.hide();
    }
}

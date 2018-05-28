export default class DomElement {
    protected el: HTMLElement;
    protected x: number;
    protected y: number;

    constructor(type: string, x: number, y: number, parentClass: string = '') {
        this.x = x;
        this.y = y;

        this.el = document.createElement('div');
        let main = document.getElementById('main');
        if (main === null) {
            throw new Error("<main> element doesn't exist!");
        }

        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.el.classList.add(type);

        if (parentClass === '') {
            main.appendChild(this.el);
        } else {
            let parentEl = document.querySelector(`.${parentClass}`);
            if (parentEl === null) {
                throw new Error(`<.${parentClass}> element doesn't exist!`);
            }
            parentEl.appendChild(this.el);
        }
    }

    /**
     * @returns ClientRect
     */
    public getClientReact() {
        return this.el.getBoundingClientRect();
    }
}

export default class Utils {
    /**
     * @returns {string}
     */
    static getRandomColor(): string {
        let o = Math.round, r = Math.random, s = 255;
        return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)},1)`;
    }

    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @param {ClientRect} a
     * @param {ClientRect} b
     * @returns {boolean}
     */
    static checkCollision(a: ClientRect, b: ClientRect): boolean {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
}

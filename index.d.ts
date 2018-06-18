declare module "*.json" {
    const value: any;
    export default value;
}

declare module "bad-words" {
    export default class Filter {
        constructor(params?: {});

        clean(word: string): string;

        replaceWord(word: string): string;

        isProfane(word: string): boolean;

        isProfaneLike(word: string): boolean;

        addWords(word: string[]): void;

        removeWords(word: string[]): void;
    }
}

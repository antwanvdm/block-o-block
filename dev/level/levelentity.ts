/**
 * Simple interface which all level entities need to follow
 */
export default interface LevelEntity {
    update(): void;

    destroy(param?: any): void;
}

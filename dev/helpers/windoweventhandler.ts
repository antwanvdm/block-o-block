export default class WindowEventHandler {
    private static functionMap: { [k: string]: any } = {};

    /**
     * Add listener to window with name spacing
     *
     * @param {string} event
     * @param func
     */
    public static addEventListener(event: string, func: any): void {
        WindowEventHandler.functionMap[event] = func;
        window.addEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
    }

    /**
     * Remove listener from window with name spacing
     *
     * @param {string} event
     */
    public static removeEventListener(event: string): void {
        window.removeEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
        delete WindowEventHandler.functionMap[event];
    }
}

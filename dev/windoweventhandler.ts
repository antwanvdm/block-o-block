class WindowEventHandler {
    private static functionMap: { [k: string]: any } = {};

    public static addEventListener(event: string, func: any) {
        WindowEventHandler.functionMap[event] = func;
        window.addEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
    }

    public static removeEventListener(event: string) {
        window.removeEventListener(event.split('.')[0], WindowEventHandler.functionMap[event]);
        delete WindowEventHandler.functionMap[event];
    }
}

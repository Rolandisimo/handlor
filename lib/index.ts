/**
 * Enum for listener types
 */
export enum Type {
    Timeout = "timeout",
    Interval = "interval",
    RequestAnimationFrame = "requestAnimationFrame",
}

/**
 * TODO: Allow dynamic types based on listener type
 * e.g. "interval" will give you only timeOutInMs for options
 */
// /**
//  * For Timeouts and Intervals
//  */
// export interface WithTimeoutListenerOptions {
//     [key: string]: any;
//     timeoutInMs?: number;
// }

// /**
//  * For requestAnimationFrames and addEventListeners
//  */
// export interface DefaultListenerOptions {
//     [key: string]: any;
//     listenerNode?: HTMLElement | Window;
// }
// /**
//  * Typeguard to differentiate options type in a scope
//  */
// function isTimeoutOrInterval(
//     options: WithTimeoutListenerOptions | DefaultListenerOptions
// ): options is WithTimeoutListenerOptions {
//     return options && options.timeoutInMs;
// }

// Until the above TODO is resolved
interface TempListenerOptions {
    [key: string]: any;
    listenerNode?: HTMLElement | Window;
    timeoutInMs?: number;
}

/**
 * Stored Listener Interface
 */
interface StoredListener {
    type: Type | string;
    callback?: () => void;
    id?: number; // for intervan,timeout,animFrame clearing
    options?: TempListenerOptions;
    addEventListenerOptions?: boolean | AddEventListenerOptions;
}

type StoredListeners = { [key: number]: StoredListener }
/**
 * Interface for adding a listener
 */
export interface Handle {
    type: Type | string;
    callback: () => void;
    options?: TempListenerOptions;
    addEventListenerOptions?: boolean | AddEventListenerOptions;
}

/**
 * Main class to handle listeners
 */
export class Handlor {
    public readonly listeners: StoredListeners = {};
    
    /**
     * Registers listeners and returns their IDs
     */
    public registerHandles(data: Handle | Handle[]): number[] {
        const keys = [];

        if (Array.isArray(data)) {
            // handle multiple collects
            for (const handle of data) {
                keys.push(this.addEvent(handle));
            }
        } else {
            keys.push(this.addEvent(data));
        }

        return keys;
    };

    private addEvent(handle: Handle) {
        let eventId = Math.random() * 99999; // FIXME use a util func

        const {
            type,
            callback,
            options,
            addEventListenerOptions,
        } = handle;

        

        /**
         * Determine type of event to add
         * Register the listeners and save
         * them in the listeners object
         */

        switch(type) {
            case Type.Timeout: {
                const id = setTimeout(
                    callback,
                    (options && options.timeoutInMs) || 0,
                    ...(options && options.params ? options.params : []),
                );

                this.listeners[eventId] = {
                    type: Type.Timeout,
                    id,
                }

                break;
            }
            case Type.Interval: {
                const id = setInterval(
                    callback,
                    (options && options.timeoutInMs) || 0,
                    ...(options && options.params ? options.params : []),
                );

                this.listeners[eventId] = {
                    type: Type.Interval,
                    id,
                }

                break;
            }
            case Type.RequestAnimationFrame: {
                const id = window.requestAnimationFrame(callback);

                this.listeners[eventId] = {
                    type: Type.RequestAnimationFrame,
                    id,
                }

                break;
            }
            default: {
                // Handle all addEventListener cases
                (
                    (options && options.listenerNode)
                    || window
                ).addEventListener(type, callback, addEventListenerOptions);

                this.listeners[eventId] = {
                    type,
                    callback,
                    options,
                }
            }
        }

        // return id of the collected item. USed to clean a specific handler with this.clear
        return eventId;
    };

    public cleanAll() {
        /*
        * determine type
        * 1. eventListener can have options
        * 2. interval has timeout
        * 3. timeout has timeout
        * 4. requestAnimationFrame
         */
        for (let listener in this.listeners) {
            if (this.listeners.hasOwnProperty(listener)) {
                this.cleanItem(listener);
            }
        }
    };

    public cleanItems(keys: string[]) {
        for (const key of keys) {
            this.cleanItem(key);
        }
    }

    public cleanItem(key: string): Error | void {
        const item = this.listeners[key];
        if (!item) {
            return new Error("No such listener key registered");
        }

        const {
            type,
            id,
            callback,
            options,
        } = item;

        switch(type) {
            case Type.Timeout: {
                clearTimeout(id);
                break;
            }
            case Type.Interval: {
                clearInterval(id);
                break;
            }
            case Type.RequestAnimationFrame: {
                (
                    (options && options.listenerNode)
                    || window
                ).cancelAnimationFrame(id);
                break;
            }
            default: {
                (
                    (options && options.listenerNode)
                    || window
                ).removeEventListener(type, callback);
            }
        }

        delete this.listeners[key];
    };
}

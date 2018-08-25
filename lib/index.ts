/**
 * Author: Rolands Jegorovs
 * Date: 01.08.18
 * Description: Class for handling listeners, timeouts and frames globaly
 */

export enum Type {
    Timeout = "timeout",
    Interval = "interval",
    RequestAnimationFrame = "requestAnimationFrame",
    Default = "", // any other addEventListener
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
export interface TempListenerOptions {
    [key: string]: any;
    listenerNode?: HTMLElement | Window;
    timeoutInMs?: number;
}

/**
 * Listener Interface
 */
export interface Listener {
    type: Type;
    callback?: () => void;
    id?: number; // for intervan,timeout,animFrame clearing
    options?: TempListenerOptions;
    addEventListenerOptions?: boolean | AddEventListenerOptions;
}

export type Listeners = { [key: number]: Listener }
export type Handle = Pick<Listener, "type" | "callback" | "options" | "addEventListenerOptions">

export class Equalizer {
    listeners: Listeners = {};
    
    registerHandles(data: Handle | Handle[]): number[] | number {
        if (Array.isArray(data)) {
            // handle multiple collects
            const keys = [];
            for (const handle of data) {
                keys.push(this.addEvent(handle));
            }

            return keys;
        } else {
            return this.addEvent(data);
        }
    };

    addEvent(handle: Handle) {
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

    cleanAll() {
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

    cleanItems(keys: string[]) {
        for (const key of keys) {
            this.cleanItem(key);
        }
    }

    cleanItem(key: string): Error | void {
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

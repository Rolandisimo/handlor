/**
 * Author: Rolands Jegorovs
 * Date: 01.08.18
 * Description: Class for handling listeners, timeouts and frames globaly
 */
export class Equalizer {
    constructor(props) {
        super(props);
        this.listeners = {
            /**
            * Contains listeners in the following form
            * {
            *      type: Enum;
            *      callback?: () => void;
            *      id?: number; // for intervan,timeout,animFrame clearing
            *      options?: {
            *         listenerNode?: document.body,
            *         listenerOptions? { for addEventListener e.g.},
            *         //...define other possible options
            *      },
            *  },
            */
        };
    }
    
    registerHandles(data) {
        if (Array.isArray(data)) {
            // handle multiple collects
            const keys = [];
            for (const handle of data) {
                keys.push(this.addEvent(handle));
            }

            return keys;
        } else {
            this.addEvent(data);
        }
    };

    addEvent(data) {
        let eventId = Math.random() * 99999; // FIXME use a util func

        const {
            type,
            callback,
            options,
        } = data;

        /**
         * Determine type of event to add
         * Register the listeners and save
         * them in the listeners object
         */

        switch(type) {
            case "timeout": {
                const id = setTimeout(
                    callback,
                    (options && options.timeout) || 0,
                    ...(options && options.params ? options.params : []),
                );

                this.listeners[eventId] = {
                    type: "timeout",
                    id,
                }

                break;
            }
            case "interval": {
                const id = setInterval(
                    callback,
                    (options && options.timeout) || 0,
                    ...(options && options.params ? options.params : []),
                );

                this.listeners[eventId] = {
                    type: "interval",
                    id,
                }

                break;
            }
            case "requestAnimationFrame": {
                const id = (
                    (options && options.listenerNode)
                    || window
                ).requestAnimationFrame(callback);

                this.listeners[eventId] = {
                    type: "requestAnimationFrame",
                    id,
                }

                break;
            }
            default: {
                // for addEventListener
                // TODO: Handle options 
                (
                    (options && options.listenerNode)
                    || window
                ).addEventListener(type, callback, options);

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

        console.log("Cleaned all", this.listeners)
    };

    cleanItems(keys) {
        for (const key of keys) {
            this.cleanItem(key);
        }
    }

    cleanItem(key) {
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
            case "timeout": {
                clearTimeout(id);
                break;
            }
            case "interval": {
                clearInterval(id);
                break;
            }
            case "requestAnimationFrame": {
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

import { uniqueID } from "./utils";

export function Equalizer() {
    this.listeners = {
        // //... [key: type]: callback
        // /**
        //     wont work like this
        // needs to be an array of objects
        // {
        //     type: Enum;
        //     callback?: () => void;
        //     id?: number; // for intervan,timeout,animFrame clearing
        //     options?: {
        //     listenerNode?: document.body,
        //     listenerOptions? {},
        //     //... define other possible options
        //     },
        // },

        // [
        //     {
        //         type: "click",
        //     callback: () => {},
        //     options: {
        //         listenerNode: document.body,
        //     },
        //     },
        //     {

        //     }
        //     ...
        // ]

        // */
        // 1: {
        //     type: "onmouse",
        //     callback: () => {},
        //     options: {
        //         listenerNode: document.body,
        //     },
        // },
        // 2: {
        //     type: "interval",
        //     id: 123,
        // },
        // 3: {
        //     type: "requestAnimationFrame",
        //     callback: () => {},
        //     options: {
        //         //... some options
        //     },
        // },
        // 4: {
        //     callback: () => {},
        // },
        // 5: {
        //     type: "timeout",
        //     id: 53
        // },
    };
    this.registerHandles = function(data) {
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

    this.addEvent = function(data) {
        let eventId = uniqueID(); // FIXME

        const {
            type,
            callback,
            options,
        } = data;

        // determine what it is
        // add the listener to listeners list
        // register the listene

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
                ).requestAnimationFrame(callback).addEventListener(type, callback, options);

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

    this.cleanAll = function() {
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

    this.cleanItem = function(key) {
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

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
        1: {
            type: "onmouse",
            callback: () => {},
            options: {
                listenerNode: document.body,
            },
        },
        2: {
            type: "interval",
            id: 123,
        },
        3: {
            type: "requestAnimationFrame",
            callback: () => {},
            options: {
                //... some options
            },
        },
        4: {
            callback: () => {},
        },
        5: {
            type: "timeout",
            id: 53
        },
    };
    this.collect = function() {
        // determine what it is
        // add the listener to listeners list
        // register the listener
        // return id of the collected item
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
                let listenerNode = window;
                if (options && options.listenerNode) {
                    listenerNode = options.listenerNode;
                }
                listenerNode.cancelAnimationFrame(id);
                break;
            }
            default: {
                // for addEventListener
                let listenerNode = window;
                if (options && options.listenerNode) {
                    listenerNode = options.listenerNode;
                }

                listenerNode.removeEventListener(type, callback);
            }
        }
    };
}

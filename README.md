# event-handler

Handle events globally across your app and manage in one convenient place.
Eliminate code duplication, make maintaining easier.

`npm i event-handler`
or
`yarn i event-handler`

## Example of usage
```typescript
/* Create instance and make it globally */
window.equalizer = new Equalizer();
```

### Interval/Timeout
```typescript
equalizer.registerHandles({
    /**
     * Use Type enum or simply default listener names
     * e.g. interval, requestAnimationFrame, etc 
     */
    type: Type.Interval, // or Type.Timeout (interval/timeout)
     /**
     * Specify options such as timeout in ms for
     * intervals and timeouts or any other args for
     * the aforementioned listener types
     */
    callback: () => { /* whoosh */},
    options: {
        timeoutInMs: 1000,
    }
})
```

### RequestAnimationFrame
```typescript
// interval (same as timeout)
equalizer.registerHandles({
    /**
     * Use Type enum or simply default listener names
     * e.g. interval, requestAnimationFrame, etc 
     */
    type: Type.RequestAnimationFrame,
     /**
     * Specify options such as timeout in ms for
     * intervals and timeouts or any other args for
     * the aforementioned listener types
     */
    callback: () => { /* whoosh */},
    options: {
        listenerNode: htmlElement, // defaults to window
    }
})
```

### AddEventListener
```typescript
// interval (same as timeout)
equalizer.registerHandles({
    /**
     * Use Type enum or simply default listener names
     * e.g. interval, requestAnimationFrame, etc 
     * 
     * Optional for addEventListener. Defaults to this
     * type of listener
     */
    type: "click", // any event listener name
     /**
     * Specify options such as timeout in ms for
     * intervals and timeouts or any other args for
     * the aforementioned listener types
     */
    callback: () => { /* whoosh */},
    options: {
        listenerNode: htmlElement, // defaults to window
    }
})
```

### Cleaning events
```typescript
/**
 * addEvent returns id of the event which later can be used for clearing a specific item`
 */
window.equalizer.cleanItem(id);

/**
 * Similarly clean several items at once
 */

window.equalizer.cleanItems([id1, id2, id3]);

/**
* Clean all items.
* ⚠️ Careful as this will erase all listeners currently active in the app
*/
window.equalizer.cleanAll();
```

### Checking registered listeners
`window.equalizer.listeners // { {}, {} }`

## API
| Method | Description | Input |
| --- | --- | --- |
| registerHandles | List all new or modified files | Single entry or an array of objects |
| cleanAll | Removes all listeners from the instance storage | N/A |
| cleanItem | Removes a specific item from the storage | id |
| cleanItems | Removes an array of specific item from the storage | [id1, id2] |

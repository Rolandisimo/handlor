# Handlor

Sir Handlor will assist you with 
handling events globally across your app and manage in one convenient place.
Eliminate code duplication, make maintaining easier.

`npm i handlor`
or
`yarn i handlor`

## Example of usage
```typescript
import { Handlor } from "handlor"; 
/* Create instance and make it globally */
window.handlor = new Handlor();
```

### Interval/Timeout
```typescript
handlor.registerHandles({
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
handlor.registerHandles({
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
handlor.registerHandles({
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
window.handlor.cleanItem(id);

/**
 * Similarly clean several items at once
 */

window.handlor.cleanItems([id1, id2, id3]);

/**
* Clean all items.
* ⚠️ Careful as this will erase all listeners currently active in the app
*/
window.handlor.cleanAll();
```

### Checking registered listeners
`window.handlor.listeners // { {}, {} }`

## API
| Method | Description | Input |
| --- | --- | --- |
| registerHandles | List all new or modified files | Single entry or an array of objects |
| cleanAll | Removes all listeners from the instance storage | N/A |
| cleanItem | Removes a specific item from the storage | id |
| cleanItems | Removes an array of specific item from the storage | [id1, id2] |

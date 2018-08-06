import { Equalizer, Type } from "../lib/index";

describe("Equalizer test", () => {
    it("should add listener to listeners object", () => {
        const equalizer = new Equalizer();
        const callback = jest.fn();

        expect(equalizer.listeners).toEqual({});
        const id = equalizer.addEvent({
            type: Type.Interval,
            callback,
        });

        expect(Object.keys(equalizer.listeners)).toHaveLength(1);
        expect(equalizer.listeners[id]).toEqual({
            type: Type.Interval,
            id: 2,
        });
    });
});

import { Handlor, Type } from "../lib/index";

describe("Handlor test", () => {
    it("should add listener to listeners object", () => {
        const handlor = new Handlor();
        const callback = jest.fn();

        expect(handlor.listeners).toEqual({});
        const ids = handlor.registerHandles({
            type: Type.Interval,
            callback,
        });

        expect(Object.keys(handlor.listeners)).toHaveLength(1);
        for (let id in ids) {
            expect(handlor.listeners[ids[id]]).toEqual({
                type: Type.Interval,
                id: 2,
            });
        }
    });
});

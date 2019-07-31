import {getChildTrees} from "./GoldenBodyPainter";
import {getAllKeysExceptStylesAndOps} from "../define/CascadingProperties";

describe("GoldenBodyPainter", () => {
    let subtree: any;

    beforeEach(() => {
        subtree = {
            a: 1,
            b: {x: 1},
            c: "c",
            drawCircle: true,
            fillCircle: "black",
            fillStyle: "blue",
            lineWidth: 2,
        };
    });

    it("getAllKeysExceptStylesAndOps returns all keys except those used for styling and painting", () => {
        const childKeys: any[] = getAllKeysExceptStylesAndOps(subtree);
        expect(childKeys.length).toBe(3);
        expect(childKeys[0]).toBe("a");
        expect(childKeys[1]).toBe("b");
        expect(childKeys[2]).toBe("c");
    });

    it("getChildTrees", () => {
        const childTrees = getChildTrees(subtree);
        expect(childTrees.length).toBe(3);
        expect(childTrees[0]).toBe(1);
        expect(childTrees[1]).toEqual({x: 1});
        expect(childTrees[2]).toBe("c");
    });
});
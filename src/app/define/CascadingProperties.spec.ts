import {CANVAS_STYLE_PROPERTIES, CascadingProperties, PAINT_OPERATIONS} from "./CascadingProperties";

describe("CascadingProperties", () => {

    let cascadingProperties: CascadingProperties;

    beforeEach(() => {
        cascadingProperties = new CascadingProperties();
    });


    describe("getCascadingCanvasStyles", () => {
        it("Evaluates cascading canvas style property values", () => {

            const source = {
                styles: {
                    fillStyle: "1-blue",
                    child: {
                        fillStyle: "2-red",
                        child: {
                            strokeStyle: "green"
                        }
                    }
                }
            };
            const path = "styles.child.child";
            const result: any = cascadingProperties.getCascadingCanvasStyles(path, source);

            expect(result.fillStyle).toBe("2-red");
            expect(result.strokeStyle).toBe("green");
        });
    });

    describe("getCascadingPaintOperations", () => {
        it("Evaluates cascading paint operation property values", () => {

            const source = {
                paintOps: {
                    fillCircle: "1-blue",
                    child: {
                        drawPentagon: "2-red",
                        child: {
                            fillPentagon: "green",
                            drawPentagon: "2-blue"
                        }
                    }
                }
            };
            const path = "paintOps.child.child";
            const result: any = cascadingProperties.getCascadingPaintOperations(path, source);

            expect(result.fillCircle).toBe("1-blue");
            expect(result.fillPentagon).toBe("green");
            expect(result.drawPentagon).toBe("2-blue");
        });
    });


    describe("mergeProperties", () => {
        it("merges properties from a source object into a target object", () => {

            const result: any = cascadingProperties.mergeProperties(
                {
                    question: "will this value get erased?",
                    otherQuestion: "will this value get erased?",

                    fillCircle: "before",
                    drawPentagon: "before",
                },
                {
                    question: null,

                    fillCircle: "new operation",
                    drawPentagon: "draw pentagon",

                    ignore: "should ignore this property",
                },
                PAINT_OPERATIONS
            );

            expect(result.question).toBe("will this value get erased?");
            expect(result.question).toBe("will this value get erased?");
            expect(result.fillCircle).toBe("new operation");
            expect(result.drawPentagon).toBe("draw pentagon");
            expect(result.ignore).toBe(undefined);
        });
    });

    describe("extractProperties", () => {
        it("picks properties by name from a source object", () => {

            const result: any = cascadingProperties.extractProperties(
                {
                    ignore: "should ignore this property",

                    strokeStyle: "new stroke style",
                    fillStyle: "fill style",
                    lineWidth: "line width",
                    lineJoin: "line join",
                    lineDash: "line-dash",

                    other: "should also ignore this property",
                    properties: null,
                    two: 2
                },
                CANVAS_STYLE_PROPERTIES
            );

            expect(result['ignore']).toBe(undefined);
            expect(result.strokeStyle).toBe("new stroke style");
            expect(result.fillStyle).toBe("fill style");
            expect(result.lineWidth).toBe("line width");
            expect(result.lineJoin).toBe("line join");
            expect(result.lineDash).toBe("line-dash");
            expect(result['other']).toBe(undefined);
        });

        describe("getPathValues", () => {
            it("maps path to values of that path from a source object", () => {

                const source = {
                    styles: {
                        fillStyle: "1-blue",
                        child: {
                            fillStyle: "2-red",
                            child: {
                                strokeStyle: "green"
                            }
                        }
                    }
                };
                const paths = [
                    "styles",
                    "styles.child",
                    "styles.child.child",
                ];
                const result = cascadingProperties.getPathValues(paths, source);

                expect(result[0]).toEqual({
                        fillStyle: "1-blue",
                        child: {
                            fillStyle: "2-red",
                            child: {
                                strokeStyle: "green"
                            }
                        }
                    }
                );
                expect(result[1]).toEqual({
                    fillStyle: "2-red",
                    child: {
                        strokeStyle: "green"
                    }
                });
                expect(result[2]).toEqual({
                    strokeStyle: "green"
                });
            });
        });

        describe("getAllSubPaths", () => {
            it("gets all sub paths from a path", () => {

                const result: string[] = cascadingProperties.getAllSubPaths("a.b.c.etc.etc");

                expect(result.length).toBe(5);
                expect(result[0]).toBe("a");
                expect(result[1]).toBe("a.b");
                expect(result[2]).toBe("a.b.c");
                expect(result[3]).toBe("a.b.c.etc");
                expect(result[4]).toBe("a.b.c.etc.etc");
            });
        });
    });
});
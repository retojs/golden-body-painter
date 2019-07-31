import * as R from "ramda";

export const CANVAS_STYLE_PROPERTIES = [
    "strokeStyle",
    "fillStyle",
    "lineWidth",
    "lineJoin",
    "lineDash",
];

export interface CanvasStyles {
    strokeStyle?: string;
    fillStyle?: string;
    lineWidth?: string;
    lineJoin?: string;
    lineDash?: string;
}

export const PAINT_OPERATIONS = [
    "fillCircle",
    "drawCircle",
    "fillPentagram",
    "drawPentagram",
    "fillPentagon",
    "drawPentagon",
];

export interface PaintOperations {
    fillCircle?: string;
    drawCircle?: string;
    fillPentagram?: string;
    drawPentagram?: string;
    fillPentagon?: string;
    drawPentagon?: string;
}

export function getAllKeysExcept(exclude, source) {
    return Object.keys(source).filter(key => exclude.indexOf(key) < 0);
}

export function getAllKeysExceptStylesAndOps(source) {
    return getAllKeysExcept([
        ...CANVAS_STYLE_PROPERTIES,
        ...PAINT_OPERATIONS
    ], source);
}

export class CascadingProperties {

    /**
     * Returns {
     *      fillStyle: "red",
     *      strokeStyle: "green"
     * }
     * for input path = "styles.child.child"
     * and input source = {
     *      styles: {
     *          fillStyle: "blue",
     *          child: {
     *              fillStyle: "red",
     *              child: {
     *                  strokeStyle: "green"
     *              }
     *          }
     *      }
     * }
     */
    getCascadingCanvasStyles(path: string, source: any): any {
        return this.getCascadingProperties(path, source, CANVAS_STYLE_PROPERTIES);
    }

    getCascadingPaintOperations(path: string, source: any): any {
        return this.getCascadingProperties(path, source, PAINT_OPERATIONS);
    }

    getCascadingProperties(path: string, source: any, propertyNames: string[]): any {
        return this.getPathValues(this.getAllSubPaths(path), source)
            .reduce((result, pathValue) =>
                    this.mergeProperties(result, pathValue, propertyNames)
                , []);
    }

    mergeProperties(target: any, source: any, propertyNames: string[]) {
        return {
            ...target,
            ...this.extractProperties(source, propertyNames)
        };
    }

    /**
     * Alternative project function
     * (Ramda.project sets all missing properties to undefined...)
     */
    extractProperties(source: any, propertyNames: string[]): any {
        return propertyNames.reduce((result, propName) => {
                if (source[propName] != null) {
                    result[propName] = source[propName];
                }
                return result;
            },
            {}
        );
    }

    /**
     * Returns [1, 2]
     * for input paths = ["a.b", "a.c"]
     * and input source = { a: { b: 1, c: 2 }}
     */
    getPathValues(paths: string[], source: any) {
        return paths.map(path => R.path(path.split("."), source));
    }

    /**
     * Returns ["a", "a.b", "a.b.c"] for input path "a.b.c".
     */
    getAllSubPaths(path: string): string[] {
        return (path || "")
            .split(".")
            .reduce((allSubPaths, pathItem) => [
                    ...allSubPaths,
                    allSubPaths.length > 0
                        ? allSubPaths[allSubPaths.length - 1] + "." + pathItem
                        : pathItem
                ]
                , []);
    }
}


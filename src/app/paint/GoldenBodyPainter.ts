import * as R from "ramda";
import {PaintPathSequence} from "./paint-path-sequence";
import {getAllKeysExceptStylesAndOps} from "../define/CascadingProperties";

export class GoldenBodyPainter {
    // takes a list of paths
    // and paints the subtree of penta elements of each
    // assigning to each the cascading styles from the style tree

    constructor(private pentaTree: any,
                private styleTree: any) {
    }
}

function paint(pathSequence: PaintPathSequence) {
    (pathSequence || [])
        .map(path => getSubtree(path, {}))
        .forEach(subtree => getChildTrees(subtree)
            .filter(value => value.isPenta)

        )
}

function paintPentas(...pentas){
    pentas.forEach(paintPenta)
}

function paintPenta(ops, styles, penta){}

export function getChildTrees(subtree: any): any[] {
    return getAllKeysExceptStylesAndOps(subtree).map(key => subtree[key]);
}

export function getSubtree(path: string, tree: any): any {
    return R.path(path.split("."), tree);
}


import { Penta } from "./Penta";
/**
 * @param center: The upper pentas' centers' position
 * @param radius: The upper large* penta's radius (* or: outer, blue)
 * @param angle:  All pentas' default angle
 * @param style: style configuration
 */
import { createPentaTree } from "./GoldenBodyPentaTreeBuilder";

export function GoldenBody(center, radius, angle, ps) {

    this.center = center;
    this.radius = radius;
    this.angle  = angle || 0;

    this.root = new Penta(this.center, this.radius, this.angle);

    createPentaTree(this);
}

GoldenBody.prototype.getPentaSubtree = function (propertyPathArray) {
    if (!propertyPathArray) return;
    let subtree = this.pentaTree;
    propertyPathArray.forEach((prop) => subtree = subtree ? subtree[prop] : undefined);
    return subtree;
};


GoldenBody.prototype.initCongruentEdges = function (penta) {

    GoldenContext.get().visiblePentas
        .forEach(penta => penta.getPs()
            .forEach((p, index) => GoldenContext.get().visiblePentas
                .forEach(otherPenta => {
                    let congruentEdges = otherPenta.getEdgesAtPos(p);
                    congruentEdges.forEach(edge => {
                        if (edge.penta.congruentGroups[index]) {
                            penta.congruentGroups[index] = edge.penta.congruentGroups[index];
                        } else {
                            let nextIndex                = 98;//??
                            penta.congruentGroups[index] = nextIndex;
                        }
                    });
                })
            )
        );

    // for each edge: traverse tree and search for edges within 5% of the penta's radius
    // these are "congruent" and if moved should not separate.

    // goal:
    //   for each edge that has moved also move the congruent edges
    // move how?
    //   proposal: move all congruent edges to the center of gravity
    //             except those edges that are grabbed with the mouse (they should just follow the mouse)

    // algorithm:
    //   grab edges
    //   move edges
    //   for each moving edge that is not grabbed (hitPos):
    //     move to center of gravity

    // data structure to access congruent edges for each edge:
    //   each edge belongs into a congruent group.
    //   each of these groups has an index.
    //   to find all edges in the same group
    //   find all edges with the same index.
    // -> 1. each edge has its index (Penta.congruentGroups[0-->a, 1-->b, 2-->c, 3-->d, 4-->e])
    // -> there is a mapping from index to list of pis (GoldenBody.congruentEdges[indey -> [...edges]])

    // setup this datastructure
    //   for each edge of each penta:
    //   traverse penta tree and call getEdgesAtPos(pos, radius)
    //   if that edge already belongs to a group:
    //     add this penta to the same group.
    //   otherwise:
    //     create the next group and add it there.
    //   invariant: every edge will belong to a group
};

GoldenBody.prototype.getPentaSubtreeWithWildcards = function (propertyPathArray) {
    if (!propertyPathArray) return;
    let subtree = this.pentaTree;
    return subtree;
}
/**
 * creates a list of matching paths for the specified wildcard path.
 *
 * @param propertyPathArray: a property path containing wildcards
 */
GoldenBody.prototype.expandWildcards = function (tree, propertyPathArray) {
    let matchingPaths = [];
    matchPathRecursively(this.pentaTree, "", propertyPathArray);

    /**
     * With a wildcard as the last property in the path the complete subtree matches.
     * With a wildcard in the middle of the path we need to look for the property after the wildcard in the path.
     */
    function matchPathRecursively(subtree, currentTraversedPath, remainingPathExpression, wildcard) {
        let wildcardRemaining = remainingPathExpression[0] === "*";
        let lastPathProperty  = remainingPathExpression.length === 1;
        let pathTerminated    = remainingPathExpression.length === 0;
        let childKeys         = Object.keys(subtree);
        let hasChildKeys      = childKeys.length > 0;


        if (pathTerminated) {
            matchingPaths.push(currentTraversedPath);
            return;
        }
        if (wildcardRemaining) {
            if (lastPathProperty) {
                subtreeToPathArray(subtree, currentTraversedPath) // the whole subtree is a match
                return;
            } else {

                wildcard = true;

                // check for the subsequent property anywhere in the path
                // then continue with the remainingPathExpression
                Object.keys(subtree).forEach((key) => {
                    // The current path is still valid if it either matches the next path property
                    if (key.toLowerCase() === remainingPathExpression[0].toLowerCase()) {
                        matchPathRecursively(subtree[key], currentTraversedPath.concat(key), remainingPathExpression.slice(1), wildcard);
                    }
                });
            }
        }
    }

    function subtreeToPathArray(subtree) {
        return Object.keys(subtree).reduce((pathArray, key) => {
            // TODO
            return pathArray;
        });
    }
}

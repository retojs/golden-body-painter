/**
 *  # Cascading Style Configuration
 *
 *  A style configuration object contains properties of the CanvasRenderingContext2D.
 *
 *    style = {
 *      strokeStyle: '#f04'
 *      fillStyle: '#ffa'
 *      lineWidth: 2
 *      lineJoin: 'round'
 *    }
 *
 *  These style objects can be assigned to any path of the Golden Body Penta tree.
 *
 *    {
 *      upper: {
 *        lineWidth: 3,
 *        inner: {
 *          fillStyle: '#245233',
 *        }
 *        outer: {
 *          fillStyle: '#253434',
 *        }
 *      },
 *      lower: {
 *        inner: { ... }
 *        outer: { ... }
 *      }
 *      middle: { ... }
 *    }
 *
 *  When painting a node of the Penta tree PentaTreeStyler.applyTreeStyles() will assign all styles
 *  in the node's path in a cascading manner.
 *  I.e. more specific styles will overwrite more general styles.
 */
import { GoldenContext } from "./GoldenContext";

export function PentaTreeStyler() {
    this.styleProperties = [
        'strokeStyle',
        'fillStyle',
        'lineWidth',
        'lineJoin'
    ];
}

PentaTreeStyler.prototype.clearStyles = function () {
    let ctx         = GoldenContext.get().ctx;
    ctx.strokeStyle = "#000";
    ctx.fillStyle   = "#000";
    ctx.lineWidth   = 1;
    ctx.lineJoin    = 'round';
    ctx.setLineDash([]);
};

PentaTreeStyler.prototype.getCascadingProperties = function (tree, propertyPathArray, propertyKeys) {
    let result = {};
    let node   = tree;

    if (!node) return result;
    if (!propertyKeys) return result;

    this.assignProperties(node, result, propertyKeys);

    if (propertyPathArray && propertyPathArray.length) {
        for (let i = 0; i < propertyPathArray.length; i++) {
            if (!node) break;
            let property = propertyPathArray[i];
            node         = node[property];
            this.assignProperties(node, result, propertyKeys);
        }
    }
    return result;
};

PentaTreeStyler.prototype.assignProperties = function (source, target, propertyKeys) {
    target = target || {};

    if (!source) return target;
    if (!propertyKeys) return target;

    return Object.keys(source).reduce((result, key) => {
        if (propertyKeys.indexOf(key) > -1) {
            result[key] = source[key]
        }
        return result;
    }, target);
};

PentaTreeStyler.prototype.assignStyleProperties = function (styleProps, penta) {
    if (!styleProps) return;

    Object.keys(styleProps).forEach(key => {
        if (key === 'fillStyle' && typeof styleProps[key] === 'function') {
            GoldenContext.get().ctx[key] = styleProps[key](penta);
        }
        GoldenContext.get().ctx[key] = styleProps[key];
    });
};

/**
 * Collects the cascading style properties along the propertyPath in the specified style tree.
 */
PentaTreeStyler.prototype.applyPentaStyles = function (styleTree, propertyPathArray, penta) {
    if (!propertyPathArray) return;

    this.clearStyles();

    let styleProps = this.getCascadingProperties(styleTree, propertyPathArray, this.styleProperties);
    this.assignStyleProperties(styleProps, penta);

};

PentaTreeStyler.prototype.applySpotStyles = function (styleTree, propertyPathArray, spot) {
    if (!propertyPathArray) return;

    this.clearStyles();

    let styleProps = this.getCascadingProperties(styleTree, propertyPathArray, this.styleProperties);
    this.assignStyleProperties(styleProps, spot);
};


PentaTreeStyler.prototype.logStyles = function () {
    this.styleProperties.forEach(prop => console.log(prop, "=", GoldenContext.get().ctx[prop]));
};


/**
 * How to support wildcards in propertyPaths?
 * We need a preprocessor which searches all matching paths in the tree.
 * Then the found subtree should be rendered.
 */
PentaTreeStyler.prototype.expandWildcards = function (propertyPathArray) {
    // TODO
};

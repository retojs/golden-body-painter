import { PentaTreeStyler } from "./PentaTreeStyler";
import { GoldenContext } from "./GoldenContext";
import { PM } from "./PentaMathik";

export function PentaPainterOps() {
    this.styler = new PentaTreeStyler()
}

PentaPainterOps.prototype.opsList = ['fillCircle', 'fillPentagon', 'fillPentagram', 'fillStar', 'drawPentagon', 'drawPentagram', 'drawStar', 'drawCircle',];

/**
 * Copies all properties in the list of PentaPainterOps from the specified object into a new object.
 *
 * @param {*} obj
 */
PentaPainterOps.prototype.getOpsFrom = function (obj) {
    // TODO generic operation copyProperties
    return this.opsList.reduce((ops, op) => {
        ops[op] = obj[op];
        return ops
    }, {})
}

/**
 * Returns the styles per paint operation for the node with the specified path.
 *
 * @returns: {[key from PentaPainterOps.prototype.opsList]: style properties}
 * @param StyleTree propertyPathArray
 * @param string[] propertyPathArray
 */
PentaPainterOps.prototype.getStylesPerOp = function (styleTree, propertyPathArray) {
    return this.styler.getCascadingProperties(styleTree, propertyPathArray, this.opsList);
};

PentaPainterOps.DO_PAINT_SEGMENTS    = false;
PentaPainterOps.DO_PAINT_ORTHOGONALS = false;

PentaPainterOps.prototype.drawCircle = function (penta, style, doFill) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style || penta.style, penta);

    // ctx.beginPath(penta.x, penta.y);
    // ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);
    // ctx.stroke();

    let lastEdge = penta.p4;
    let edge     = lastEdge;
    ctx.beginPath();
    ctx.moveTo.apply(ctx, penta.p4);
    for (let i = 0; i < 5; i++) {
        edge           = penta['p' + i];
        let orthogonal = PM.orthogonal(lastEdge, edge, PM.gold_ * PM.gold_ * 0.95);
        let c1         = PM.middle(lastEdge, orthogonal.p2, PM.gold_ * 0.95);
        let c2         = PM.middle(edge, orthogonal.p2, PM.gold_ * 0.95);
        ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], edge[0], edge[1]);
        lastEdge = edge;
    }

    doFill ? ctx.fill() : ctx.stroke();

    if (PentaPainterOps.DO_PAINT_SEGMENTS) {
        for (let i = 0; i < 5; i++) {
            edge = penta['p' + i];
            ctx.moveTo(penta.x, penta.y);
            ctx.lineTo(edge[0], edge[1]);
            ctx.stroke();
        }
    }

    if (PentaPainterOps.DO_PAINT_ORTHOGONALS) {
        lastEdge = penta.p4;
        for (let i = 0; i < 5; i++) {
            edge           = penta['p' + i];
            let orthogonal = PM.orthogonal(lastEdge, edge, PM.gold_ * PM.gold_ * 0.95);
            ctx.beginPath();
            ctx.moveTo(orthogonal.p1[0], orthogonal.p1[1]);
            ctx.lineTo(orthogonal.p2[0], orthogonal.p2[1]);
            ctx.stroke();
            lastEdge = edge;
        }
    }
};

PentaPainterOps.prototype.fillCircle = function (penta, style) {
    this.drawCircle(penta, style, true);
};

PentaPainterOps.prototype.drawSimpleCircle = function (penta, style, doFill) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style || penta.style, penta);

    ctx.beginPath(penta.x, penta.y);
    ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);

    doFill ? ctx.fill() : ctx.stroke();
};

PentaPainterOps.prototype.fillSimpleCircle = function (penta, style) {
    this.drawSimpleCircle(penta, style, true);
};

PentaPainterOps.prototype.drawPentagon = function (penta, style, doFill) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style || penta.style, penta);

    ctx.beginPath();
    ctx.moveTo.apply(ctx, penta.p4);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo.apply(ctx, penta['p' + i]);
    }
    doFill ? ctx.fill() : ctx.stroke();
};

PentaPainterOps.prototype.fillPentagon = function (penta, style) {
    this.drawPentagon(penta, style, true);
}

PentaPainterOps.prototype.drawPentagram = function (penta, style) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style || penta.style, penta);

    ctx.beginPath();
    ctx.moveTo.apply(ctx, penta.p3);
    for (let i = 0; i < 10; i += 2) {
        ctx.lineTo.apply(ctx, penta['p' + i % 5]);
    }
    ctx.stroke();
};

PentaPainterOps.prototype.fillPentagram = function (penta, style) {
    let ctx  = GoldenContext.get().ctx;
    let core = penta.createCore();
    this.styler.assignStyleProperties(style || penta.style, penta);

    ctx.beginPath();
    ctx.moveTo.apply(ctx, penta.p0);
    ctx.lineTo.apply(ctx, core.p3);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo.apply(ctx, penta['p' + i]);
        ctx.lineTo.apply(ctx, core['p' + (i + 3) % 5]);
    }
    ctx.fill();
};

PentaPainterOps.prototype.drawStar = function (penta, style) {
    let ctx  = GoldenContext.get().ctx;
    let core = penta.createCore();
    this.styler.assignStyleProperties(style || penta.style, penta);

    ctx.beginPath();
    ctx.moveTo.apply(ctx, penta.p0);
    ctx.lineTo.apply(ctx, core.p3);
    for (let i = 0; i < 5; i++) {
        ctx.lineTo.apply(ctx, penta['p' + i]);
        ctx.lineTo.apply(ctx, core['p' + (i + 3) % 5]);
    }
    ctx.lineTo.apply(ctx, penta.p0);
    ctx.stroke();
};

PentaPainterOps.prototype.fillStar = function (penta, style) {
    this.fillPentagram(penta, style);
};

PentaPainterOps.prototype.drawLargeInnerDiamond = function (pentaTree, style) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style);

    const innerUpper  = pentaTree.inner.upper;
    const innerLower  = pentaTree.inner.lower;
    const middleUpper = pentaTree.middle.upper;

    ctx.beginPath();
    this.lineTo(innerUpper, 0, true);
    this.lineTo(innerUpper, 2);
    this.lineTo(innerUpper, 4);
    this.lineTo(innerLower, 2);
    this.lineTo(innerUpper, 0);
    ctx.fill()
    ctx.stroke();
};

PentaPainterOps.prototype.drawSmallInnerDiamond = function (pentaTree, style) {
    let ctx = GoldenContext.get().ctx;
    this.styler.assignStyleProperties(style);

    const coreInnerUpper = pentaTree.cores.inner.upper;
    const innerLower     = pentaTree.inner.lower;
    const middleUpper    = pentaTree.middle.upper;

    ctx.beginPath();
    this.lineTo(coreInnerUpper, 2, true);
    this.lineTo(innerLower, 0);
    this.lineTo(innerLower, 2);
    this.lineTo(innerLower, 4);
    this.lineTo(coreInnerUpper, 2);
    ctx.fill()
    ctx.stroke();
};

PentaPainterOps.prototype.lineTo = function (penta, index, moveTo) {
    let ctx = GoldenContext.get().ctx;
    let x   = penta['p' + index][0];
    let y   = penta['p' + index][1];
    if (moveTo) {
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
    }
}

/**
 * Returns a promise that is resolved when the background image's onload event occurs.
 */
PentaPainterOps.prototype.paintBgrImage = function (url, ctx) {
    let bgrImage = new Image();
    bgrImage.src = url;

    /**
     * A new Promise is created from an executor function
     * with two callback function arguments (resolve, reject).
     * In the executor function body you subscribe these callbacks
     * to any asynchronous events in the future.
     *
     * The Promise's then() method can be used to subscribe to resolve() and reject().
     */
    return new Promise((resolve, reject) => {
        bgrImage.onload = () => {
            if (!GoldenContext.get().hideBgrImage) {
                ctx.drawImage(bgrImage, 0, -480, GoldenContext.get().canvas.width, GoldenContext.get().canvas.width * GoldenContext.get().bgrImageProportion);
            }
            resolve();
        }
    });
};

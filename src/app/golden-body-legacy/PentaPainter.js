import { GoldenContext } from "./GoldenContext";
import { isPenta } from "./Penta";
import { createStyleTree } from "./GoldenBodyStyleTreeBuilder";
import { PentaPainterOps } from "./PentaPainterOps";

export function PentaPainter() {

    // close-up
    //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';

    // far-off
    //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';

    this.bgrImageUrl                       = 'assets/physiological-model--golden-proportion-format.png';  // image format has golden proportions
    this.bgrImageWidth                     = 900;
    this.bgrImageHeight                    = 1456;
    GoldenContext.get().bgrImageProportion = this.bgrImageHeight / this.bgrImageWidth;

    this.ops = new PentaPainterOps(GoldenContext.get().canvas);
}

/**
 * Paints each Penta of the specified Golden Body.
 * The applicable canvas styles are collected from the Golden Body's style tree (cascading).
 */
PentaPainter.prototype.paintGoldenBody = function (goldenBody) {
    console.log('paintGoldenBody', new Date());

    let ctx = GoldenContext.get().ctx;

    // ctx.setLineDash(GoldenContext.get().pentaStyles.dashes.none);
    // ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round';

    GoldenContext.get().visiblePentas = [];
    GoldenContext.get().visibleSpots  = [];

    createStyleTree(goldenBody);
    // createDiamondStyleTree(goldenBody);

    /**
     * Here we are using a Promise to wait for the background image
     * to be loaded and painted on the canvas,
     * before we're painting the penta-model on top of it.
     */
    return this.ops.paintBgrImage(this.bgrImageUrl, ctx)
        .then(() => {
            GoldenContext.get().paintOrderLines.forEach(line => {
                line = line.trim();
                if (line) {
                    if (GoldenContext.get().animationStartTime && GoldenContext.get().animateTreePath.some(path => line.indexOf(path) === 0)) {
                        return; // don't paint animated elements here if animation is running
                    }
                    if (line.indexOf('/') === 0) {
                        return;
                    }
                    if (line.indexOf('spots') === 0) {
                        this.paintSpots(goldenBody, line);
                    } else if (line.indexOf('diamonds') === 0) {
                        this.paintDiamonds(goldenBody, line);
                    } else {
                        this.paintPentaTreePath(goldenBody, line);
                    }
                }
            });
            //console.log('painter: GoldenContext.get().hitSpots=', GoldenContext.get().hitSpots);
            // this.paintHitSpots(GoldenContext.get().hitSpots, {
            //   fillStyle: 'rgba(255, 0, 255, 0.2)'
            // });
            //console.log('painter: GoldenContext.get().hoverSpots=', GoldenContext.get().hoverSpots);
            // this.paintHitSpots(GoldenContext.get().hoverSpots, {
            //   fillStyle: 'rgba(255, 0, 255, 0.1)'
            // });
        })
        .then(() => {
            this.repaint(GoldenContext.get().offscreenCanvas, true);
        })
};

PentaPainter.prototype.repaint = function (offscreenCanvas, clearCanvas) {
    const ctx = GoldenContext.get().canvas.getContext('2d');
    if (clearCanvas) {
        ctx.fillStyle = GoldenContext.get().backgroundColor;
        ctx.fillRect(0, 0, GoldenContext.get().canvasSize.width, GoldenContext.get().canvasSize.height);
    }
    ctx.drawImage(
        offscreenCanvas,
        GoldenContext.get().translate.x * GoldenContext.get().zoom,
        GoldenContext.get().translate.y * GoldenContext.get().zoom,
        GoldenContext.get().canvasSize.width * GoldenContext.get().zoom,
        GoldenContext.get().canvasSize.height * GoldenContext.get().zoom,
    );

    // this.paintKneeEllbowTorsoConnections();

    if (GoldenContext.get().doPaintBitmap && !GoldenContext.get().changing) {
        console.log('GoldenContext.get().doPaintBitmap=', GoldenContext.get().doPaintBitmap);
        this.paintBitmap();
        GoldenContext.get().doPaintBitmap = false;
    }
};

PentaPainter.prototype.paintKneeEllbowTorsoConnections = function () {
    const ctx       = GoldenContext.get().canvas.getContext('2d');
    ctx.lineWidth   = 8;
    ctx.strokeStyle = "#4f0";
    let from        = GoldenContext.get().goldenBody.pentaTree.middle.lower.p3;
    let to          = GoldenContext.get().goldenBody.pentaTree.outer.lower.p4;
    paintLine(from, to);
    from = GoldenContext.get().goldenBody.pentaTree.middle.lower.p1;
    to   = GoldenContext.get().goldenBody.pentaTree.outer.lower.p0;
    paintLine(from, to);
    from = GoldenContext.get().goldenBody.pentaTree.middle.upper.p0;
    to   = GoldenContext.get().goldenBody.pentaTree.outer.upper.p4;
    paintLine(from, to);
    from = GoldenContext.get().goldenBody.pentaTree.middle.upper.p4;
    to   = GoldenContext.get().goldenBody.pentaTree.outer.upper.p1;
    paintLine(from, to);

    function paintLine(from, to) {
        console.log("from: ", from, " , to: ", to);
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);
        ctx.stroke();
    }
};

PentaPainter.prototype.lastPaintBitmap = -1;

PentaPainter.prototype.paintBitmap = function () {
    this.lastPaintBitmap = Date.now();
    let throttleMillis   = 1200;

    setTimeout(() => {
        if (getDeltaTime(this.lastPaintBitmap) >= throttleMillis && !GoldenContext.get().changing) {
            let canvasImage                      = document.getElementById('canvas-image');
            canvasImage.src                      = 'assets/clock.png';
            GoldenContext.get().canvas.className = 'clock';
            setTimeout(() => {
                const dataURL = GoldenContext.get().canvas.toDataURL('image/png');
                const data    = atob(dataURL.substring("data:image/png;base64,".length));
                const asArray = new Uint8Array(data.length);
                for (let i = 0, len = data.length; i < len; ++i) {
                    asArray[i] = data.charCodeAt(i);
                }
                const blob                           = new Blob([asArray.buffer], {type: "image/png"});
                const urlCreator                     = window.URL || window.webkitURL;
                canvasImage.src                      = urlCreator.createObjectURL(blob);
                canvasImage.title                    = 'Right-click to download the current image';
                GoldenContext.get().canvas.className = '';
            }, 30)
        }
    }, throttleMillis);

    function getDeltaTime(refTime) {
        return Date.now() - refTime;
    }
};

PentaPainter.prototype.paintAnimation = function (pentaTree, styleTree, paintOrderArray) {
    let ctx = GoldenContext.get().ctx = GoldenContext.get().animationCanvas.getContext('2d');

    ctx.setLineDash(GoldenContext.get().pentaStyles.dashes.none);
    ctx.lineWidth = 4 * 1.75;
    ctx.lineJoin  = 'round';
    ctx.clearRect(0, 0, GoldenContext.get().canvasSize.width, GoldenContext.get().canvasSize.height);

    paintOrderArray.forEach(line => {
        let goldenBody        = {pentaTree, styleTree};
        let propertyPathArray = this.pathString2Array(line);
        if (line.indexOf('spots') === 0) {
            propertyPathArray = propertyPathArray.slice(1);
            this.paintSpotsRecursively(goldenBody, GoldenContext.get().goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
        } else {
            this.paintPentaSubtreeRecursively(goldenBody, GoldenContext.get().goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
        }
    });

    this.repaint(GoldenContext.get().animationCanvas);

    GoldenContext.get().ctx = GoldenContext.get().offscreenCanvas.getContext('2d');
};

PentaPainter.prototype.paintHitSpots = function (hitSpots, style) {
    hitSpots.forEach(spot => this.ops.fillSimpleCircle(
        {
            x     : spot.pos[0],
            y     : spot.pos[1],
            radius: 36
        },
        style
    ));
}

PentaPainter.prototype.pathString2Array = function (propertyPath) {
    if (!propertyPath) return [];
    if (Array.isArray(propertyPath)) return propertyPath;
    if (typeof propertyPath === 'string') {
        let pathArray = propertyPath.split('.');
        return Array.isArray(pathArray) ? pathArray : [pathArray];
    } else {
        throw 'PentaPainter.prototype.pathString2Array(propertyPath): Cannot handle propertyPath of type ' + (typeof propertyPath);
    }
};

//
// paint Pentas

PentaPainter.prototype.paintPentaTreePath = function (goldenBody, propertyPath) {
    let propertyPathArray = this.pathString2Array(propertyPath);
    this.paintPentaSubtreeRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
};

PentaPainter.prototype.paintPentaSubtreeRecursively = function (goldenBody, subtree, propertyPathArray) {
    subtree           = subtree || goldenBody.pentaTree;
    propertyPathArray = propertyPathArray || [];

    if (isPenta(subtree)) {
        this.paintPenta(subtree, goldenBody.styleTree, propertyPathArray);
    } else {
        Object.keys(subtree).forEach(key => {
            if (subtree[key]) {
                this.paintPentaSubtreeRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
            }
        });
    }
};

PentaPainter.prototype.paintPenta = function (penta, styleTree, propertyPathArray) {
    GoldenContext.get().visiblePentas.push(penta);

    let stylesPerOp = this.ops.getStylesPerOp(styleTree, propertyPathArray);
    this.ops.styler.applyPentaStyles(styleTree, propertyPathArray, penta);
    this.ops.opsList.forEach(op => {
        if (GoldenContext.get().animationStartTime) {
            stylesPerOp[op] = GoldenContext.get().animatePentaStyles(stylesPerOp[op], op, propertyPathArray);
        }
        if (stylesPerOp[op]) {
            this.ops[op](penta, stylesPerOp[op]);
        }
    });
    // if (penta.movingEdges && penta.movingEdges.length > 0) {
    //   penta.movingEdges.forEach(edge => this.ops.fillSimpleCircle({ x: edge[0], y: edge[1], radius: 20, style: { fillStyle: '#00f' } }));
    //   this.ops.fillSimpleCircle({ x: penta.x, y: penta.y, radius: 20, style: { fillStyle: '#0f0' } });
    // }
};

//
// paint Golden Spots

PentaPainter.prototype.paintSpots = function (goldenBody, propertyPath) {
    let propertyPathArray = this.pathString2Array(propertyPath).slice(1);
    this.paintSpotsRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
};

/**
 * Paints the Golden Spots of each Penta in the Penta Tree by calling this.paintPentaSpots(penta)
 * after having applied all the corresponding styles from the Golden Body's styles tree.
 */
PentaPainter.prototype.paintSpotsRecursively = function (goldenBody, subtree, propertyPathArray) {
    subtree           = subtree || goldenBody.pentaTree;
    propertyPathArray = propertyPathArray || [];

    if (isPenta(subtree)) {
        this.paintPentaSpots(goldenBody, subtree, propertyPathArray);
    } else {
        Object.keys(subtree).forEach(key => {
            if (subtree[key]) {
                this.paintSpotsRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
            }
        });
    }
};

/**
 * Creates a Penta for each Golden Spot by calling penta.createEdges(radius)
 * and paints these Pentas as stars with the styles defined in penta.goldenSpots.options.
 */
PentaPainter.prototype.paintPentaSpots = function (goldenBody, penta, propertyPathArray) {
    GoldenContext.get().visibleSpots.push(penta);

    let radius      = this.ops.styler.getCascadingProperties(goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;
    let spots       = penta.createEdges(radius);
    let stylesPerOp = this.ops.getStylesPerOp(goldenBody.styleTree.spots, propertyPathArray);

    spots.forEach((spot) => {
        this.ops.styler.applySpotStyles(goldenBody.styleTree.spots, propertyPathArray, spot);

        if (GoldenContext.get().animationStartTime) {
            GoldenContext.get().animateSpot(spot, propertyPathArray);
        }
        this.ops.opsList.forEach(op => {
            if (stylesPerOp[op]) {
                this.ops.styler.applySpotStyles(goldenBody.styleTree.spots, propertyPathArray, spot);
                this.ops[op](spot, stylesPerOp[op]);
            }
        });
    });
};

PentaPainter.prototype.paintDiamonds = function (goldenBody, propertyPath) {
    let propertyPathArray = this.pathString2Array(propertyPath);

    let doFill = true;
    if (propertyPathArray[1] === 'large') {
        let style = {fillStyle: 'rgba(255, 0, 100, 0.3)', strokeStyle: '#c00'};
        this.ops.drawLargeInnerDiamond(goldenBody.pentaTree, style);
    }
    if (propertyPathArray[1] === 'small') {
        let style = {fillStyle: 'rgba(255, 0, 100, 0.3)', strokeStyle: '#c00'};
        this.ops.drawSmallInnerDiamond(goldenBody.pentaTree, style);
    }
};
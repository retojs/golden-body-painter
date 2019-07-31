/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
import { GoldenContext } from "./GoldenContext";
import { PM } from "./PentaMathik";

export function createStyleTree(goldenBody) {

    let PS = GoldenContext.get().pentaStyles;

    const INNER_FILL = PS.fills.mix(PS.colors.alpha[3].red, PS.colors.alpha[3].yellow, 3, 1);

    const baseStyles = createBaseStyles();

    goldenBody.styleTree = copy(baseStyles);

    createCores(goldenBody);
    createSupers(goldenBody);
    createExtremities(goldenBody);

    createSpots(goldenBody);

    document.getElementById('golden-body-style-tree').innerHTML = toString(goldenBody);

    function createBaseStyles() {

        let baseStyles = {

            fillCircle   : false,
            drawCircle   : true,
            fillPentagram: false,
            drawPentagram: false,
            fillPentagon : false,
            drawPentagon : true,

            lineWidth: 8,
            fillStyle: PS.colors.transparent.black,

            middle: {
                ...PS.fills.aShineOf.magenta,
                ...PS.strokes.dark.red,

                // upper: PS.strokes.mix(PS.colors.yellow, PS.colors.alpha[8].magenta, 1, 1),
                // lower: PS.strokes.mix(PS.colors.alpha[9].yellow, PS.colors.alpha[7].magenta, 1, 1),

                fillPentagon: false,
                fillCircle  : false,
                drawPentagon: false
            },

            inner: PS.all(PS.strokes.dark.red, INNER_FILL),

            outer: PS.all(PS.strokes.dark.cyan, PS.fills.alpha[1].cyan),

            outerst: PS.all(PS.strokes.dark.alpha[5].red, PS.fills.aShineOf.red)
        };

        baseStyles.inner.drawPentagram = false;
        baseStyles.inner.drawCircle    = false;
        baseStyles.inner.drawPentagon  = false;
        baseStyles.inner.drawPentagram = false;
        baseStyles.inner.fillPentagon  = false;//INNER_FILL;
        baseStyles.inner.fillCircle    = false;

        baseStyles.inner.upper = {
            drawPentagram: false, //PS.strokes.alpha[5].red,
            drawCircle   : PS.strokes.alpha[5].red
        };

        baseStyles.inner.lower = {
            drawPentagram: false, //PS.strokes.alpha[5].red,
            drawCircle   : PS.strokes.alpha[5].red
        };

        baseStyles.middle.lineWidth              = 10;
        baseStyles.middle.fillCircle             = false;
        baseStyles.middle.fillPentagram          = false;
        baseStyles.middle.fillPentagram          = false; // PS.fills.alpha[3].red;
        baseStyles.middle.fillPentagon           = PS.fills.aShineOf.alpha[1].red;
        baseStyles.middle.drawPentagon           = PS.strokes.alpha[5].red;
        baseStyles.middle.drawPentagon.lineWidth = 6;
        baseStyles.middle.upper                  = {
            // drawPentagram: PS.strokes.alpha[5].red
            drawCircle: PS.strokes.alpha[5].red,
            fillCircle: PS.fills.alpha[1].red
        };
        baseStyles.middle.lower                  = {
            // drawPentagram: PS.strokes.alpha[5].red
            drawCircle: PS.strokes.alpha[5].red,
            fillCircle: PS.fills.alpha[1].red
        };


        baseStyles.middle.outer = {
            // drawPentagram: PS.strokes.alpha[5].red
            drawCircle   : PS.strokes.yellow,
            fillCircle   : PS.fills.aShineOf.yellow,
            drawPentagon : PS.strokes.yellow,
            drawPentagram: PS.strokes.alpha[5].yellow,
        };

        // baseStyles.middle.upper.drawPentagram = PS.strokes.dark.red;
        // baseStyles.middle.lower.drawPentagram = PS.strokes.dark.red;

        baseStyles.outer.fillStar      = PS.fills.alpha[3].cyan;
        baseStyles.outer.fillCircle    = PS.fills.aShineOf.cyan;
        baseStyles.outer.drawCircle    = true;
        baseStyles.outer.drawPentagon  = false;
        baseStyles.outer.drawPentagram = PS.strokes.dark.cyan;

        baseStyles.outerst.middle = PS.strokes.alpha[4].magenta;

        baseStyles.outerst.drawPentagram = false;
        baseStyles.outerst.fillPentagram = false;
        baseStyles.outerst.fillStar      = false;

        baseStyles.outerst2 = PS.all(PS.strokes.dark.alpha[5].cyan, PS.fills.aShineOf.alpha[7].cyan);

        return baseStyles
    }

    function createCores(goldenBody) {

        goldenBody.styleTree.cores           = copy(baseStyles);
        goldenBody.styleTree.cores.lineWidth = 6 * 1;

        goldenBody.styleTree.cores.inner = {
            upper: {
                drawPentagram: false,
                drawPentagon : false,
                drawCircle   : PS.strokes.alpha[5].red,
                fillCircle   : PS.fills.alpha[2].red,
            },
            lower: {
                drawPentagram: false,
                drawPentagon : false,
                drawCircle   : PS.strokes.alpha[5].red,
                fillCircle   : PS.fills.alpha[2].red,
            }
        };

        goldenBody.styleTree.cores.outer.fillCircle    = false; // PS.fills.alpha[5].cyan;
        goldenBody.styleTree.cores.outer.fillStar      = false;
        goldenBody.styleTree.cores.outer.drawPentagram = false;

        goldenBody.styleTree.cores.middle.upper = {
            strokeStyle: PS.colors.alpha[3].magenta,
            drawCircle : PS.strokes.alpha[7].yellow
        };

        goldenBody.styleTree.cores.middle.lower = goldenBody.styleTree.cores.middle.upper;

        // TODO: Bugfix: wieso überschreiben die folgenden Zeilen den gelben stroke von oben?

        // goldenBody.styleTree.cores.middle.fillPentagram = PS.all(
        //   PS.strokes.mix(PS.colors.dark.cyan, PS.colors.magenta),
        //   PS.fills.alpha[8].white
        // );
        goldenBody.styleTree.cores.middle.fillPentagon  = false;
        goldenBody.styleTree.cores.middle.drawPentagram = PS.strokes.alpha[5].cyan;
        //goldenBody.styleTree.cores.middle.drawCircle = PS.strokes.dark.cyan;
        goldenBody.styleTree.cores.middle.fillStar      = PS.fills.alpha[5].cyan;
    }

    function createSupers(goldenBody) {

        goldenBody.styleTree.supers = {
            lineWidth   : 1,
            drawCircle  : false,
            drawPentagon: false,

            inner : {
                drawPentagram: PS.strokes.alpha[3].orange,
                fillPentagram: true,

                upper: PS.fills.alpha[1].red,
                lower: PS.fills.alpha[1].red,
            },
            outer : {
                drawPentagram: PS.strokes.bright.cyan,

                upper: PS.fills.aShineOf.cyan,
                lower: PS.fills.aShineOf.cyan,
            },
            middle: {
                drawCircle   : PS.strokes.bright.magenta,
                drawPentagram: PS.strokes.bright.magenta,

                upper: {
                    ...PS.fills.aShineOf.magenta,
                    ...PS.strokes.alpha[3].magenta
                },
                lower: {
                    ...PS.fills.aShineOf.magenta,
                    ...PS.strokes.mix(PS.colors.alpha[3].magenta, PS.colors.alpha[3].blue, 2, 1)
                }
            }
        };
    }

    function createSpots(goldenBody) {

        const radiusXL  = PM.gold_ * PM.gold_;
        const radiusL   = PM.gold_ * PM.gold_ * PM.gold_;
        const radiusM   = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
        const radiusS   = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
        const radiusXS  = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
        const radiusXXS = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;

        goldenBody.styleTree.spots = {
            radius: goldenBody.root.radius * radiusS * 0.8,

            lineWidth: 5,

            inner: {
                upper     : {
                    radius: goldenBody.root.radius * radiusXL * 0.9
                },
                lower     : {
                    radius: goldenBody.root.radius * radiusL * 0.9
                },
                // TODO: wieso hat nur ein Spot die innere Farbe des Gradienten?
                // fillCircle  : PS.getRadialGradientFillStyleMaker(
                //     PS.colors.alpha[2].orange,
                //     PS.colors.alpha[3].orange,
                //     0,
                //     1
                // ),
                fillCircle: PS.fills.aShineOf.orange,
                drawCircle: PS.strokes.alpha[7].red,
                // fillStar: { fillStyle: PS.mixColors(PS.colors.red, PS.colors.yellow, 4, 1) },
                // drawStar: PS.strokes.yellow,
            },

            outer: {
                fillCircle: PS.fills.aGlowOf.cyan,
                drawCircle: false,
                fillStar  : PS.fills.alpha[9].yellow,
                drawStar  : PS.strokes.dark.cyan,
            },

            middle: {
                drawCircle: PS.strokes.alpha[5].red,
                // radius      : goldenBody.root.radius * radiusM,

                upper: {
                    radius    : goldenBody.root.radius * radiusM * 1.45,
                    fillCircle: PS.fills.aShineOf.red,
                },
                lower: {
                    radius    : goldenBody.root.radius * radiusM * 1,
                    fillCircle: PS.fills.aShineOf.red,
                }
            }
        };

        goldenBody.styleTree.spots.cores = {
            lineWidth: 5,
            radius   : goldenBody.root.radius * radiusXS,

            inner : goldenBody.styleTree.spots.inner,
            outer : goldenBody.styleTree.spots.outer,
            middle: goldenBody.styleTree.spots.middle
        };

        goldenBody.styleTree.spots.cores.middle = {
            drawStar: PS.strokes.alpha[5].magenta,
            fillStar: PS.fills.alpha[7].white
        };
    }

    function createExtremities(goldenBody) {

        goldenBody.styleTree.extremities = {
            arms: {
                upper: copy(baseStyles),
                lower: copy(baseStyles)
            },
            legs: copy(baseStyles)
        };

        let outerExtremitiesStyles = {
            shoulder     : copy(baseStyles.outer),
            innerShoulder: copy(baseStyles.inner),
            upperArm     : copy(baseStyles.outer),
            ellbow       : copy(baseStyles.middle),
            lowerArm     : copy(baseStyles.inner),
        };

        goldenBody.styleTree.outerExtremities = {
            left : copy(outerExtremitiesStyles),
            right: copy(outerExtremitiesStyles)
        };
    }

    function createDiamondStyleTree(goldenBody) {

        goldenBody.styleTree.middle              = PS.strokes.dark.red;
        goldenBody.styleTree.middle.fillPentagon = PS.fills.red;
        goldenBody.styleTree.middle.fillCircle   = PS.fills.alpha[5].magenta;

        goldenBody.styleTree.inner.fillPentagram = PS.fills.red;
        goldenBody.styleTree.inner.fillPentagon  = false;
        goldenBody.styleTree.inner.fillCircle    = false;

        goldenBody.styleTree.supers.middle.fillCircle    = PS.fills.aShineOf.magenta;
        goldenBody.styleTree.supers.middle.drawPentagon  = false;
        goldenBody.styleTree.supers.middle.drawPentagram = false;

        goldenBody.styleTree.supers.middle.lower.fillCircle    = PS.fills.alpha[3].magenta;
        goldenBody.styleTree.supers.middle.lower.fillPentagram = false;
        goldenBody.styleTree.supers.middle.lower.fillPentagon  = false;

        goldenBody.styleTree.supers.inner.fillPentagram = PS.fills.alpha[2].red;
        goldenBody.styleTree.supers.inner.fillPentagon  = true;
        goldenBody.styleTree.supers.inner.drawPentagram = false;
    }
}

function copy(object) {
    if (typeof object === "object") {
        return Object.keys(object).reduce((clone, key) => {
                clone[key] = copy(object[key]);
                return clone;
            },
            {});
    } else {
        return object
    }
}

function toString(goldenBody) {
    return "GoldenBody.styleTree = " +
        JSON.stringify(goldenBody.styleTree, null, 2);
}

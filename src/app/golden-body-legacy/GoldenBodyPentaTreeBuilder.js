/**
 * A global function?!
 * Are you mad?!?
 * This pollutes the global namespace, you fool!
 *
 * Well, look: The rule you mean may apply for a piece of code
 * that is meant to be part of some bigger piece of code,
 * like a module or a plugin or a component.
 * But this piece of code can stand for itself
 * It's a piece of art, a piece of poetry,
 * a piece of literature, you fool!
 *
 */
import { isPenta } from "./Penta";
import { GoldenContext } from "./GoldenContext";
import { PM } from "./PentaMathik";

export function createPentaTree(goldenBody) {

    // Golden Guideline:
    //  It's good practice to name local shortcut references to global variables
    //  in uppercase, like constants, since you should not change global variables.
    let PS = GoldenContext.get().pentaStyles;

    let outerUpper = goldenBody.root;

    let innerUpper = outerUpper.clone({
        radius: outerUpper.innerRadius,
        angle : outerUpper.angle + PM.deg36
    });

    let middle = innerUpper.createPentagramExtension();

    let outerLower = middle.clone({
        radius: middle.outerRadius
    });
    outerLower.move([0, outerUpper.radius + outerLower.radius - innerUpper.radius]);

    let innerLower = innerUpper.clone({
        radius: innerUpper.radius * PM.gold_,
        angle : middle.angle + PM.deg180
    });
    innerLower.move([0, outerUpper.radius + outerLower.radius]);

    let lowerMiddle = innerLower.createPentagramExtension();

    let outerMiddle = outerUpper.clone().rotate(PM.deg180).move([0, outerUpper.radius * PM.gold_]);

    // Supers (outer cyan)

    let upperOuterSuper = outerUpper.clone({
        radius: outerUpper.radius * PM.gold * PM.gold,
        angle : outerUpper.angle + PM.deg180
    });

    let lowerOuterSuper = outerLower.clone({
        radius: outerLower.radius * PM.gold * PM.gold,
        angle : outerLower.angle + PM.deg180
    });

    // Supers (inner red)

    let upperInnerSuper = innerUpper.clone({
        radius: innerUpper.radius * PM.gold * PM.gold,
        angle : innerUpper.angle + PM.deg180
    });

    let lowerInnerSuper = innerLower.clone({
        radius: innerLower.radius * PM.gold * PM.gold,
        angle : innerLower.angle + PM.deg180
    });

    // Supers (middle magenta)

    let upperMiddleSuper = middle.clone({
        radius: middle.radius * PM.gold * PM.gold,
        angle : middle.angle + PM.deg180
    });

    let lowerMiddleSuper = lowerMiddle.clone({
        radius: lowerMiddle.radius * PM.gold * PM.gold,
        angle : lowerMiddle.angle + PM.deg180
    });

    goldenBody.pentaTree = {

        middle: {
            upper: middle,
            lower: lowerMiddle,
            outer: outerMiddle,
        },

        inner   : {
            upper: innerUpper,
            lower: innerLower
        },
        outer   : {
            upper: outerUpper,
            lower: outerLower
        },
        outerst : {
            middle: {
                upper: middle.createOuter(),
                lower: lowerMiddle.createOuter()
            },
            upper : outerUpper.createOuter(),
            lower : outerLower.createOuter()
        },
        outerst2: {
            upper: outerUpper.createOuter().createOuter(),
            lower: outerLower.createOuter().createOuter()
        },
        outerst3: {
            upper: outerUpper.createOuter().createOuter().createOuter(),
            lower: outerLower.createOuter().createOuter().createOuter()
        },


        cores: {
            middle: {
                upper: middle.createCore(),
                lower: lowerMiddle.createCore()
            },

            inner: {
                upper: innerUpper.createCore(),
                lower: innerLower.createCore()
            },
            outer: {
                upper: outerUpper.createCore(),
                lower: outerLower.createCore()
            }
        },

        supers: {
            inner : {
                upper: upperInnerSuper,
                lower: lowerInnerSuper
            },
            outer : {
                upper: upperOuterSuper,
                lower: lowerOuterSuper
            },
            middle: {
                upper: upperMiddleSuper,
                lower: lowerMiddleSuper
            }
        },
    };

    goldenBody.pentaTree.extremities = {
        arms: {
            upper: createExtremities(outerUpper, 2 * PM.deg72, innerLower, outerLower, true),
            lower: createExtremities(outerUpper, PM.deg72, innerLower, outerLower, true)
        },
        legs: createExtremities(outerLower.rotate(3 * PM.deg72), 2 * PM.deg72, innerUpper, outerUpper)
    };

    function createExtremities(center, angle, extInner, extOuter, invert) {
        return {
            middle: {
                upper: {
                    left : extremitize(middle, center, angle, false, center.p1),
                    right: extremitize(middle, center, -angle, false, center.p4)
                },
                lower: {
                    left : extremitize(lowerMiddle, center, angle, invert, center.p1),
                    right: extremitize(lowerMiddle, center, -angle, invert, center.p4)
                }
            },

            inner: {
                lower: {
                    left : extremitize(extInner, center, angle, invert, center.p1),
                    right: extremitize(extInner, center, -angle, invert, center.p4)
                }
            },
            outer: {
                lower: {
                    left : extremitize(extOuter, center, angle, invert, center.p1),
                    right: extremitize(extOuter, center, -angle, invert, center.p4)
                }
            }
        };
    }

    function extremitize(penta, center, angle, invert, invertCenter) {
        const rotated = rotateBy(penta, center, angle);
        if (invert) {
            return rotated.scale(PM.gold * PM.gold, invertCenter);
            // return invertBy(rotated, invertCenter, PM.gold);
        }
        return rotated;
    }

    function invertBy(penta, center, scale) {
        const inverted = penta.clone().rotate(PM.deg180, center).scale(scale, center);
        console.log("inverted:", inverted);
        return inverted;
    }

    function rotateBy(penta, center, angle) {
        return penta.clone().rotate(angle, center.getCenter());
    }

    function toString(goldenBody) {
        return "GoldenBody.pentaTree = " +
            JSON.stringify(goldenBody.pentaTree, (key, value) => {
                if (isPenta(value)) {
                    return value.toString();
                }
                return value;
            }, 2);
    }

    document.getElementById('golden-body-penta-tree').innerHTML = toString(goldenBody);
}

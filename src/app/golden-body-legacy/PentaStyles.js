import { PM } from "./PentaMathik";
import { GoldenContext } from "./GoldenContext";

export function PentaStyles() {

    this.colors = {
        black  : this.color(0, 0, 0),
        white  : this.color(255, 255, 255),
        red    : this.color(255, 0, 0),
        orange : this.color(255, 85, 0),
        green  : this.color(0, 255, 0),
        blue   : this.color(0, 0, 255),
        yellow : this.color(255, 255, 0),
        magenta: this.color(255, 0, 255),
        cyan   : this.color(0, 255, 255)
    };

    const modifyColor = (modFn, colorList) => {
        colorList = colorList || this.colors;

        return (memo, key) => {
            if (typeof colorList[key] === 'string') {
                memo[key] = modFn.apply(this, [colorList[key]]);
            }
            return memo;
        }
    };

    const modifyColorRecursive = (modFn, colorProps) => {
        colorProps = colorProps || this.colors;

        return (memo, key) => {
            const colorProp = colorProps[key];
            if (typeof colorProp === 'string') {
                memo[key] = modFn.apply(this, [colorProp]);
            } else if (typeof colorProp === 'object') {
                memo[key] = Object.keys(colorProp).reduce(modifyColorRecursive(modFn, colorProp), {});
            }
            return memo;
        }
    }

    const modifyAlphaRecursive = (colorProps) => {
        colorProps = colorProps || this.colors;

        return (memo, key) => {
            const colorProp = colorProps[key];
            if (typeof colorProp === 'string') {
                memo[key]  = colorProp;
                memo.alpha = memo.alpha || [];
                for (let alpha = 0; alpha < 10; alpha++) {
                    memo.alpha[alpha]      = memo.alpha[alpha] || {};
                    memo.alpha[alpha][key] = this.alpha(colorProp, alpha / 10);
                }
            } else if (typeof colorProp === 'object') {
                memo[key] = Object.keys(colorProp).reduce(modifyAlphaRecursive(colorProp), {});
            }
            return memo;
        }
    };

    // create modified colors (colors.bright.magenta, colors.dark.cyan etc.)
    this.colors.dark   = Object.keys(this.colors).reduce(modifyColor(this.dark), {});
    this.colors.bright = Object.keys(this.colors).reduce(modifyColor(this.bright), {});

    // create 10 alpha shades for all colors (colors.alpha[5].cyan)
    this.colors = Object.keys(this.colors).reduce(modifyAlphaRecursive(), {});

    // create named alpha modified colors (colors.light.magenta, colors.transparent.cyan etc.)
    this.colors.light       = Object.keys(this.colors).reduce(modifyColor(this.light), {});
    this.colors.transparent = Object.keys(this.colors).reduce(modifyColor(this.transparent), {});

    // create strokes and fills for all color properties (strokes.light.magenta, fills.alpha[5].cyan etc.)
    this.strokes = Object.keys(this.colors).reduce(modifyColorRecursive(this.stroke), {});
    this.fills   = Object.keys(this.colors).reduce(modifyColorRecursive(this.fill), {});

    // create gradient fills for all color properties (fills.aShineOf.light.magenta, fills.aGlowOf.alpha[5].cyan etc.)
    this.fills.aShineOf = Object.keys(this.colors).reduce(modifyColorRecursive(this.makeAShineOf), {});
    this.fills.aGlowOf  = Object.keys(this.colors).reduce(modifyColorRecursive(this.makeAGlowOf), {});

    console.log("PentaStyles.colors=", this.colors);
    console.log("PentaStyles.strokes=", this.strokes);
    console.log("PentaStyles.fills=", this.fills);

    this.strokes.mix = function (color1, color2, weight1, weight2) {
        return {strokeStyle: GoldenContext.get().pentaStyles.mixColors(color1, color2, weight1, weight2)};
    };

    this.fills.mix = function (color1, color2, weight1, weight2) {
        return {fillStyle: GoldenContext.get().pentaStyles.mixColors(color1, color2, weight1, weight2)};
    };

    this.dashes = {
        none  : [],
        finest: [1, 6],
        fine  : [2, 5],
        gross : [4, 3],
    };
}

//
// colors

PentaStyles.prototype.color = function (r, g, b, a) {
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));
    a = (typeof a === 'number') ? a : 1.0;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

PentaStyles.prototype.colorFromString = function (colorStr) {
    colorStr   = colorStr.trim();
    let values = colorStr.substring(5, colorStr.length - 1);
    return values.split(',').map(str => parseFloat(str));
};

PentaStyles.prototype.mixColors = function (color1, color2, weight1, weight2) {
    let col1 = this.colorFromString(color1);
    let col2 = this.colorFromString(color2);
    let w1   = weight1 || 1.0;
    let w2   = weight2 || 1.0;
    let wf1  = w1 / (w1 + w2);
    let wf2  = w2 / (w1 + w2);
    return this.color(
        col1[0] * wf1 + col2[0] * wf2,
        col1[1] * wf1 + col2[1] * wf2,
        col1[2] * wf1 + col2[2] * wf2,
        col1[3] * wf1 + col2[3] * wf2
    )
};

PentaStyles.prototype.radialGradient = function (penta, innerColor, outerColor, rangeFrom, rangeTo) {
    let gradient = GoldenContext.get().ctx.createRadialGradient(penta.x, penta.y, rangeFrom * penta.radius, penta.x, penta.y, rangeTo * penta.radius);
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    return gradient;
};

PentaStyles.prototype.getRadialGradientFillStyleMaker = function (innerColor, outerColor, rangeFrom, rangeTo) {
    let that = this;
    return {
        fillStyle: function (penta) {
            return that.radialGradient(penta, innerColor, outerColor, rangeFrom, rangeTo)
        }
    }
};

PentaStyles.prototype.makeAShineOf = function (color, alpha, range) {
    alpha                = alpha || this.lightAlpha;
    range                = range || PM.gold_;
    let transparentColor = this.alpha(color, 0);
    color                = this.alpha(color, alpha);
    return this.getRadialGradientFillStyleMaker(transparentColor, color, range, 1);
};

PentaStyles.prototype.makeAGlowOf = function (color, alpha) {
    alpha                = alpha || this.lightAlpha;
    let transparentColor = this.alpha(color, 0);
    color                = this.alpha(color, 1 - alpha);
    return this.getRadialGradientFillStyleMaker(color, transparentColor, 0, PM.out2in);
};

PentaStyles.prototype.brightIncrement = 100;
PentaStyles.prototype.darkDecrement   = -100;

PentaStyles.prototype.bright = function (colorStr, brightIncrement) {
    brightIncrement = brightIncrement || this.brightIncrement;
    let rgba        = this.colorFromString(colorStr);
    return this.color(
        rgba[0] + brightIncrement,
        rgba[1] + brightIncrement,
        rgba[2] + brightIncrement,
        rgba[3]
    );
};

PentaStyles.prototype.dark = function (colorStr, darkDecrement) {
    return this.bright(colorStr, darkDecrement || this.darkDecrement)
};

PentaStyles.prototype.alpha = function (colorStr, alpha) {
    let rgba = this.colorFromString(colorStr);
    return this.color(rgba[0], rgba[1], rgba[2], alpha);
};

PentaStyles.prototype.transparent = function (colorStr) {
    return this.alpha(colorStr, 0);
};

PentaStyles.prototype.lightAlpha = 0.25;

PentaStyles.prototype.light = function (colorStr, lightAlpha) {
    return this.alpha(colorStr, lightAlpha || this.lightAlpha);
};

//
// style properties

PentaStyles.prototype.stroke = function (color) {
    return {
        strokeStyle: color
    };
};

PentaStyles.prototype.fill = function (color) {
    return {
        fillStyle: color
    };
};

PentaStyles.prototype.lineWidth = function (width) {
    return {
        lineWidth: width
    };
}

PentaStyles.prototype.all = function (...styles) {
    return Object.assign.apply(Object.assign, [{}].concat(styles));
};

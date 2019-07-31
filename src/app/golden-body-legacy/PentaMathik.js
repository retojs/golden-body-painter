export const PentaMathik = {};
export const PM          = PentaMathik;

//
// Constants

/**
 * Two quantities a and b are in the _Golden Ratio_ if
 *
 * (a + b) / a = a / b
 *
 * This implies for the golden ratio (a / b) i.e. PM.gold:
 *
 * 1 + 1 / PM.gold = pm.gold
 *
 * Meaning: the inverse golden ratio (b / a) i.e. PM.gold_ is 1 smaller than (a / b).
 *
 * PM.gold_ = 1 / PM.gold
 * PM.gold_ = PM.gold - 1
 *
 * see: https://en.wikipedia.org/wiki/Golden_ratio
 */

PM.gold = (1.0 + Math.sqrt(5)) * 0.5;
PM.gold_ = PM.gold - 1;

console.log("PentaMathik.gold: " + PM.gold);
console.log("PentaMathik.gold_: " + PM.gold_);

PM.deg180 = Math.PI;
PM.deg360 = Math.PI * 2;
PM.deg90  = Math.PI / 2;
PM.deg72  = PM.deg360 / 5;
PM.deg36  = PM.deg180 / 5;

PM.toDeg = function (rad) {
    return (rad / Math.PI * 180).toFixed(0);
};

/**
 * The ratio between the inner and the outer radius of a pentagon
 */
PM.out2in = 1 / Math.cos(PM.deg36);

//
// Calculations

PM.outerRadius = function (penta) {
    return penta.radius * PM.out2in;
};

PM.innerRadius = function (penta) {
    return penta.radius / PM.out2in;
};

PM.getOuterRadiusFromSideLength = function (sideLength) {
    return sideLength * Math.sqrt(50 + 10 * Math.sqrt(5)) / 10
}

/**
 * calculates cartesian coordinates from polar coordinates
 */
PM.px = function (r, phi) {
    return r * Math.cos(phi);
};

PM.py = function (r, phi) {
    return r * Math.sin(phi);
};

/**
 * see: https://en.wikipedia.org/wiki/List_of_common_coordinate_transformations#From_Cartesian_coordinates
 */
PM.angle = function (vector) {
    let angle = Math.atan2(vector[1], vector[0]);
    if (angle < 0) {
        angle = angle + 2 * Math.PI;
    }
    return angle;
}


/**
 * calculates the distance between two points in 2D
 */
PM.d = function (p1, p2) {
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * calculates the point in the middle between the two specified points.
 */
PM.middle = function (p1, p2, ratio) {
    ratio  = ratio || 0.5;
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return [p1[0] + dx * ratio, p1[1] + dy * ratio];
};

/**
 * returns the endpoints of a line orthogonal to the line specified by the endpoints p1 and p2
 */
PM.orthogonal = function (p1, p2, ratio) {
    let p1p2   = [p2[0] - p1[0], p2[1] - p1[1]];
    let middle = PM.middle(p1, p2);
    return {
        p1: [middle[0], middle[1]],
        p2: [middle[0] + p1p2[1] * ratio, middle[1] - p1p2[0] * ratio]
    };
}

/**
 * see: https://en.wikipedia.org/wiki/Rotation_matrix
 */
PM.rotate = function (pos, center, angle) {
    center = center || pos;
    let x  = pos[0] - center[0];
    let y  = pos[1] - center[1];
    let xr = x * Math.cos(angle) - y * Math.sin(angle);
    let yr = x * Math.sin(angle) + y * Math.cos(angle);
    return [center[0] + xr, center[1] + yr];
};

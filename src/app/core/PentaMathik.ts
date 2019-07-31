export const gold = (1.0 + Math.sqrt(5)) * 0.5;
export const gold_ = this.gold - 1;

export const deg180 = Math.PI;
export const deg360 = Math.PI * 2;
export const deg90 = Math.PI / 2;
export const deg72 = deg360 / 5;
export const deg36 = deg180 / 5;


export function toDeg(rad) {
    return (rad / Math.PI * 180).toFixed(0);
}

/**
 * The ratio between the inner and the outer radius of a pentagon
 */
export const out2in = 1 / Math.cos(deg36);


export function outerRadius(penta) {
    return penta.radius * this.out2in;
}

export function innerRadius(penta) {
    return penta.radius / this.out2in;
}

export function getOuterRadiusFromSideLength(sideLength) {
    return sideLength * Math.sqrt(50 + 10 * Math.sqrt(5)) / 10
}

/**
 * calculates cartesian coordinates from polar coordinates
 */
export function px(r, phi) {
    return r * Math.cos(phi);
}

export function py(r, phi) {
    return r * Math.sin(phi);
}

/**
 * see: https://en.wikipedia.org/wiki/List_of_common_coordinate_transformations#From_Cartesian_coordinates
 */
export function angle(vector) {
    let angle = Math.atan2(vector[1], vector[0]);
    if (angle < 0) {
        angle = angle + 2 * Math.PI;
    }
    return angle;
}


/**
 * calculates the distance between two points in 2D
 */
export function d(p1, p2) {
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * calculates the point in the middle between the two specified points.
 */
export function middle(p1, p2, ratio) {
    ratio = ratio || 0.5;
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return [p1[0] + dx * ratio, p1[1] + dy * ratio];
}

/**
 * returns the endpoints of a line orthogonal to the line specified by the endpoints p1 and p2
 */
export function orthogonal(p1, p2, ratio) {
    let p1p2 = [p2[0] - p1[0], p2[1] - p1[1]];
    let middle = this.middle(p1, p2, ratio);
    return {
        p1: [middle[0], middle[1]],
        p2: [middle[0] + p1p2[1] * ratio, middle[1] - p1p2[0] * ratio]
    }
}

/**
 * see: https://en.wikipedia.org/wiki/Rotation_matrix
 */
export function rotate(pos, center, angle) {
    center = center || pos;
    let x = pos[0] - center[0];
    let y = pos[1] - center[1];
    let xr = x * Math.cos(angle) - y * Math.sin(angle);
    let yr = x * Math.sin(angle) + y * Math.cos(angle);
    return [center[0] + xr, center[1] + yr];
}

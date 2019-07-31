import { PM } from "./PentaMathik";

export function Penta(center, radius, angle, style) {
    this.x      = center ? center[0] || 0 : 0;
    this.y      = center ? center[1] || 0 : 0;
    this.radius = radius || 1;
    this.angle  = angle || 0;
    this.style  = style;
    this.calcPs();
}

export function isPenta(obj) {
    return obj && obj.constructor && obj.constructor.name === 'Penta';
}

Penta.prototype.toString = function () {
    return "Penta: " +
        "center=[" + Math.round(this.x) + ", " + Math.round(this.y) + "]" +
        ", radius=" + Math.round(this.radius);
};

//
// Initialization

Penta.prototype.calcPs = function () {
    for (let i = 0; i < 5; i++) {
        // console.log("i * PM.deg72 + this.angle = ", i * PM.deg72 + this.angle);
        this['p' + i] = [
            this.x + PM.px(this.radius, i * PM.deg72 + this.angle),
            this.y + PM.py(this.radius, i * PM.deg72 + this.angle)
        ]
    }
    // for (let i = 0; i < 5; i++) {
    //   console.log((i === 0 ? "*": "") + "p" + i + " = " + PM.toDeg(this.getEdgeAngle(i)));
    // }
    this.calcMore();
};

Penta.prototype.calcMore = function () {
    let dx         = this.p1[0] - this.p0[0];
    let dy         = this.p1[1] - this.p0[1];
    this.sideWidth = PM.d(this.p0, this.p1);

    this.outerRadius = PM.outerRadius(this);
    this.innerRadius = PM.innerRadius(this);
};

Penta.prototype.clone = function (config) {
    let clone = new Penta();
    Object.assign(clone, this, config);
    clone.calcPs();
    return clone;
};

//
// Accessors

Penta.prototype.getCenter = function () {
    return [this.x, this.y];
}

//
// Modifiers

Penta.prototype.move = function (delta) {
    this.x += delta[0];
    this.y += delta[1];
    this.calcPs();
    return this;
};

Penta.moveAll = function (pentas, delta) {
    pentas.forEach((p) => p.move(delta));
};

Penta.prototype.resize = function (radius) {
    this.radius = radius;
    this.calcPs();
    return this;
};

Penta.prototype.scale = function (scale, center) {
    const dx = this.x - center[0];
    const dy = this.y - center[1];
    this.x   = center[0] + scale * dx;
    this.y   = center[1] + scale * dy;
    this.radius *= scale;
    this.calcPs();
    return this;
};

Penta.prototype.rotate = function (angle, center) {
    this.angle += angle;
    let d  = PM.rotate([this.x, this.y], center, angle);
    this.x = d[0];
    this.y = d[1];
    this.calcPs();
    return this;
}

Penta.prototype.setAngle = function (angle) {
    this.angle = angle;
    this.calcPs();
    return this;
};

Penta.prototype.setStyle = function (style) {
    this.style = style;
    return this;
};

Penta.prototype.addStyle = function (style) {
    this.style = Object.assign(this.style, style);
    return this;
};

//
// Factory functions

Penta.prototype.createEdges = function (radius) {
    return [
        new Penta(this.p0, radius, this.angle),
        new Penta(this.p1, radius, this.angle),
        new Penta(this.p2, radius, this.angle),
        new Penta(this.p3, radius, this.angle),
        new Penta(this.p4, radius, this.angle)
    ];
};

Penta.prototype.getPs = function () {
    return [this.p0, this.p1, this.p2, this.p3, this.p4];
}

/**
 * Returns an object with properties n (north), s (south), e, w, ne, nw, se, sw
 * containing the 5 pentagon edges according to their position.
 *
 * TODO make this work
 *
 * @param {number} radius
 */
Penta.prototype.getPsByName = function (radius) {
    const ps     = [this.p0, this.p1, this.p2, this.p3, this.p4];
    const sorted = ps.reduce((sort, p) => {
            if (p[0] <= sort.min.x[sort.min.x.length - 1][0]) {
                sort.min.x = sort.min.x.filter(e => e[0] === p[0]);
                sort.min.x.push(p);
            }
            if (p[1] <= sort.min.y[sort.min.y.length - 1][1]) {
                sort.min.y = sort.min.y.filter(e => e[1] === p[1]);
                sort.min.y.push(p);
            }
            if (p[0] >= sort.max.x[sort.max.x.length - 1][0]) {
                sort.max.x = sort.max.x.filter(e => e[0] === p[0]);
                sort.max.x.push(p);
            }
            if (p[1] >= sort.max.y[sort.max.y.length - 1][1]) {
                sort.max.y = sort.max.y.filter(e => e[1] === p[1]);
                sort.max.y.push(p);
            }
        },
        {
            min: {x: 0, y: 0},
            max: {x: 0, y: 0}
        }
    );

    const byNames = {};

    if (sorted.min.x.length === 1) {
        byNames.n = sorted.min.x;
    } else if (sorted.min.x.length === 2) {
        let lr     = sorted.min.x[0][1] < sorted.min.x[1][1];
        byNames.ne = lr ? sorted.min.x[0] : sorted.min.x[1];
        byNames.ne = lr ? sorted.min.x[1] : sorted.min.x[2];
    }

    if (sorted.min.y.length === 1) {
        byNames.e = sorted.min.y;
    } else if (sorted.min.y.length === 2) {
        let td     = sorted.min.y[0][0] < sorted.min.y[1][0];
        byNames.ne = td ? sorted.min.y[0] : sorted.min.y[1];
        byNames.se = td ? sorted.min.y[1] : sorted.min.y[2];
    }

    return byNames;
}

Penta.prototype.createCore = function () {
    return this.clone({
        radius: this.radius * PM.gold_ * PM.gold_,
        angle : this.angle + PM.deg180
    })
};

Penta.prototype.createInner = function (style) {
    return new Penta(
        this.getCenter(),
        this.innerRadius,
        this.angle + PM.deg36,
        style);
};

Penta.prototype.createOuter = function (style) {
    return new Penta(
        this.getCenter(),
        this.outerRadius,
        this.angle + PM.deg36,
        style);
};

Penta.prototype.getEdgesAtPos = function (pos, radius) {
    let edgesAtPos = [];
    let edges      = this.getPs().map((p, index) => {
        return {
            penta: this,
            index: index,
            pos  : p,
            x    : p[0],
            y    : p[1]
        };
    });

    radius = radius || GoldenContext.get().scale * 5;

    return edges.reduce((edgesAtPos, edge) => {
        if ((pos.x - radius) < edge.x && edge.x < (pos.x + radius)
            && (pos.y - radius) < edge.y && edge.y < (pos.y + radius)) {
            edgesAtPos.push(edge);
            edge.hitPos = {
                x: pos.x - edge.x,
                y: pos.y - edge.y
            };
        }
        return edgesAtPos;
    }, edgesAtPos);
};

Penta.prototype.saveInitialValues = function () {
    this.initialValues = {
        x     : this.x,
        y     : this.y,
        radius: this.radius,
        p0    : [this.p0[0], this.p0[1]],
        p1    : [this.p1[0], this.p1[1]],
        p2    : [this.p2[0], this.p2[1]],
        p3    : [this.p3[0], this.p3[1]],
        p4    : [this.p4[0], this.p4[1]],
        angle : []
    }

    for (let i = 0; i < 5; i++) {
        this.initialValues.angle[i] = this.getEdgeAngle(i);
    }
}

Penta.prototype.moveEdge = function (index, pos) {
    let p = this.getEdge(index);
    p[0]  = pos[0];
    p[1]  = pos[1];
}

Penta.prototype.triangleMoveEdge = function (index, pos) {

    let indexNext     = (index + 1) % 5;
    let indexPrev     = (index - 1 + 5) % 5;
    let indexNextNext = (index + 2) % 5;
    let indexPrevPrev = (index - 2 + 5) % 5;

    let p         = this.getEdge(index);
    let pNext     = this.getEdge(indexNext);
    let pPrev     = this.getEdge(indexPrev);
    let pNextNext = this.getEdge(indexNextNext);
    let pPrevPrev = this.getEdge(indexPrevPrev);

    this.movingEdges = [p, pNext, pPrev];

    p[0] = pos[0];
    p[1] = pos[1];

    let pNextMiddle = this.getMiddlePosition(index, indexNext, indexNextNext);
    let pPrevMiddle = this.getMiddlePosition(index, indexPrev, indexPrevPrev);

    pNext[0] = pNextMiddle[0];
    pNext[1] = pNextMiddle[1];
    pPrev[0] = pPrevMiddle[0];
    pPrev[1] = pPrevMiddle[1];

    // TODO? update all spots at the same position
}

/**
 * Maintains the relation of the moving spot's adjacent angles.
 */
Penta.prototype.getMiddlePosition = function (indexMove, indexMid, index2) {

    let clockwise = (indexMove + 1) % 5 === indexMid;

    let initial = {
        anglePMove: this.initialValues.angle[indexMove],
        anglePMid : this.initialValues.angle[indexMid],
        angleP2   : this.initialValues.angle[index2]
    };

    let anglePMove = this.getEdgeAngle(indexMove);
    let angleP2    = this.getEdgeAngle(index2);

    // Bring angles in ascending (clockwise) or descending order

    if (clockwise) { // anglePMid and angleP2 should be greater than anglePMove, anglePMove the *smallest* angle
        if (initial.anglePMid < initial.anglePMove) {
            initial.anglePMid += 2 * Math.PI;
        }
        if (initial.angleP2 < initial.anglePMove) {
            initial.angleP2 += 2 * Math.PI;
        }
        if (angleP2 < anglePMove) {
            angleP2 += 2 * Math.PI;
        }
    } else { // anglePMid and angleP2 should be smaller than anglePMove, anglePMove the *largest* angle
        if (initial.anglePMid > initial.anglePMove) {
            initial.anglePMid -= 2 * Math.PI;
        }
        if (initial.angleP2 > initial.anglePMove) {
            initial.angleP2 -= 2 * Math.PI;
        }
        if (angleP2 > anglePMove) {
            anglePMove += 2 * Math.PI;
        }
    }
    // console.log(`initial.anglePMove (${indexMove}) = ${PM.toDeg(initial.anglePMove)}`);
    // console.log(`initial.anglePMid (${indexMid}) = ${PM.toDeg(initial.anglePMid)}`);
    // console.log(`initial.angleP2 (${index2}) = ${PM.toDeg(initial.angleP2)}`);
    // console.log(`anglePMove (${indexMove}) = ${PM.toDeg(anglePMove)}`);
    // console.log(`angleP2 (${index2}) = ${PM.toDeg(angleP2)}`);

    // Calculate the initial angles' deltas' relation

    let dMoveP2       = initial.anglePMove - initial.angleP2;
    let dMidP2        = initial.anglePMid - initial.angleP2;
    let angleRelation = dMoveP2 / dMidP2;
    let angleMiddle   = angleP2 + (anglePMove - angleP2) / angleRelation

    // maintain the angles' deltas' relation

    let initialRadiusMiddle = this.getPRadius(this.getEdgeInitial(indexMid));

    return [this.x + initialRadiusMiddle * Math.cos(angleMiddle), this.y + initialRadiusMiddle * Math.sin(angleMiddle)];
}

Penta.prototype.getEdge = function (index) {
    return this['p' + index];
};

Penta.prototype.getEdgeInitial = function (index) {
    return this.initialValues['p' + index];
};

Penta.prototype.getEdgeAngle = function (index) {
    return this.getPAngle(this.getEdge(index));
};

Penta.prototype.getPAngle = function (p) {
    let pFromCenter = [p[0] - this.x, p[1] - this.y];
    return PM.angle(pFromCenter);
};

Penta.prototype.getPRadius = function (p) {
    return PM.d(p, [this.x, this.y]);
};

Penta.prototype.createPentagonExtension = function () {
    // TODO
};

// createExtension(type: string)
// type = ( | | | )
Penta.prototype.createPentagramExtension = function () {
    let offsetY = this.radius;
    if (this.angle / PM.deg72 > 2) {
        offsetY = -this.radius;
    }
    return new Penta(
        [this.x, this.y + offsetY],
        this.radius * PM.gold_,
        this.angle);
};

Penta.prototype.createCoreDiamond = function (index) {
    let core = this.createCore();

    let indexPlus  = (index + 2) % 5;
    let indexMinus = (index - 2 + 5) % 5;
    let p          = penta['p' + index];
    let pPlus      = penta['p' + indexPlus];
    let pMinus     = penta['p' + indexMinus];


    // TODO create array of points
    return [
        p, pPlus
    ]
};

Penta.prototype.createSuperDiamond = function (index) {
};

Penta.prototype.createV     = function (index) {
    // TODO
};
Penta.prototype.createArrow = function (index) {
    // TODO
};

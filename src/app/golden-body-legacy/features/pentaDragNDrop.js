import { GoldenContext } from "../GoldenContext";
import { isPenta } from "../Penta";
import { mousePos2canvasPos } from "./shared";
import { PentaPainterOps } from "../PentaPainterOps";

export function setupPentaDragNDrop() {

    let spotRadius               = GoldenContext.get().scale * 10;
    let HIGHLIGHT_SPOTS_ON_HOVER = false;

    GoldenContext.get().hitSpots   = [];
    GoldenContext.get().hoverSpots = [];
    let canvaslastHoverSpotsHash   = getSpotsHash(GoldenContext.get().hoverSpots);

    GoldenContext.get().canvas.addEventListener('mousedown', (event) => {
        if (event.ctrlKey) return;

        let canvasMousePos           = mousePos2canvasPos(event.clientX, event.clientY);
        //paintPosition(canvasMousePos);
        GoldenContext.get().hitSpots = getVisibleSpotsAtPos(canvasMousePos);
        //console.log("hitSpots= ", GoldenContext.getInstance().hitSpots);
        GoldenContext.get().hitSpots.forEach(spot => spot.penta.saveInitialValues());
    });

    GoldenContext.get().TRIANGLE_MOVE_EDGE = false;

    GoldenContext.get().canvas.addEventListener('mousemove', (event) => {
        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        if (GoldenContext.get().hitSpots.length > 0) {
            if (event.shiftKey) {
                GoldenContext.get().TRIANGLE_MOVE_EDGE = true;
            }
            // PentaPainterOps.DO_PAINT_SEGMENTS = true;
            GoldenContext.get().hitSpots.forEach(spot => {
                spot.pos[0] = canvasMousePos.x - spot.hitPos.x;
                spot.pos[1] = canvasMousePos.y - spot.hitPos.y;
                if (GoldenContext.get().TRIANGLE_MOVE_EDGE) {
                    spot.penta.triangleMoveEdge(spot.index, spot.pos);
                } else {
                    spot.penta.moveEdge(spot.index, spot.pos);
                }
            });

            // TODO: prepare list of visible spots per position (some spots are overlapping, i.e. "connected")
            //   traverse tree, for each penta, add all edges, if edges are at the same spot, add them to the same list 
            // from one spot I want to get all connected spots
            // when moving a spot collect all moving edges and move their connected spots, too
            window.requestAnimationFrame(() => GoldenContext.get().painter.paintGoldenBody(GoldenContext.get().goldenBody));
        } else if (HIGHLIGHT_SPOTS_ON_HOVER) {
            GoldenContext.get().hoverSpots = getSpotsAtPos(canvasMousePos);
            if (getSpotsHash(GoldenContext.get().hoverSpots) !== canvaslastHoverSpotsHash) {
                window.requestAnimationFrame(() => GoldenContext.get().painter.paintGoldenBody(GoldenContext.get().goldenBody));
            }
            canvaslastHoverSpotsHash = getSpotsHash(GoldenContext.get().hoverSpots);
        }
    });

    GoldenContext.get().canvas.addEventListener('mouseup', (event) => {
        GoldenContext.get().TRIANGLE_MOVE_EDGE = false;
        PentaPainterOps.DO_PAINT_SEGMENTS      = false;
        GoldenContext.get().hitSpots.forEach(spot => {
            spot.penta.movingEdges = [];
        });
        GoldenContext.get().hitSpots = [];
    });

    function getVisibleSpotsAtPos(canvasMousePos) {
        return (GoldenContext.get().visiblePentas || []).reduce((foundSpots, penta) =>
                foundSpots.concat(penta.getEdgesAtPos(canvasMousePos, spotRadius))
            , []
        );
    }

    /** deprecated */
    function getSpotsAtPos(canvasMousePos, subtree, foundSpots) {
        subtree    = subtree || GoldenContext.get().goldenBody.pentaTree;
        foundSpots = foundSpots || [];

        if (isPenta(subtree)) {
            foundSpots = foundSpots.concat(subtree.getEdgesAtPos(canvasMousePos, spotRadius));
        } else {
            Object.keys(subtree).forEach(key => {
                if (subtree[key]) {
                    foundSpots = getSpotsAtPos(canvasMousePos, subtree[key], foundSpots);
                }
            })
        }
        return foundSpots;
    }

    function getSpotsHash(spots) {
        return spots.reduce((hash, spot, i) => {
            hash += 'p' + i + ':x=' + spot.x + ',y=' + spot.y;
            return hash;
        }, "");
    }

    function paintPosition(pos, color) {
        color                             = color || GoldenContext.get().pentaStyles.colors.black;
        let scale                         = getScale();
        GoldenContext.get().ctx.fillStyle = color;
        GoldenContext.get().ctx.fillRect(pos.x - scale * 2, pos.y - scale * 2, scale * 4, scale * 4);
    }

    function paintSpots(spots, ops) {
        ops = ops || new PentaPainterOps();
        spots.forEach(spot => paintSpot(spot, ops));
    }

    function paintSpot(spot, ops) {
        ops       = ops || new PentaPainterOps();
        let model = {
            x     : spot[0],
            y     : spot[1],
            radius: spotRadius
        };
        ops.fillCircle(model, {fillStyle: GoldenContext.get().pentaStyles.colors.dark.red});

    }
}

import { GoldenContext } from "../GoldenContext";

export function setupShared() {
    GoldenContext.get().doubleClickMaxDelayMillis = 500;
    GoldenContext.get().lastClick;
}

export function isDoubleClick() {
    let clickDelay = GoldenContext.get().lastClick ? Date.now() - GoldenContext.get().lastClick : GoldenContext.get().doubleClickMaxDelayMillis;
    let isDoubleClick = clickDelay < GoldenContext.get().doubleClickMaxDelayMillis;
    if (!isDoubleClick) {
        GoldenContext.get().lastClick = Date.now();
    }
    return isDoubleClick;
}

export function repaint(unchanged) {
    window.requestAnimationFrame(() => {
        if (unchanged) {
            GoldenContext.get().painter.repaint(GoldenContext.get().offscreenCanvas);
            if (GoldenContext.get().animationStartTime) {
                GoldenContext.get().painter.paintAnimation(GoldenContext.get().goldenBody.pentaTree, GoldenContext.get().goldenBody.styleTree, GoldenContext.get().animateTreePath);
            }
        } else {
            GoldenContext.get().painter.paintGoldenBody(GoldenContext.get().goldenBody);
        }
    });
}

export function getCanvasBounds() {
    return GoldenContext.get().canvas.getBoundingClientRect();
}

export function getScale() {
    return GoldenContext.get().canvas.width / getCanvasBounds().width;
}

export function getCanvasViewPortPos(mouseX, mouseY) {
    let canvasBounds = getCanvasBounds();
    let scale = getScale();
    return getCoords(
        mouseX,
        mouseY,
        canvasBounds.x,
        canvasBounds.y,
        scale
    );
}

export function mousePos2canvasPos(mouseX, mouseY) {
    let viewPortPos               = getCanvasViewPortPos(mouseX, mouseY);
    GoldenContext.get().translate = GoldenContext.get().translate || { x: 0, y: 0 };
    return {
        x: viewPortPos.x / GoldenContext.get().zoom - GoldenContext.get().translate.x,
        y: viewPortPos.y / GoldenContext.get().zoom - GoldenContext.get().translate.y,
    }
}

export function getCoords(x, y, originX, originY, scale) {
    return {
        x: (x - originX) * scale,
        y: (y - originY) * scale
    }
}

export function getPaintOrderTextareaLines() {
    const content = document.getElementById('golden-body-paint-order').value;
    return content.split('\n').filter(line => !!line.trim());
}

export function setPaintOrderTextareaContent(innerHTML) {
    document.getElementById('golden-body-paint-order').innerHTML = innerHTML;
}
import { GoldenContext } from "../GoldenContext";


export function setupPaintBitmap() {

    GoldenContext.get().doPaintBitmap = false;

    const thumb = document.getElementById('canvas-image')
    thumb.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        GoldenContext.get().doPaintBitmap = true;
        repaint();
    });
}

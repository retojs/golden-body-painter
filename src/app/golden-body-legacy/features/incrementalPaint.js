import { GoldenContext } from "../GoldenContext";
import { getPaintOrderTextareaLines, isDoubleClick, repaint } from "./shared";

export function setupIncrementalPaint() {

    const incrementTimeMillis = 1000;

    let step;
    let backwards;
    let incPaintTimeout;
    let paintOrderLines;

    function stop() {
        step = 1
        clearTimeout(incPaintTimeout);
        console.log("incremental paint stopped");
    }

    function start(shiftKey) {
        stop();
        backwards       = shiftKey;
        paintOrderLines = getPaintOrderTextareaLines();
        incPaintTimeout = setTimeout(incPaint);
    }

    function incPaint() {
        if (backwards) {
            GoldenContext.get().paintOrderLines = paintOrderLines.slice(paintOrderLines.length - step, paintOrderLines.length);
        } else {
            GoldenContext.get().paintOrderLines = paintOrderLines.slice(0, step);
        }
        repaint();
        console.log("incremental paint lines " + (backwards ? "backwards" : ""), GoldenContext.get().paintOrderLines);

        if (step < paintOrderLines.length) {
            step += 1;
            incPaintTimeout = setTimeout(incPaint, incrementTimeMillis);
        } else {
            stop();
        }
    }


    GoldenContext.get().canvas.addEventListener('mouseup', (event) => {
        if (isDoubleClick()) {
            if (incPaintTimeout) {
                stop();
            } else {
                start(event.shiftKey);
            }
        }
    });

}





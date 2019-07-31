import { getPaintOrderTextareaLines, setPaintOrderTextareaContent } from "./shared";
import { GoldenContext } from "../GoldenContext";

const paintOrderStandard = `
// supers.outer
// supers.inner
// supers.middle


outer
inner
//diamonds.large
//diamonds.small
//cores.outer
//cores.inner
 middle

//extremities.arms.upper£à
//extremities.arms.lower
//extremities.legs

//cores.middle
cores.outer
cores.inner
//spots.cores.middle
spots.cores.outer
spots.middle
spots.inner
spots.outer
//outerst.upper
//outerst.lower
//outerst2
`;

const paintOrderOuterAndMiddle = `
supers.outer
supers.middle
outer
middle
cores.inner
cores.middle
`;

const paintOrderDiamondsSimple = `
inner
supers.inner
diamonds.large
diamonds.small
middle.lower
middle.upper
spots.inner 
spots.middle
`;

const paintOrderDiamondsExtended = `
supers.inner
supers.middle
inner
middle
diamonds.large
diamonds.small
spots.inner 
spots.middle.upper
`;

const paintOrderInnerBase = `
supers.inner
supers.middle
inner
middle
spots.middle
spots.inner
`;


export function setupPaintOrderEditing() {
    let paintOrderTextArea = document.getElementById('golden-body-paint-order');
    let throttleMillis     = 500;
    let lastKeyUp          = -1;

    setPaintOrderTextareaContent(paintOrderStandard);
    // setPaintOrderTextareaContent(paintOrderOuterAndMiddle);
    // setPaintOrderTextareaContent(paintOrderDiamondsSimple);
    // setPaintOrderTextareaContent(paintOrderDiamondsExtended);
    // setPaintOrderTextareaContent(paintOrderInnerBase);

    GoldenContext.get().paintOrderLines = getPaintOrderTextareaLines();

    paintOrderTextArea.addEventListener('keyup', () => {
        lastKeyUp = Date.now();
        setTimeout(() => {
            if (getDeltaTime(lastKeyUp) >= throttleMillis) {
                GoldenContext.get().paintOrderLines = getPaintOrderTextareaLines();
                repaint();
            }
        }, throttleMillis);
    });

    function getDeltaTime(refTime) {
        return Date.now() - refTime;
    }
}


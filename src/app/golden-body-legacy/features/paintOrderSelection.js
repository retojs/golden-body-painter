import { PentaPainterOps } from "../PentaPainterOps";

export function setupPaintOrderSelection() {
    let ops               = new PentaPainterOps();
    let styler            = ops.styler;
    let paintOrderElement = document.getElementById('golden-body-paint-order');
    paintOrderElement.addEventListener('mouseup', (event) => {
        let selected = getSelectedText(paintOrderElement);
        if (selected && selected.trim()) {
            let propertyPathArrayArray = GoldenContext.get().painter.pathString2Array(selected.trim());
            let properties             = styler.styleProperties.concat(ops.opsList);
            let styleProps             = styler.getCascadingProperties(GoldenContext.get().goldenBody.styleTree, propertyPathArrayArray, properties);
            console.log("style properties of selected path '" + selected + "':", styleProps);
        }
    });

    function getSelectedText(el) {
        if (el.selectionStart !== undefined) {// Standards Compliant Version
            var startPos = el.selectionStart;
            var endPos   = el.selectionEnd;
            return el.value.substring(startPos, endPos);
        } else if (document.selection !== undefined) {// IE Version
            el.focus();
            var sel = document.selection.createRange();
            return sel.text;
        }
    }

    // TODO: save state in localStorage on each Change -> undo

}


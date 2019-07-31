import "../style/index.scss";

import "./golden-body-legacy/PentaMathik.js";
import "./golden-body-legacy/Penta.js";
import "./golden-body-legacy/PentaStyles.js";
import "./golden-body-legacy/PentaTreeStyler.js";
import "./golden-body-legacy/PentaPainterOps.js";
import "./golden-body-legacy/PentaPainter.js";
import "./golden-body-legacy/GoldenBodyPentaTreeBuilder.js";
import "./golden-body-legacy/GoldenBodyStyleTreeBuilder.js";
import "./golden-body-legacy/GoldenBody.js";

import "./golden-body-legacy/features/shared.js";
import "./golden-body-legacy/features/animations.js";
import "./golden-body-legacy/features/canvasZoomNTranslate.js";
import "./golden-body-legacy/features/fullScreen.js";
import "./golden-body-legacy/features/incrementalPaint.js";
import "./golden-body-legacy/features/legendVisibility.js";
import "./golden-body-legacy/features/paintBitmap.js";
import "./golden-body-legacy/features/paintOrderEditing.js";
import "./golden-body-legacy/features/paintOrderSelection.js";
import "./golden-body-legacy/features/pentaDragNDrop.js";

import "./golden-body-legacy/golden-body.js";
import { GoldenContext } from "./golden-body-legacy/GoldenContext";

window.onload = () => {
    GoldenContext.get().paint();
};


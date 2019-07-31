import { setupShared } from "./features/shared";
import { setupAnimations } from "./features/animations";
import { setupCanvasZoomNTranslate } from "./features/canvasZoomNTranslate";
import { setupFullScreen } from "./features/fullScreen";
import { setupIncrementalPaint } from "./features/incrementalPaint";
import { setupLegendVisibility } from "./features/legendVisibility";
import { setupPaintBitmap } from "./features/paintBitmap";
import { setupPaintOrderEditing } from "./features/paintOrderEditing";
import { setupPaintOrderSelection } from "./features/paintOrderSelection";
import { setupPentaDragNDrop } from "./features/pentaDragNDrop";
import { PM } from "./PentaMathik"

// export const GoldenContext.get() = GoldenContext.get().setup();

/**
 TODO: immutable sequence of states stored in local storage

 * states of several objects individually -> allow combination
 pentaTree, styleTree, paintOrder etc.

 * every step has
 - date
 - name (optional)
 - parent
 - children

 * state change is done via
 - clone old state
 - link parent and children
 - apply change

 * on each step the delta/diff is calculated and stored in local storage
 * on demand you can also store the complete state (key frame)

 * you can navigate back and forth in the sequence of states of every part/object.
 * you can change any state in the sequence and create a new branch

 * from states you can create series
 * series have names
 * changing series is also stored as a sequence of states or diffs.


 END TODO
 */
setupShared();
setupAnimations();
setupCanvasZoomNTranslate();
setupFullScreen();
setupIncrementalPaint();
setupLegendVisibility();
setupPaintBitmap();
setupPaintOrderEditing();
setupPaintOrderSelection();
setupPentaDragNDrop();

// TEST

let angle = PM.angle([11, 0]);
console.log('TEST angle=0? ', angle, PM.toDeg(angle));
angle = PM.angle([11, 11]);
console.log('TEST angle=45? ', angle, PM.toDeg(angle));
angle = PM.angle([0, 11]);
console.log('TEST angle=90? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, 11]);
console.log('TEST angle=135? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, 0]);
console.log('TEST angle=180? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, -11]);
console.log('TEST angle=225?', angle, PM.toDeg(angle));
angle = PM.angle([0, -11]);
console.log('TEST angle=270? ', angle, PM.toDeg(angle));
angle = PM.angle([11, -11]);
console.log('TEST angle=315', angle, PM.toDeg(angle));
import { PentaStyles } from "./PentaStyles";
import { PentaPainter } from "./PentaPainter";
import { GoldenBody } from "./GoldenBody";
import { PM } from "./PentaMathik";

export class GoldenContext {

    private static instance: GoldenContext;

    static get(): GoldenContext {
        if (!GoldenContext.instance) {
            GoldenContext.instance = new GoldenContext();
        }
        return GoldenContext.instance;
    }

    scale = 4;
    size = 480;
    origin = [1788, 1880];
    canvasSize = {
        width: 3600,
        height: 4016
    };
    backgroundColor = '#f5e7ac';

    canvas: HTMLCanvasElement;
    offscreenCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    private _pentaStyles: any;
    private _goldenBody: any;
    private _painter: any;

    constructor() {

        this.canvas = document.getElementById('golden-body-canvas') as HTMLCanvasElement;
        this.canvas.width = this.canvasSize.width;
        this.canvas.height = this.canvasSize.width;

        this.offscreenCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.offscreenCanvas.width = this.canvasSize.width;
        this.offscreenCanvas.height = this.canvasSize.height;

        this.ctx = this.offscreenCanvas.getContext('2d');
    }

    get pentaStyles() {
        if (!this._pentaStyles) {
            this._pentaStyles = new PentaStyles();
        }
        return this._pentaStyles;
    }

    get painter() {
        if (!this._painter) {
            this._painter = new PentaPainter();
        }
        return this._painter;
    }

    get goldenBody() {
        if (!this._goldenBody) {
            this._goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
        }
        return this._goldenBody;
    }

    paint() {
        this.painter.paintGoldenBody(this.goldenBody);
        return this;
    }
}

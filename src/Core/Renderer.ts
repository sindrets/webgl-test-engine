import { CssUtils } from "../Utils/CssUtils";

export class Renderer {
	private _canvas?: HTMLCanvasElement;
	private _gl: WebGL2RenderingContext | null = null;

	private autoResize: boolean = false;

	public init(autoResize?: boolean): void;
	public init(selector: string, autoResize?: true): void;
	public init(canvas: HTMLCanvasElement, autoResize?: boolean): void;
	public init(x?: HTMLCanvasElement | string | boolean, autoResize = true): void {
		switch (typeof x) {
			case "string":
				let c = document.querySelector(x);
				if (c instanceof HTMLCanvasElement) {
					this._canvas = c;
				} else {
					throw new Error("Could not find a canvas element matched by selector:" + x);
				}
				break;
			case "object":
				this._canvas = x;
				break;
			case "boolean":
				autoResize = x;
			default:
				this._canvas = document.createElement("canvas");
				this._canvas.style.background = "black";
				if (/comp|inter|loaded/.test(document.readyState)) {
					document.body.appendChild(this._canvas);
					this.resize();
				} else {
					document.addEventListener("DOMContentLoaded", e => {
						document.body.appendChild(this._canvas as HTMLCanvasElement);
						this.resize();
					});
				}
		}

		this._canvas.classList.add("wte-canvas");
		this.setAutoResize(autoResize);
		this._gl = this._canvas.getContext("webgl2");
		if (this.gl) {
			console.debug(this.gl.getParameter(this.gl.VERSION));
			console.debug(this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION));
			this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
			this.gl.enable(this.gl.DEPTH_TEST);
			this.gl.enable(this.gl.CULL_FACE);
			this.gl.frontFace(this.gl.CCW);
			this.gl.cullFace(this.gl.BACK);
		}

		window.addEventListener("resize", () => {
			this.resize();
		});
	}

	public setAutoResize(flag: boolean): void {
		this.autoResize = flag;
		if (flag) {
			let sheet = CssUtils.getStyleSheet();
			if (sheet) {
				sheet.addRule(".wte-canvas", "width: 100vw; height: 100vh;");
				sheet.addRule("html, body", "margin: 0; padding: 0; overflow: hidden;");
			}
		} else {
			CssUtils.clearRule(".wte-canvas");
			CssUtils.clearRule("html, body");
		}
	}

	private resize(): void {
		if (this.canvas) {
			const displayWidth = this.canvas.clientWidth;
			const displayHeight = this.canvas.clientHeight;
			if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
				this.canvas.width = displayWidth;
				this.canvas.height = displayHeight;
				if (this.gl) {
					this.gl.viewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
				}
			}
		}
	}

	public get canvas(): HTMLCanvasElement | undefined {
		return this._canvas;
	}
	public get gl() {
		return this._gl;
	}
}

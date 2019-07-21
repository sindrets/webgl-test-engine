import { CssUtils } from "../Utils/CssUtils";

export class Renderer {
	private canvas?: HTMLCanvasElement;
	private autoResize: boolean = false;

	public init(autoResize?: boolean): void;
	public init(selector: string, autoResize?: true): void;
	public init(canvas: HTMLCanvasElement, autoResize?: boolean): void;
	public init(x?: HTMLCanvasElement | string | boolean, autoResize = true): void {
		switch (typeof x) {
			case "string":
				let c = document.querySelector(x);
				if (c instanceof HTMLCanvasElement) {
					this.canvas = c;
				} else {
					throw new Error("Could not find a canvas element matchd by selector:" + x);
				}
				break;
			case "object":
				this.canvas = x;
				break;
			case "boolean":
				autoResize = x;
			default:
				this.canvas = document.createElement("canvas");
				this.canvas.style.background = "black";
				document.addEventListener("DOMContentLoaded", e => {
					document.body.appendChild(this.canvas as HTMLCanvasElement);
				});
		}

		this.canvas.classList.add("wte-canvas");
		this.setAutoResize(autoResize);
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
}

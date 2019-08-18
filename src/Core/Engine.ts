import { Renderer } from "./Renderer";

export class Engine {
	private readonly FRAME_RATE = 60;
	private readonly TICK_RATE = 60;
	private limitFps: boolean = true;
	private fps: number = 0;
	private tps: number = 0;
	private running: boolean = false;
	private focused: boolean = true;
	private wasUnfocused: boolean = false;

	private _renderer: Renderer;

	public constructor() {
		this._renderer = new Renderer();

		document.addEventListener("visibilitychange", e => {
			this.focused = document.visibilityState === "visible";
			if (!this.focused) this.wasUnfocused = true;
		});
	}

	public start(): void {
		this.running = true;
		this.loop();
	}

	public stop(): void {
		this.running = false;
	}

	private async loop(): Promise<void> {
		let last: number, timer: number;
		last = timer = performance.now();
		let frames: number, ticks: number;
		let drawRate = 1000 / this.FRAME_RATE;
		let tickRate = 1000 / this.TICK_RATE;
		let deltaR: number, deltaU: number;
		deltaR = deltaU = 0;
		frames = ticks = 0;

		let mainLoop = (timestamp: number) => {
			if (this.wasUnfocused) {
				timer += timestamp - last;
				last = timestamp;
				this.wasUnfocused = false;
			}
			if (this.limitFps) {
				deltaR += (timestamp - last) / drawRate;
			}
			deltaU += (timestamp - last) / tickRate;
			last = timestamp;

			while (deltaU >= 1.0) {
				this.update(deltaU);
				ticks++;
				deltaU -= 1.0;
			}

			if (this.limitFps) {
				if (deltaR >= 1.0) {
					this.render(this.renderer.gl);
					frames++;
					deltaR %= 1;
				}
			} else {
				this.render(this.renderer.gl);
				frames++;
			}

			if ((timestamp - timer) / 1000.0 >= 1.0) {
				this.fps = frames;
				this.tps = ticks;
				frames = ticks = 0;
				timer += 1000;
				console.debug("FPS:", this.fps, "TPS:", this.tps, "delta:", deltaU + 1);
			}
			if (this.running) {
				requestAnimationFrame(mainLoop);
			}
		};
		requestAnimationFrame(mainLoop); // start the loop
	}

	private update(delta: number): void {}

	private render(gl: WebGLRenderingContext | null): void {
		if (gl) {
			gl.clearColor(0.1, 0.1, 0.1, 1.0);
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		}
	}

	public get renderer() {
		return this._renderer;
	}
}

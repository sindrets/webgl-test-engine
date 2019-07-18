export class Engine {
	private readonly FRAME_RATE = 60;
	private readonly TICK_RATE = 60;
	private limitFps: boolean = true;
	private fps: number = 0;
	private tps: number = 0;
	private running: boolean = false;
	private focused: boolean = true;

	public constructor() {
		document.addEventListener("visibilitychange", e => {
			this.focused = document.visibilityState === "visible";
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
				while (deltaR >= 1.0) {
					this.render();
					frames++;
					deltaR %= 1;
				}
			} else {
				this.render();
				frames++;
			}

			let t = (timestamp - timer) / 1000.0;
			if (t >= 1.0) {
				this.fps = frames;
				this.tps = ticks - ticks * (t - 1.0);
				frames = ticks = 0;
				timer += 1000;
			}
			if (this.running) {
				requestAnimationFrame(mainLoop);
			}
		};
		requestAnimationFrame(mainLoop); // start the loop
	}

	private update(delta: number): void {}

	private render(): void {
		if (!this.focused) return;
	}
}

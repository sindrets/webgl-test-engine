import { Engine } from "./Core/Engine";
import * as WTE from "./Headers";

declare global {
	interface Window {
		engine: Engine;
		wte: typeof WTE;
	}
	const engine: Engine;
	const wte: typeof WTE;
}
export * from "./Headers";

let engine = new Engine();
window.engine = engine;
console.log(engine);
engine.start();

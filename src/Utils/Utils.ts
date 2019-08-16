import { vec2 } from "gl-matrix";
import { CssUtils } from "./CssUtils";

/**
 * A collection of useful functions
 */
export class Utils {
	private static uidCounter: number = 0;

	/**
	 * Returns a new Unique ID.
	 */
	public static getUid(): number {
		return Utils.uidCounter++;
	}

	/** Converts degrees to radians */
	public static toRadians(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	/** Converts radians to degrees */
	public static toDegrees(radians: number): number {
		return (radians * 180) / Math.PI;
	}

	/** Return the difference between two values */
	public static dif(a: number, b: number): number {
		return Math.abs(a - b);
	}

	/** Return the value if it belongs between the given range. Otherwise
	return the closest of the extremes. */
	public static clamp(value: number, min: number, max: number): number {
		if (value < min) return min;
		if (value > max) return max;
		return value;
	}

	/** Returns true if the two ranges overlap */
	public static rangeIntersect(min0: number, max0: number, min1: number, max1: number): boolean {
		return (
			Math.max(min0, max0) >= Math.min(min1, max1) &&
			Math.min(min0, max0) <= Math.max(min1, max1)
		);
	}

	/** Returns true if both numbers have the same sign */
	public static sameSign(a: number, b: number): boolean {
		return a * b >= 0;
	}

	/** Linearly interpolate between a and b.
	 * Weight t should be in the range [0.0, 1.0] */
	public static lerp(a: number, b: number, t: number): number {
		return (1.0 - t) * a + t * b;
	}

	/** Splice and return the first element from an array. */
	public static spliceFirst(array: Array<any>): any {
		return array.splice(0, 1)[0];
	}

	/** Splice and return the last element from an array. */
	public static spliceLast(array: Array<any>): any {
		return array.splice(array.length - 1, 1)[0];
	}

	/**
	 * Returns a float between 0 and 1 inclusive, as a logistic function of t.
	 * @param t Time progression. Should be a float between 0 and 1, inclusive.
	 * @param a Horizontal offset. Should be a positive number for sensical results.
	 * @param b Curvature. Setting this to 0 results in a linear function.
	 */
	public static logisticProgression(t: number, a: number, b: number): number {
		let f_t = 1 / (1 + a * Math.E ** (-b * (t - 0.5) * 2));
		let f_1 = 1 / (1 + a * Math.E ** -b);
		let f_0 = 1 / (1 + a * Math.E ** b);
		let g_t = f_t + (1 - f_1);
		let g_0 = f_0 + (1 - f_1);
		return g_t - g_0 * (1 - t);
	}

	public static weightedSine(t: number, a: number, b: number): number {
		// f(x) = sin((x - 0.5) π) / 2 + 0.5
		// p(x) = -(-x + 1)^a + 1
		// g(x) = f(p(x))^b
		let p_t = -((-t + 1) ** a) + 1;
		return (Math.sin((p_t - 0.5) * Math.PI) / 2 + 0.5) ** b;
	}

	/**
	 * Returns a float between 0 and 1 inclusive, representing progression through a
	 * cubic bézier curve defined by its four given control points.
	 * @param t Time progression. Should be a float between 0 and 1, inclusive.
	 * @param c1 Control point 1.
	 * @param c2 Control point 2.
	 * @param c0 Control point 0. Defaults to (0,0).
	 * @param c3 Control point 3. Defaults to (1,1).
	 */
	public static cubicBezier(
		t: number,
		c1: vec2 | [number, number],
		c2: vec2 | [number, number],
		c0: vec2 | [number, number] = vec2.fromValues(0, 0),
		c3: vec2 | [number, number] = vec2.fromValues(1, 1),
	) {
		let a = [(1 - t) * c0[0] + t * c1[0], (1 - t) * c0[1] + t * c1[1]];
		let b = [(1 - t) * c1[0] + t * c2[0], (1 - t) * c1[1] + t * c2[1]];
		let c = [(1 - t) * c2[0] + t * c3[0], (1 - t) * c2[1] + t * c3[1]];
		let d = [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]];
		let e = [(1 - t) * b[0] + t * c[0], (1 - t) * b[1] + t * c[1]];
		let f = [(1 - t) * d[0] + t * e[0], (1 - t) * d[1] + t * e[1]];
		return f[1];
	}

	public static fmod(a: number, b: number) {
		return Number((a - Math.floor(a / b) * b).toPrecision(8));
	}

	public static cutStr(text: string, index: number, deleteCount: number): string {
		return text.substr(0, index) + text.substr(index + deleteCount);
	}

	public static cutString(text: string, start: number, end: number): string {
		return text.substr(0, start) + text.substr(end);
	}

	/**
	 * Loads a font face through the compatibillity-safe CSS injection method.
	 * @param fontName The name of the font family.
	 * @param url The URL to the font file.
	 */
	public static loadFont(
		fontName: string,
		url: string,
		properties?: { fontStyle: string; fontWeight: string },
	): void {
		let sheet = CssUtils.getStyleSheet("#strum-2d-fonts");
		if (sheet) {
			if (!properties) properties = { fontStyle: "normal", fontWeight: "400" };
			sheet.insertRule(
				`@font-face {
					font-family: '${fontName}';
					font-style: ${properties.fontStyle};
					font-weight: ${properties.fontWeight};
					src: url(${url});
				}`,
			);
		}
	}

	/**
	 * EXPERIMENTAL - Loads a font face from a url using the new experimental FontFace API.
	 * @param fontName The name of the font family.
	 * @param url A URL to a font file
	 * @param callback A function that is called when the font is loaded.
	 */
	public static loadFontFace(
		fontName: string,
		url: string,
		callback?: (fontFace: any) => void,
	): void {
		// check compatibillity
		// @ts-ignore
		if (!window.FontFace) {
			console.info(
				"Your browser does not support the FontFace API. Falling back to CSS injection. Please use either Chrome or Firefox.",
			);
			return Utils.loadFont(fontName, url);
		}
		// @ts-ignore
		let fontFace = new FontFace(fontName, "url(" + url + ")");
		// @ts-ignore
		document.fonts.add(fontFace);
		fontFace.loaded.then((fontFace: any) => {
			console.log("Font '" + fontFace.family + "' loaded successfully.");
			if (callback) callback(fontFace);
		});
		fontFace.load(); // Force load the fontface. The browser might choose not to otherwise
	}
}

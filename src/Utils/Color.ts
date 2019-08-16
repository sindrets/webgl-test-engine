interface RGB {
	red: number;
	green: number;
	blue: number;
}
interface HSV {
	hue: number;
	saturation: number;
	value: number;
}

export class Color {
	private _red: number;
	private _green: number;
	private _blue: number;
	private _alpha: number;
	constructor(r: number, g: number, b: number, a = 1.0) {
		this._red = r % 256;
		this._green = g % 256;
		this._blue = b % 256;
		this._alpha = a;
	}

	public static fromHSV(h: number, s: number, v: number): Color {
		let f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
		return new Color(f(5), f(3), f(1));
    }
    
    public get red() {
        return this._red;
    }
    public get green() {
        return this._green;
    }
    public get blue() {
        return this._blue;
    }
    public get alpha() {
        return this._alpha;
    }

	public getRGB(): RGB {
		return { red: this._red, green: this._green, blue: this._blue };
	}

	public getHSV(): HSV {
		const r = this._red / 255;
		const g = this._green / 255;
		const b = this._blue / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;

		let h: number = 0;
		let s: number = 0;
		let v: number = 0;
		if (max == min) {
			h = 0;
		} else if (max == r) {
			h = 60 * ((g - b) / delta);
		} else if (max == g) {
			h = 60 * ((b - r) / delta + 2);
		} else if (max == b) {
			h = 60 * ((r - g) / delta + 4);
		}
		if (h < 0) {
			h += 360;
		}

		if (max != 0) {
			s = (max - min) / max;
		}

		v = max;

		return { hue: h, saturation: s, value: v };
	}

	public setRed(r: number) {
		this._red = r % 256;
	}
	public setGreen(g: number) {
		this._green = g % 256;
	}
	public setBlue(b: number) {
		this._blue = b % 256;
    }
    public setAlpha(a: number) {
        this._alpha = a;
    }
    
    public setFromColor(c: Color): void {
        this._red = c._red;
        this._green = c._green;
        this._blue = c._blue;
        this._alpha = c._alpha;
    }

	public setFromRGB(r: number, g: number, b: number): void;
	public setFromRGB(rgb: [number, number, number]): void;
	public setFromRGB(rgb: RGB): void;
	public setFromRGB(x: number | [number, number, number] | RGB, g?: number, b?: number): void {
		if (typeof x === "number") {
			this.setRed(x);
			this.setGreen(g as number);
			this.setBlue(b as number);
		} else if (x instanceof Array) {
			this.setRed(x[0]);
			this.setGreen(x[1]);
			this.setBlue(x[2]);
		} else {
			this.setRed(x.red);
			this.setGreen(x.green);
			this.setBlue(x.blue);
		}
    }
    
    public setFromHSV(h: number, s: number, v: number): void;
	public setFromHSV(hsv: [number, number, number]): void;
	public setFromHSV(hsv: HSV): void;
	public setFromHSV(x: number | [number, number, number] | HSV, s?: number, v?: number): void {
        let c: Color;
        if (typeof x === "number") {
            c = Color.fromHSV(x, s as number, v as number);
		} else if (x instanceof Array) {
            c = Color.fromHSV(x[0], x[1], x[2]);
		} else {
			c = Color.fromHSV(x.hue, x.saturation, x.value);
        }
        this.setFromColor(c);
    }
}

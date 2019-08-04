export class Shader {
	private _gl: WebGL2RenderingContext;
	private _type: GLenum;
	private _identifier: string;
	private _shader: WebGLShader | null = null;
	private _source?: string;
	private _valid: boolean = false;
	private _compiled: boolean = false;

	constructor(context: WebGL2RenderingContext, type: GLenum, identifier?: string) {
		if (identifier === undefined) {
			switch (type) {
				case WebGLRenderingContext.FRAGMENT_SHADER:
					identifier = "FragmentShader";
					break;
				case WebGLRenderingContext.VERTEX_SHADER:
					identifier = "VertexShader";
					break;
				default:
					throw new Error(
						`Expected type to be either FRAGMENT_SHADER ` +
							`(${WebGLRenderingContext.FRAGMENT_SHADER}) or a VERTEX_SHADER ` +
							`(${WebGLRenderingContext.VERTEX_SHADER}), given ${type}.`,
					);
			}
		}

		this._gl = context;
		this._identifier = identifier;
		this._type = type;
	}

	public create(source?: string, compile = true): WebGLShader | null {
		this._shader = this.gl.createShader(this._type);
		this._compiled = false;
		this._source = source;
		this._valid = this.gl.isShader(this._shader);

		if (source && compile) {
			this.compile();
		}

		return this._shader;
	}

	public delete(): void {
		if (this._shader) {
			this.gl.deleteShader(this._shader);
			this._shader = null;
			this._valid = false;
			this._compiled = false;
		}
	}

	public compile(): void {
		if (this._shader && this._source !== undefined) {
			this.gl.shaderSource(this._shader, this._source);
			this.gl.compileShader(this._shader);

			this._compiled = this.gl.getShaderParameter(this._shader, this.gl.COMPILE_STATUS);
			if (!this._compiled) {
				console.error(
					`Failed to compile shader '${this._identifier}': ${this.gl.getShaderInfoLog(
						this._shader,
					)}`,
				);
			}
		}
	}

	public set source(source: string) {
		this._source = source;
	}
	public get gl(): WebGL2RenderingContext {
		return this._gl;
	}
	public get shader(): WebGLShader | null {
		return this._shader;
	}
	public get type(): GLenum {
		return this._type;
	}
}

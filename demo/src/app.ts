import { glMatrix, mat4 } from "gl-matrix";

async function main() {
	engine.renderer.init();

	const gl = engine.renderer.gl;
	const canvas = engine.renderer.canvas;

	if (gl && canvas) {
		const vertShader = new wte.Shader(gl, gl.VERTEX_SHADER);
		const fragShader = new wte.Shader(gl, gl.FRAGMENT_SHADER);

		await vertShader.createFromFile("/src/shaders/vertShader.vert");
		await fragShader.createFromFile("/src/shaders/fragShader.frag");
		console.log(vertShader, fragShader);

		const program = gl.createProgram() as WebGLProgram;
		gl.attachShader(program, vertShader.shader as WebGLShader);
		gl.attachShader(program, fragShader.shader as WebGLShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("ERROR linking program!", gl.getProgramInfoLog(program));
			return;
		}
		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
			console.error("ERROR validating program!", gl.getProgramInfoLog(program));
			return;
		}

		var boxVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

		var boxIndexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

		var positionAttribLocation = gl.getAttribLocation(program, "vertPos");
		var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
		gl.vertexAttribPointer(
			positionAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			false,
			6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0, // Offset from the beginning of a single vertex to this attribute
		);
		gl.vertexAttribPointer(
			colorAttribLocation, // Attribute location
			3, // Number of elements per attribute
			gl.FLOAT, // Type of elements
			false,
			6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			3 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beginning of a single vertex to this attribute
		);

		gl.enableVertexAttribArray(positionAttribLocation);
		gl.enableVertexAttribArray(colorAttribLocation);

		// Tell OpenGL state machine which program should be active.
		gl.useProgram(program);

		var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
		var matViewUniformLocation = gl.getUniformLocation(program, "mView");
		var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

		console.log(mat4);
		var worldMatrix = mat4.create();
		var viewMatrix = mat4.create();
		var projMatrix = mat4.create();
		mat4.identity(worldMatrix);
		mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
		mat4.perspective(
			projMatrix,
			glMatrix.toRadian(45),
			canvas.clientWidth / canvas.clientHeight,
			0.1,
			1000.0,
		);
		console.log(canvas.clientWidth, canvas.clientHeight);

		gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
		gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
		gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

		var xRotationMatrix = mat4.create();
		var yRotationMatrix = mat4.create();

		var identityMatrix = mat4.create();
		mat4.identity(identityMatrix);
		var angle = 0;
		(engine as any).render = () => {
			// @ts-ignore
			if (window.updateProj) window.updateProj();
			angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
			mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
			mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
			mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

			gl.clearColor(0.15, 0.15, 0.15, 1.0);
			gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		};

		(window as any).updateProj = function() {
			mat4.perspective(
				projMatrix,
				glMatrix.toRadian(45),
				canvas.clientWidth / canvas.clientHeight,
				0.1,
				1000.0,
			);
			gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
		};
	}
}

// prettier-ignore
var boxVertices = [ 
	// X, Y, Z           R, G, B
	// Top
	-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
	-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
	1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
	1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

	// Left
	-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
	-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
	-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
	-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

	// Right
	1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
	1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
	1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
	1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

	// Front
	1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
	1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
	-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

	// Back
	1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
	1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
	-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

	// Bottom
	-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
	-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
	1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
	1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
];

// prettier-ignore
var boxIndices = [
	// Top
	0, 1, 2,
	0, 2, 3,

	// Left
	5, 4, 6,
	6, 4, 7,

	// Right
	8, 9, 10,
	8, 10, 11,

	// Front
	13, 12, 14,
	15, 14, 12,

	// Back
	16, 17, 18,
	16, 18, 19,

	// Bottom
	21, 20, 22,
	22, 20, 23
];

main();

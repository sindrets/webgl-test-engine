#version 300 es

precision mediump float;

in vec3 vertPos;
in vec3 vertColor;
out vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() {
	fragColor = vertColor;
	gl_Position = mProj * mView * mWorld * vec4(vertPos, 1.0);
}

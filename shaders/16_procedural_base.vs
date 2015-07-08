/*

16_procedural_base.vs: Vertex shader per gli esempi sul texturing procedurale.
E' uguale a 09_texturing_base.vs
autore: Davide Gadia

Programmazione Grafica per il Tempo Reale - a.a. 2014/2015
C.d.L. Magistrale in Informatica
Universita' degli Studi di Milano

*/

precision mediump float;

// matrice di modellazione e di vista
uniform mat4 modelViewMatrix;
// matrice di proiezione
uniform mat4 projectionMatrix;

// posizione vertice in coordinate mondo
attribute vec3 position;

// coordinate UV del modello
attribute vec2 uv;

varying vec2 vUv;

void main()
{
	// prendo le coordinate UV e le assegno a una var varying
	vUv = uv;
	
	// calcolo posizione vertici in coordinate vista
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

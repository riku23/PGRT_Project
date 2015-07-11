/*
14_cooktorrance_tex.vs: Vertex shader per il modello di illuminazione di Cook-Torrance

Uso texture invece che colore.

autore: Davide Gadia

Programmazione Grafica per il Tempo Reale - a.a. 2014/2015
C.d.L. Magistrale in Informatica
Universita' degli Studi di Milano

*/

// matrice di modellazione e vista
uniform mat4 modelViewMatrix;
// matrice di vista
uniform mat4 viewMatrix;
// matrice di proiezione
uniform mat4 projectionMatrix;
// matrice di trasformazione delle normali (= trasposta dell'inversa della della model-view)
uniform mat3 normalMatrix;
// posizione vertice in coordinate mondo
attribute vec3 position;
// normale vertice in coordinate mondo
attribute vec3 normal;

// la posizione della point light è passata come uniform
// NB) anche in questo caso, se ci fossero + luci e di diverso tipo, lo shader dovrebbe essere modificato con un ciclo for, e con diversa considerazione di direzioni, angoli di cutoff per gli spotlight ecc
uniform vec3 pointLightPosition1;
uniform vec3 pointLightPosition2;



// coordinate UV del modello
attribute vec2 uv;

varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 lightDir1;
varying vec3 lightDir2;


void main(){

  vUv = uv;

  // posizione vertice in coordinate ModelView (vedere ultima riga per il calcolo finale della posizione in coordinate camera)
  // position è la variabile predefinita per le coordinate del vertice della mesh
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 mvpPosition = projectionMatrix * mvPosition;

  // calcolo della direzione di vista, negata per avere il verso dal vertice alla camera
  vViewPosition = -mvPosition.xyz;
  // trasformazione coordinate normali in coordinate vista 
  vNormal = normalize( normalMatrix * normal );

  // calcolo del vettore di incidenza della luce.
  vec4 lightPos1 = viewMatrix  * vec4( pointLightPosition1, 1.0 );
  lightDir1 = lightPos1.xyz - mvPosition.xyz;

  vec4 lightPos2 = viewMatrix  * vec4( pointLightPosition2, 1.0 );
  lightDir2 = lightPos2.xyz - mvPosition.xyz;    

  
    

  

  // calcolo posizione vertici in coordinate vista
  gl_Position = mvpPosition;

}
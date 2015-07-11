/*
24_cooktorrance_marble.fs: Fragment shader per il modello di illuminazione di Cook-Torrance

Uso tecnica procedurale di 23_marble.fs per creare una texture procedurale da usare
per il colore dell'oggetto

autore: Davide Gadia

Programmazione Grafica per il Tempo Reale - a.a. 2014/2015
C.d.L. Magistrale in Informatica
Universita' degli Studi di Milano

*/

// attivo l'estensione che permette di utilizzare le funzioni dFdx e dFdy
// in WebGL
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float; //set default precision in glsl es 2.0

const float PI = 3.14159;


uniform float m; // rugosità superficie - 0 : smooth, 1: rough
uniform float F0; // fresnel reflectance at normal incidence
uniform float Kd; // fraction of diffuse reflection (specular reflection = 1 - k)
    
// parametri di forza e potenza del rumore
uniform float frequency;
uniform float power;

uniform vec3 diffuseColor; 


//uniform che indica la texture in memoria
uniform sampler2D tex;

// numero di ottave da creare e sommare
// In Webgl, la condizione di un ciclo for non può essere un uniform
const int harmonics = 4;

//variabile con i valori delle uv interpolate tra vertice e vertice
varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 lightDir1;
varying vec3 lightDir2;
varying vec3 lightDir3;
varying vec3 lightDir4;


// devo copiare e incollare il codice all'interno del codice del mio shader
// non è possibile includere o linkare un file esterno
////////////////////////////////////////////////////////////////////
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }
  ////////////////////////////////////////////////////////////////////

// Funzione Turbulence
// la funzione crea tramite un ciclo for un numero di ottave harmonics,
// dimezzando la potenza e raddoppiano la frequanza ad ogni passo
float turbulence_abs()
{

  float p = power;
  float f = frequency;

  float value = 0.0;
  for (int i=0;i<harmonics;i++)
  {
      value += p*abs(snoise(vec3(vUv*f, 0.0)));
      p*=0.5;
      f*=2.0;
  }
  return value;
}

float sum_specular(vec3 N, vec3 L, inout float NdotL, float old_specular){
    NdotL = max(dot(N, L), 0.0);

    if(NdotL > 0.0){
        vec3 V = normalize( vViewPosition );    
        
        // half vector
        vec3 H = normalize(L + V);

        // implementazione delle formule viste nelle slide
        // spezzo in componenti

        // preparo gli angoli e i parametri che mi serviranno per il calcolo delle varie componenti
        float NdotH = max(dot(N, H), 0.0); 
        float NdotV = max(dot(N, V), 0.0); 
        float VdotH = max(dot(V, H), 0.0);
        float mSquared = m * m;

        // Attenuazione geometrica G
        float NH2 = 2.0 * NdotH;
        float g1 = (NH2 * NdotV) / VdotH;
        float g2 = (NH2 * NdotL) / VdotH;
        float geoAtt = min(1.0, min(g1, g2));

        // Rugosità D
        // Distribuzione di Beckmann
        // posso semplificare la tangente all'esponente cosi':
        // tan = sen/cos -> tan^2 = sen^2/cos^2 -> tan^2 = (1-cos)^2/cos^2
        float r1 = 1.0 / ( 4.0 * mSquared * pow(NdotH, 4.0));
        float r2 = (NdotH * NdotH - 1.0) / (mSquared * NdotH * NdotH);
        float roughness = r1 * exp(r2);

        // Riflettanza di Fresnel F (approx Schlick)
        float fresnel = pow(1.0 - VdotH, 5.0);
        fresnel *= (1.0 - F0);
        fresnel += F0;

        return old_specular += ((fresnel * geoAtt * roughness) / (NdotV * NdotL * PI));

        
        } else {return old_specular;}   
    }

void main()
{
    // creo la turbolenza sulla base dei parametri passati dall'utente.
    float value = turbulence_abs();

    // uso il valore della turbolenza per accedere all'interno di una texture
    // contente un gradiente di colore. In questo modo mappo i valori da 0.0 a 1.0
    // del noise al range 0.0 - 1.0 delle coordinate UV della texture.
    // Le texture utilizzate sono "orizzontali", quindi uso value solo sulle s, usando altre texture
    // va adattata la costruzione del vec2.
    vec4 surfaceColor = texture2D(tex, vec2(value, 1.0));

    vec3 N = normalize(vNormal);
    vec3 L1 = normalize(lightDir1.xyz);
    vec3 L2 = normalize(lightDir2.xyz);
    vec3 L3 = normalize(lightDir3.xyz);
    vec3 L4 = normalize(lightDir4.xyz);    

    float NdotL1 = 0.0;
    float NdotL2 = 0.0;
    float NdotL3 = 0.0;
    float NdotL4 = 0.0;

    float specular = 0.0;
    
    specular = sum_specular(N,L1, NdotL1, specular);
    specular = sum_specular(N,L2, NdotL2, specular);       
    specular = sum_specular(N,L3, NdotL3, specular);
    specular = sum_specular(N,L4, NdotL4, specular);

    
 
    
    // calcolo colore finale con anche la componente diffusiva
    vec4 finalValue = surfaceColor * (NdotL1+NdotL2+NdotL3+NdotL4) * vec4(diffuseColor, 1.0) * (Kd + specular * (1.0 - Kd));
    gl_FragColor = finalValue;
}
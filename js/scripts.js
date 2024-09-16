let contador_basuras = 0; // contador basuras eliminadas
const elemento_basura = document.getElementById('basura');
const elemento_contador_basuras = document.getElementById('contador_basuras');

let contador_satelites = 0; // contador satelites destruidos
const elemento_satelite = document.getElementById('satelite');
const elemento_contador_satelites = document.getElementById('contador_satelites');

const elemento_contador_puntos = document.getElementById('contador_puntos');

const TIEMPO_EXPLOSION = 500;
const TIEMPO_DESAPARICION_SATELITE = 2000;

// const PUNTOS_BASURA_ELIMINADA = 1000;
const PUNTOS_SATELITE_SALVADO = 1000;
const PUNTOS_SATELITE_DESTRUIDO = -1000;
const TIEMPO_DECRECIMIENTO_PUNTOS_BASURA_ELIMINADA = 5000;

let temporizador = new Date();
let puntos = 0;

let disparando = false; // Variable lógica para saber si está ocurriendo un disparo
let satelite_aparecido; 


/* GRAFICOS DISPARO */
const puntoFijo = document.getElementById('punto_fijo');
const linea_disparo = document.getElementById('linea_disparo');
// Obtener la posición del punto fijo en la ventana
const rect = puntoFijo.getBoundingClientRect();
const fixedX = rect.left + rect.width / 2;
const fixedY = rect.top + rect.height / 2;
/* GRAFICOS DISPARO */

elemento_basura.addEventListener('click', () => {
    elemento_basura.classList.add('disparado')
    setTimeout(() => {
        contador_basuras = contador_basuras + 1;
        elemento_basura.classList.remove('disparado')                    
        elemento_contador_basuras.value = contador_basuras;
        // console.log('He limpiado ' + contador_basuras + ' basuras');
        siguienteElemento('basura_eliminada');
    }, TIEMPO_EXPLOSION);
});

elemento_satelite.addEventListener('click', () => {
    clearTimeout(satelite_aparecido);
    elemento_satelite.classList.add('disparado')
    setTimeout(() => {
        contador_satelites = contador_satelites + 1;
        elemento_satelite.classList.remove('disparado')                    
        elemento_contador_satelites.value = contador_satelites;
        // console.log('He destruido ' + contador_satelites + ' satelites');
        disparando = false;
        siguienteElemento('satelite_destruido');
    }, TIEMPO_EXPLOSION);
    
});

function siguienteElemento(evento) {
    evaluarPuntos(evento);
    let aleatorio = Math.floor(Math.random() * 2) + 1; // Math.random() devuelve un valor entre 0 y 1. 
    let elemento;

    if (aleatorio == 1) {
        elemento = elemento_basura;
        elemento_basura.classList.remove('no-visible');
        elemento_satelite.classList.add('no-visible');
    } else {
        elemento = elemento_satelite;
        elemento_basura.classList.add('no-visible');
        elemento_satelite.classList.remove('no-visible');
        satelite_aparecido = setTimeout(() => {
            siguienteElemento('satelite_salvado')
        }, TIEMPO_DESAPARICION_SATELITE);
    }
    cambiarPosicion(elemento);
    elemento_contador_puntos.value = puntos;
    // console.log(`PUNTOS: ${puntos}`);
}

function cambiarPosicion(elemento) {
    let x = Math.random() * 90;
    let y = Math.random() * 90;
    // console.log('x: ' + x);
    // console.log('y: ' + y);

    elemento.style = "top: " + y + 'vh; left: ' + x + '%';

    cambiarSentidoYVelocidad();

    temporizador = new Date();
}

function cambiarSentidoYVelocidad(elemento){
    const rotacionAleatoriaInicial = Math.floor(Math.random() * 360);
    let aleatorio = Math.floor(Math.random() * 2);
    
    let rotacionAleatoriaMedia, rotacionAleatoriaFinal;
    if (aleatorio) {
        rotacionAleatoriaMedia = rotacionAleatoriaInicial + 180;
        rotacionAleatoriaFinal = rotacionAleatoriaInicial + 360;
    } else {
        rotacionAleatoriaMedia = rotacionAleatoriaInicial - 180;
        rotacionAleatoriaFinal = rotacionAleatoriaInicial - 360;
    }
    
    elemento.style.setProperty('--rotacion-inicial', rotacionAleatoriaInicial + 'deg');
    elemento.style.setProperty('--rotacion-media', rotacionAleatoriaMedia + 'deg');
    elemento.style.setProperty('--rotacion-final', rotacionAleatoriaFinal + 'deg');

    const velocidadRotacion = Math.floor(Math.random() * 200) + 10;
    elemento.style.setProperty('animation', 'rotacionEscala ' + velocidadRotacion + 's infinite');
}

function evaluarPuntos(evento = null) {
    switch (evento) {
        case 'satelite_salvado':
            puntos += PUNTOS_SATELITE_SALVADO;
            break;
        case 'satelite_destruido':
            puntos += PUNTOS_SATELITE_DESTRUIDO;
            break;
        case 'basura_eliminada':
            // puntos += PUNTOS_BASURA_ELIMINADA;
            evaluarPuntosPorTiempo();
            break;
    }
}

function evaluarPuntosPorTiempo() {
    const ahora = new Date();
    const diferencia = ahora.getTime() - temporizador.getTime();

    if (diferencia < TIEMPO_DECRECIMIENTO_PUNTOS_BASURA_ELIMINADA) {
        puntos += TIEMPO_DECRECIMIENTO_PUNTOS_BASURA_ELIMINADA - diferencia;
        if (puntos < 0) {
            puntos = 0;
        }
    }
}

// document.addEventListener('mousemove', (event) => {
//     const mouseX = event.clientX;
//     const mouseY = event.clientY;

//     // Actualizar los atributos del SVG <line>
//     linea.setAttribute('x1', fixedX);
//     linea.setAttribute('y1', fixedY);
//     linea.setAttribute('x2', mouseX);
//     linea.setAttribute('y2', mouseY);
// });

document.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Actualizar los atributos del SVG <line>
    linea_disparo.setAttribute('x1', fixedX);
    linea_disparo.setAttribute('y1', fixedY);
    linea_disparo.setAttribute('x2', mouseX);
    linea_disparo.setAttribute('y2', mouseY);

    linea_disparo.setAttribute('visibility', 'visible');
    setTimeout(() => {
        linea_disparo.setAttribute('visibility', 'hidden');
    }, 100);
});
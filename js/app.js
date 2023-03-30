//Creando selectores

const resultado = document.querySelector('#galery'); 
const formulario = document.querySelector('#formulario');
const paginacion = document.querySelector('#paginacion'); 



const registrosPorPagina= 40; 
let terminoBusqueda='';  
let totalPaginas; 
let iterador;
let paginaActual = 1;  

//Esperando a que se cargue el documento para iniciar la App
document.addEventListener('DOMContentLoaded', iniciarApp()); 

function iniciarApp(){
    //Asignando el evento al formulario para que busque por el termino 
    formulario.addEventListener('submit', validarFormulario);

}

function validarFormulario(event){
    event.preventDefault(); 
    terminoBusqueda = document.querySelector('#termino').value;
    
    if(terminoBusqueda === ''){
        mostrarAlerta('No se ha introducido ningún termino de búsqueda'); 
        return;
    }
    
    buscarImagenes(); 

}


function buscarImagenes(){

    const terminoFormateado = terminoBusqueda.replace(/\s/g, '+'); 

    const key = '34836854-da1d64ecfd64d893ed64fb3e2'; 
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoFormateado}&lang=es&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            
            totalPaginas = calcularPaginas(resultado.totalHits); 
            
            mostrarImagenes(resultado.hits)}); 

}

//Generador que va a registrar la cantidad de elementos de acuerdo a las páginas

function *crearPaginador(total){
    for(let i=1; i<= total; i++){
        yield i; 
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina))
}

function mostrarImagenes(imagenes){
    // console.log(imagenes); 
    limpiarHTML(resultado)

    // Iterar sobre el arreglo de imagenes
    imagenes.forEach(imagen => {
        const {webformatURL, likes, views, largeImageURL, tags} = imagen; 
        //Se va concatenando imagen más imagen
        resultado.innerHTML += `
            <div> 
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" atl="${tags}">           
                    <img class= "galery__img" src="${webformatURL}">
                </a>
                <div>
                    <a href="${largeImageURL}" class="ver-botton" target="_blank" rel="noopener noreferrer">
                        Ver en tamaño completo
                    </a>                    
                </div>
            </div>
        `; 

    });

    imprimirPaginador(); 
    
}

function mostrarAlerta(mensaje){

    const alerta = document.querySelector('existe')

    if(!alerta){
       const alerta = document.createElement('P');
       alerta.classList.add('alerta', 'existe');  

       alerta.innerHTML = `
            
            <span >${mensaje}</span>
       `;
       resultado.appendChild(alerta); 

       //Elminar la alerta después de unos segundo 

       setTimeout(() => {
        alerta.remove(); 
    }, 3000);

    }  
}

function limpiarHTML(referencia){
    while(referencia.firstChild){
        referencia.removeChild(referencia.firstChild)
    }
}


function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas); 
    limpiarHTML(paginacion); //Limpiando la paginación previa

    while(true){
        const {value, done } = iterador.next(); 
        if(done) return; 

        //Caso contrario, genera un boton por cada elemento en el generador

        const boton = document.createElement('a'); 
        boton.href = '#', 
        boton.dataset.pagina = value; 
        boton.textContent = value; 
        boton.classList.add('siguiente', 'bg-pink-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'rounded'); 

        boton.onclick =  () => {
            paginaActual = value; 
            buscarImagenes(); 
        }

        paginacion.appendChild(boton); 
    }

}

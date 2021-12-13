const criptomonedasSelect = document.querySelector('#criptomonedas'),
      monedaSelect = document.querySelector('#moneda'),
      formulario = document.querySelector('#formulario'),
      resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda:'',
    criptomoneda:''
};


// Creo un Promise mediante a una function expresion 
const obtenerCriptomonedas = criptomonedas => new Promise((resolve)=>{
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();

    formulario.addEventListener('submit',enviarFormulario);

    criptomonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);
});
function consultarCriptomonedas(){

    const url ='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedasE => selectCriptomoneda(criptomonedasE))
}
function selectCriptomoneda(arrayCriptomonedas){
    arrayCriptomonedas.forEach ( cripto =>{
        const {FullName,Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option)    
    })
}

function leerValor(e){
    // Esto pasa porque se mapean porque en el HTML tiene el name igual que en el objBusqueda
    objBusqueda[e.target.name] = e.target.value;
}
function enviarFormulario(e){
    e.preventDefault();
    const {moneda,criptomoneda} = objBusqueda;
    if(moneda===''||criptomoneda===''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }
    // Consultar API
    consultarAPI();
}
function mostrarAlerta(msj){
    const existe = document.querySelector('.error');
    if(!existe){
        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = msj;
    
        formulario.appendChild(alerta);
        setTimeout(()=>{
            alerta.remove();
        },3000);    
    };
};
function consultarAPI(){
    const { moneda,criptomoneda} = objBusqueda;
    const url =`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta =>respuesta.json())
        .then(cotizacion =>{ 
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        });
};
function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    console.log(cotizacion);
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio del dia es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio más Alto del dia es: <span>${HIGHDAY}</span>`
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio mas Bajo del dia es: <span>${LOWDAY}</span>`;

    const variacionPrecio = document.createElement('p');
    variacionPrecio.innerHTML = `Variación últimas 24hs <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacionPrecio);
    resultado.appendChild(ultimaActualizacion);
};

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
};
function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =`
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}

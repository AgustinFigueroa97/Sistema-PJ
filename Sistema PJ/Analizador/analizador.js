let line = new Array();
let ArrayObject = new Array();
let flagArchivo = 0;

function abrirArchivo(evento){
    
    console.log("Entre dentro de la funcion abrirArchivo");

    let archivo = evento.target.files[0]; // Este cero, es porque damos la posibilidad en este caso de abrir un archivo, se podría abrir mas si se le pone un atributo multiples al input.

    if(archivo){ // Si selecciono un archivo 

        console.log("Entre por que se abrio archivo");

        let reader = new FileReader();

        reader.onload = function(e){

            let contenido = e.target.result;

            let textArea = document.getElementById("TextArea_Contenido");

            textArea.value = "";

            let lineas = contenido.split('\n');

            if(line.length > 0){
                line = [];
            }

            for(let linea of lineas) {
                line.push(linea);
            }

            document.getElementById('TextArea_Contenido').value = contenido;

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Chat Cargado',
                showConfirmButton: false,
                timer: 800
            })

        }
        flagArchivo = 1; 

        reader.readAsText(archivo); // Queremos leer el contenido del archivo que ha cargado el usuario como texto

    }

}

// Evento para Abrir un archivo txt 
let InputArchivo = document.getElementById("Archivo_txt");
document.getElementById("Archivo_txt").addEventListener('change',(e) => {
    abrirArchivo(e);
});

function CrearArrayJSON(array){

    let sublinea = array;
    let mensaje;
    let mensajeAuxiliar; 
    let arrSplit;
    let fechaytexto;
    let fechaYhora;
    let msjCAS=""; // Mensaje Común o Archivo o del Sistema 
    let nombre=""; 
    let nombreyextension=""; 

    fechaytexto = sublinea.split(/\.? - /);/*  Esta expresión regular me permite particionar esta parte de un mensaje: 27/4/2022, 16:33" - "Papá: hola hijo todo bien? de esta manera en fecha y texto me quedaría por un lado toda la fecha y por otro, el nombre del auto junto con su mensaje, el hecho de haber incorporado también \.? en la ER es porque en algunos casos los mensajes estan de esta forma: 30/7/20 9:36 p. m". - "Papá: hola hijo todo bien? */

    let texto = fechaytexto[1];

    let nombreytexto = texto.split(/: (.*)/); // Esta ER me permite quedarme con esta parte de un mensaje "Papá:" hola hijo todo bien? el hecho de haber utilizado una ER es porque su uso solo el split(': ') si como parte del mensaje de una conversación también aparece ": " también cortará la cadena del mensaje, y no es lo que se pretende, esta ER hace que solo corte hasta el primer ": " y luego el resto si aparece nuevamente ": " no siga cortando. 

    if(nombreytexto[1] === undefined){
        nombre = "SistemaDeWhatsApp"; 
        msjCAS = fechaytexto[1];
    }else{ // Es un mensaje de un usuario, pero hay que ver el tipo de mensaje, si es un archivo o un mensaje común. 

        nombre = nombreytexto[0]; // Guardo el nombre del actor 
        mensaje = nombreytexto[1]; // Me fijo ahora el tipo de mensaje... 

        if(mensaje.includes(' (archivo adjunto)')){
            arrSplit = mensaje.split(' (archivo adjunto)');
            nombreyextension = arrSplit[0]; 
            mensajeAuxiliar = nombreytexto.splice(2); // Elimina los 2 primeros elementos, nombre del autor y nombre del archivo. 
            msjCAS = mensajeAuxiliar.join(""); // El join me juntaria todos los mensajes que se hayan puesto después del archivo enviado. 
            console.log("A ver que tiene msjCAS en archivos: \n"+msjCAS);
        }else{
            mensajeAuxiliar = nombreytexto.splice(1); // Elimino primer elemento, que corresponde al nombre del actor.   
            msjCAS = mensajeAuxiliar.join(""); // Junto el resto de los mensajes...  
        }
    }

     

    fechaYhora = fechaytexto[0].split(/\,? /); // Me quedo con la hora y la fecha. 

    ArrayObject.push({
        Nombre: nombre,
        Fecha: fechaYhora[0],
        Hora: fechaYhora[1],
        Mensaje: msjCAS,
        NameFileWhitExtension:nombreyextension
    }); 


}

function GenerarJSON(ArrayObject){

    let buttom = document.getElementById("Button_GJ");
    let json_content = JSON.stringify(ArrayObject, null, 2);
    // Create link elemento to force JSON file download
    let link = document.createElement("a");
    let file = new Blob([json_content], {type: 'JSON'});
    link.href = URL.createObjectURL(file);
    link.download = "js_data_Android.json";
    link.click();
    buttom.appendChild(link);

}


function GenerarMensajes(line){
    
    let actualIndex = 0; // Almacena el indice para una linea en particular

    let flag = 0; // Me avisa si siguen viniendo lineas. 

    let ERfechayhora = /\d{1,2}\/\d{1,2}\/\d{2,4}(,)? \d{1,2}:\d{2}( (p. m.|a. m.))?/; // Si aparece un nuevo formato en una exportación, modificar un poco esta ER, no sacando, sino agregando y en general agregar con ? es decir 0 o 1 vez, para que los demás formatos se sigan respetando. 

    let sublineaAuxiliar = ""; 

    /* Nota: La funcion .replace(/\s/g, " ") sirve para eliminar caracteres basura
    Si hay otro error, puede que no haya aplicado esta funcion en algun lado, veremos :B
    */
    
    for (let index = 0; index < line.length-1; index++) {

        let sublinea = line[index];

        let fecha = sublinea.split(' -'); // Corto hasta la fecha 

        if(!ERfechayhora.test(fecha[0].replace(/\s/g, " "))){ // Si es distinto de fecha 
            
            if(flag === 0){ // O sea antes había una fecha, es la primera vez que entra. 
                actualIndex = index -1; 
                line[index-1] = line[index-1].concat('\n' + line[index]);
                line[index].split(index,1); // Luego de haber concatenado, elimino el indice actual, ya que en mi arreglo no lo necesito mas. 
                flag = 1; 
            }else{
                line[index - (index-actualIndex)] = line[index - (index-actualIndex)].concat('\n'+line[index]);
                line[index].split(index,1);
            }
            
            sublineaAuxiliar = line[index - (index-actualIndex)];
            
            if(index === line.length-2){
                CrearArrayJSON(sublineaAuxiliar);
            }
            
        } else { // Comienza el texto con fecha 

            if(flag === 1){  // Antes venia de una concatenacion  
                CrearArrayJSON(sublineaAuxiliar);
            }

            if(ERfechayhora.test(line[index+1].split(' -')[0].replace(/\s/g, " "))){ // Si lo que viene despues es fecha, muestro la fecha actual
                CrearArrayJSON(line[index]);
            }

            if(index === line.length-2){ // Si es la ultima posicion, o sea lo ultimo que leo antes del "" de la ultima linea del txt 
                CrearArrayJSON(line[index]);
            }

            flag = 0;
        
        }
        
    } // Fin del for
    
    // En esta instancia ya tengo mi arreglo con todos los datos para convertir a JSON. 

    console.log(ArrayObject);

    GenerarJSON(ArrayObject);

}

// Evento para Generar el archivo JSON. 
let BtnGenerar = document.getElementById("Button_GJ");
BtnGenerar.addEventListener("click", () => {
    
    if(flagArchivo === 1){
        //console.log("Recupero el array");
        console.log(line);

        let copiaLineas = [];

        for (let index = 0; index < line.length; index++) {
            copiaLineas[index] = line[index];
        }
            
        GenerarMensajes(copiaLineas);

    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado ningún archivo!',
        }) 
    }
    
});
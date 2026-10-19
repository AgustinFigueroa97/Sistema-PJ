let flagArchivo = 0; 

let ArrayJSON = new Array();

let nombres = new Array(); 

let ArrayNameyText = new Array();


function download(filename, html) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function funExportar() {
    if (flagArchivo === 1) {
        let divChat = document.getElementById("idContenido").innerHTML;
        let divChatNuevo = divChat.replace(/\.\.\/Fuente\//g, "");

        /* Importante, el orden de las librerias importa che, primero tiene que ir tailwind..., luego el contenido del script y luego boostrap, sino no se ve bien */

        let cadenahtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chat Exportado</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                /* Aca va el contenido del CSS */
                .pull_left { float: left; }
                .pull_right { float: right; }
                .userpic { display: block; border-radius: 50%; overflow: hidden; }
                .userpic .initials { display: block; color: #fff; text-align: center; text-transform: uppercase; user-select: none; }
                .color_purple, .userpic5, .media_game .fill { background-color: #9884e8; }
                .color_orange, .userpic8, .media_contact .fill { background-color: #ff8c44; }
                body { margin: 0; font: 12px/18px 'Open Sans','Lucida Grande','Lucida Sans Unicode',Arial,Helvetica,Verdana,sans-serif; min-height: 90%; }
                html { height: 90%; }
                .cuerpo { background: #e5ddd5; }
                .gradiente {
                    text-align: center;
                    font-size: x-large;
                    background: linear-gradient(#009688 0%,#009688 130px, #d9dbd5 130px, #d9dbd5 100%);
                    color: white;
                }
                #ParrafoWhatsApp { color: white; }
                .margenDeArriba { margin-top: 10px; }
                .margenDeAbajo { margin-bottom: 10px; }
                .centrar { text-align: center; }
                .styleTextArea { border: 1px solid #ccc; }
            </style>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        </head>
        <body>
            <section class="h-screen flex overflow-hidden">
                <div class="bg-white w-2/12 p-6"></div>
                <div class="cuerpo w-8/12 overflow-auto">
                    <p class="gradiente px-20 py-6" style="text-align: center; font-size: xx-large;"> Conversación</p>
                    <hr></hr>
                    <br>
                    ${divChatNuevo}
                </div>
                <div class="bg-white w-2/12 p-6"></div>
            </section>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
        </body>
        </html>`;

        let filename = "ChatDeWhatsapp.html";
        download(filename, cadenahtml);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado ningún archivo!',
        });
    }
}

function SeleccionarNombre() {
    let selection = document.getElementById("Nombres_Personas");
    return selection.options[selection.selectedIndex];
}

function GuardarNombres(Array_JSON){
    let primeraVez = 0;
    let arrayNombres = new Array();
    let nombre;  
    
    for (let index = 0; index < Array_JSON.length; index++) {
        nombre = ArrayJSON[index].Nombre;

        if(nombre != "SistemaDeWhatsApp"){
            if(primeraVez === 0){
                arrayNombres.push(nombre);
                primeraVez = 1; 
            }else{
                if(!arrayNombres.includes(nombre)){
                    arrayNombres.push(nombre);
                }
            }
        }
    }
    return arrayNombres; 
}

function CargarNombresFront(nombres){

    for (let index = 0; index < nombres.length; index++) {
                    
        let objNameYText = {
            nombre:"",
            texto:""
        }
        objNameYText.nombre = nombres[index];
        // Falta el texto 
        ArrayNameyText.push(objNameYText);
        
    }

    const $nombresSelect = document.querySelector("#Nombres_Personas");
    
    const indice = $nombresSelect.selectedIndex;

    if(indice != -1){ // Ya existen elementos, elimino y luego abajo se creán 
        for (let i = $nombresSelect.options.length; i >= 0; i--) { // Este for es por si se habre otro chat en el html, sin actualizar. Por eso es que lo debo sacar lo viejo 
            $nombresSelect.remove(i);
        }
    }

    // Si no existen elementos, se crean... 
    for (let index = 0; index < nombres.length; index++) {
        const option = document.createElement('option');
        option.textContent = `${nombres[index]}`;
        $nombresSelect.appendChild(option);
    }
    
    const sinactor = document.createElement('option');
    sinactor.textContent = "Sin actor Principal";
    $nombresSelect.appendChild(sinactor);
    
}

function usaFiltro(){
    let idFecha = document.getElementById("Fecha");
    if(!(idFecha.value === "")){ // O sea si no es vacio, es porque se uso el filtro. 
        return true;
    }else{
        return false; 
    }
}

function toMs(dateStr) {
    // desarmamos el string por los '-' los descartamos y lo transformamos en un array
    let parts = dateStr.split("/");
    let newStr;
    console.log("parts[2] tiene: "+parts[2]); // año 
    console.log("parts[1] tiene: "+parts[1]); // mes 
    console.log("parts[0] tiene: "+parts[0]); // dia 
    console.log("La longitud del año es: "+parts[2].length);

    if(parts[2].length === 4){
        newStr = parts[2].substring(2, parts[2].length);
        console.log("El nuevo string tiene: "+newStr);
        return new Date(newStr, parts[1] - 1, parts[0]).getTime();
    }
    
    return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
}

function MensajesDinamicos(nombreSeleccionado, id_div, iniciales1, iniciales2, msjDelSistema, nombre, archivo, archivoAux, mensaje, fechaYhora){

    if(nombre != nombreSeleccionado){ // Actores Secundarios y Sistema de WhatsApp 

        let divFlex2 = document.createElement("div");

        if(nombre != msjDelSistema){
            divFlex2.classList.add('flex','mb-12'); // Mensaje de usuario
        }else{
            divFlex2.classList.add('flex','justify-center','items-center'); // Mensaje del Sistema 
        }

        id_div.appendChild(divFlex2);

        let divPull2 = document.createElement("div");

        if(nombre != msjDelSistema){ // Este control hace que si no es un mensaje normal, o sea es algo como el chat esta cifrado de extremo a extremo... que no cree el icono de usuario que esta abajo del mensaje. 
            divPull2.classList.add('pull_left', 'userpic_wrap', 'w-12', 'mr-4', 'self-end');
            divFlex2.appendChild(divPull2);
            console.log("Esta entrando para crear icono"); 
        }
        
        let divUserPic2 = document.createElement("div");
        divUserPic2.classList.add('userpic', 'userpic8');
        divUserPic2.style.width = '42px';
        divUserPic2.style.height = '42px';

        divPull2.appendChild(divUserPic2);

        let divInitials2 = document.createElement("div");
        divInitials2.classList.add('initials');
        divInitials2.style.lineHeight = '42px';
        divInitials2.textContent = `${iniciales2}`;

        divUserPic2.appendChild(divInitials2);

        let divFlexCol2 = document.createElement("div");

        if(nombre != msjDelSistema){
            divFlexCol2.classList.add('flex','flex-col');
        }else{
            divFlexCol2.classList.add('flex','mb-12','justify-center','items-center','flex-col');
        }

        divFlex2.appendChild(divFlexCol2);

        let divBg_white2 = document.createElement("div");

        if(nombre != msjDelSistema){ // Acá dependiendo del mensaje, tendrá un color el mensaje o otro color. 
            divBg_white2.classList.add('bg-white','p-6','w-96','rounded-3xl','rounded-bl-none', 'shadow-sm', 'mb-2');
        }else{
            divBg_white2.classList.add('bg-slate-200','p-6','w-full','rounded-3xl', 'shadow-sm', 'mb-2'); // Color azul, o sea que no es un mensaje normal, es del sistema
        }

        divFlexCol2.appendChild(divBg_white2);

        let mb2 = document.createElement("p");
        mb2.classList.add('mb-1');

        const isLargeNumber = (element) => element.nombre === nombre;
    
        if(ArrayNameyText.findIndex(isLargeNumber) != -1){ // Acá tambien le doy valor al mensaje del sistema 

            if(ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto === "") // No agrego texto, pero encuentra un nombre 
                mb2.textContent = `${nombre}`; // Nombre sin agregar info 
            else
                mb2.textContent = `${nombre}` + " - "+ ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto; // Nombre agregando info. 
        }else{
            mb2.textContent = `${mensaje}`; // Mensaje del Sistema 
        }

        divBg_white2.appendChild(mb2);

        // Le creo otro small para guardar el mensaje, solo si no es el sistema
        let textGray2 = document.createElement("small");
        //textGray2.classList.add('text-gray-500','font-light');
        textGray2.classList.add('text-gray-500','font-light','overflow-hidden', 'overflow-ellipsis', 'block','text-base');


        let arrNyE = archivoAux.split('.'); 

        if(nombre != msjDelSistema){ 

            if(archivo != ""){ // Si hay archivo 
                
                let punto  = ".";
                if(punto+arrNyE[1] === ".webp" || punto+arrNyE[1] === ".png" || punto+arrNyE[1] === ".jpg" || punto+arrNyE[1] === ".jpeg" || 
                punto+arrNyE[1] === ".gif" || punto+arrNyE[1] === ".tiff"){ // TODO LO QUE TENGA QUE VER CON IMAGENES 
                    // <a title="Los Tejos" href="http://www.lostejos.com"><img src="casarural.jpg" alt="Los Tejos" /></a>


                    let a = document.createElement("a");
                    a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);

                    a.target = true;
                    let archivoImg = document.createElement("img");
                    
                    //console.log("Lo que concateno tiene:"+arrNyE[0]+punto+arrNyE[1]);
                    
                    archivoImg.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    archivoImg.setAttribute('width','640');
                    archivoImg.setAttribute('height','480');
                    archivoImg.addEventListener('error', Error_Cargar,false);
                    
                    // Si anda bien, osea encuentra el archivo, hace esto. 
                    a.appendChild(archivoImg);
                    divBg_white2.appendChild(a);
                    
                    // Si no hace esto. 
                    function Error_Cargar() {
                        window.event.srcElement.style.display = "None";
                        let small = document.createElement("small");
                        let icon = document.createElement("i");
                        icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                        small.textContent = " No se encontró la Imagen  ".concat('\n');
                        divBg_white2.appendChild(small);
                        divBg_white2.appendChild(icon);
                    }
                    
                    
                    // <i class="fa-solid fa-circle-exclamation"></i>

                }else if(punto+arrNyE[1] === ".mp4" || punto+arrNyE[1] === ".mkv" || punto+arrNyE[1] === ".avi" || punto+arrNyE[1] === ".mov" || 
                punto+arrNyE[1] === ".flv" || punto+arrNyE[1] === ".divx"){ // TODO LO QUE TENGA QUE VER CON VIDEOS.
                    // <video src="video.mp4" width="640" height="480"></video>
                    let archivoVideo = document.createElement("video");
                    archivoVideo.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); 
                    archivoVideo.setAttribute('width','640');
                    archivoVideo.setAttribute('height','480');
                    archivoVideo.muted = true;
                    archivoVideo.autoplay = true;
                    archivoVideo.loop = true;
                    archivoVideo.controls = true;

                    archivoVideo.addEventListener('error', Error_Cargar,false);

                    divBg_white2.appendChild(archivoVideo);

                    function Error_Cargar() {
                        
                        let small = document.createElement("small");
                        let icon = document.createElement("i");
                        icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                        small.textContent = " No se encontró el Video  ".concat('\n');
                        divBg_white2.appendChild(small);
                        divBg_white2.appendChild(icon);
                    }


                }else if(punto+arrNyE[1] === ".mp3" || punto+arrNyE[1] === ".m4a" || punto+arrNyE[1] === ".aac" || punto+arrNyE[1] === ".wav" || punto+arrNyE[1] === ".aiff" || 
                punto+arrNyE[1] === ".wma" || punto+arrNyE[1] === ".opus" || punto+arrNyE[1] === ".ogg"){ // TODO LO QUE TENGA QUE VER CON MUSICA.
                    let archivoMusica = document.createElement("audio");
                    const path = `../Fuente/${(arrNyE[0] + punto + arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu, "")}`;
                    console.log(path);
                    // <audio src="audio.mp3" preload="none" controls></audio>
                    archivoMusica.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); 
                    archivoMusica.setAttribute('preload','none'); 
                    archivoMusica.controls = true;
                    archivoMusica.addEventListener('error', Error_Cargar,false);

                    divBg_white2.appendChild(archivoMusica);

                    function Error_Cargar() {
                        let small = document.createElement("small");
                        let icon = document.createElement("i");
                        icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                        small.textContent = " No se encontró el archivo de Audio  ".concat('\n');
                        divBg_white2.appendChild(small);
                        divBg_white2.appendChild(icon);
                    }


                    
                }else if(punto+arrNyE[1] === ".pdf" || punto+arrNyE[1] === ".doc" || punto+arrNyE[1] === ".docx" || punto+arrNyE[1] === ".txt" || 
                punto+arrNyE[1] === ".odt" || punto+arrNyE[1] === ".xlsx" || punto+arrNyE[1] === ".pptx"){
                    // FALTA CONTROLAR SI NO FALTA EL DOCUMENTO. 

                     let a = document.createElement("a");
                     a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                     a.target = true;
                     let icon = document.createElement("i");
                     icon.classList.add('fa-regular','fa-file','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                     a.appendChild(icon);
                     divBg_white2.appendChild(a);


                }else if(punto+arrNyE[1] === ".py" || punto+arrNyE[1] === ".rar" || punto+arrNyE[1] === ".zip" ||  punto+arrNyE[1] === ".html" || 
                punto+arrNyE[1] === ".tmp" || punto+arrNyE[1] === ".dat" || punto+arrNyE[1] === ".exe" || punto+arrNyE[1] === ".deb" || 
                punto+arrNyE[1] === ".vcf" || punto+arrNyE[1] === ".dmg" || punto+arrNyE[1] === ".psd" || punto+arrNyE[1] === ".sql"){
                    // <i class="fa-duotone fa-file-zipper"></i> <i class="fa-solid fa-file-lines"></i>

                    // FALTA CONTROLAR SI FALTAN ARCHIVOS. 

                    let a = document.createElement("a");
                    a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                    a.target = true;
                    let icon = document.createElement("i");

                    icon.classList.add('fa-solid','fa-file-lines','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    
                    if(punto+arrNyE[1] === ".vcf"){
                        icon.classList.add('fa-solid','fa-user','fa-2x');
                        mensaje = archivo; // Si es un contacto, indico el nombre. 
                    }else{
                        icon.classList.add('fa-solid','fa-file-lines','fa-2x'); 
                    }
                    
                    a.appendChild(icon);
                    divBg_white2.appendChild(a);
                    divBg_white2.appendChild(textGray2);
                    
                }
                
            }

            let a = document.createElement("a");
            let icon = document.createElement("i");
            let erLlamada = /^null$/;
            let erLlamadaperdida = /^Llamada perdida$/;

            if(erLlamada.test(mensaje)){
                icon.classList.add('fa-solid','fa-phone','arrow-up-right','fa-2x');
                a.appendChild(icon);
                divBg_white2.appendChild(a);
                textGray2.textContent = 'Llamada'
            }else if(erLlamadaperdida.test(mensaje)){
                icon.classList.add('fa-solid','fa-phone-slash','arrow-up-right','fa-2x');
                a.appendChild(icon);
                divBg_white2.appendChild(a);
                textGray2.textContent = 'Llamada perdida'
            }else{
                textGray2.textContent = `${mensaje}`;
            }
            divBg_white2.appendChild(textGray2);

            /* textGray2.textContent = `${mensaje}`; // Esta asignación es para cualquier caso. 
            divBg_white2.appendChild(textGray2); */
        }

        // La hora la comparten tanto el que tiene el sistema como el que no tiene el sistema. 
        let textGrayHora2 = document.createElement("small");
        textGrayHora2.classList.add('text-gray-500','font-light');
        textGrayHora2.textContent = `${fechaYhora}`;

        divFlexCol2.appendChild(textGrayHora2);

    }else{

        let divFlex1 = document.createElement("div");
        divFlex1.classList.add('flex','mb-12','flex-row-reverse'); // Mensaje de usuario
        
        id_div.appendChild(divFlex1);

        let divPull1 = document.createElement("div");
        divPull1.classList.add('pull_left', 'userpic_wrap', 'w-12', 'ml-4', 'self-end');
        
        divFlex1.appendChild(divPull1);
          
        let divUserPic1 = document.createElement("div");
        divUserPic1.classList.add('userpic', 'userpic5');
        divUserPic1.style.width = '42px';
        divUserPic1.style.height = '42px';

        divPull1.appendChild(divUserPic1);

        let divInitials1 = document.createElement("div");
        divInitials1.classList.add('initials');
        divInitials1.style.lineHeight = '42px';
        divInitials1.textContent = `${iniciales1}`;

        divUserPic1.appendChild(divInitials1);

        let divFlexCol1 = document.createElement("div");
        divFlexCol1.classList.add('flex','flex-col');
        
        divFlex1.appendChild(divFlexCol1);

        let divBg_white1 = document.createElement("div");
        divBg_white1.classList.add('p-6','w-96','rounded-3xl','rounded-br-none', 'shadow-sm', 'mb-2');
        divBg_white1.style.background = '#dcf8c6';

        divFlexCol1.appendChild(divBg_white1);

        let mb1 = document.createElement("p");
        mb1.classList.add('mb-1','text-black');

        const isLargeNumber = (element) => element.nombre === nombre;
    
        if(ArrayNameyText.findIndex(isLargeNumber) != -1){ 

            if(ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto === "") // No agrego texto, pero encuentra un nombre 
                mb1.textContent = `${nombre}`; // Nombre sin agregar info 
            else
                mb1.textContent = `${nombre}` + " - "+ ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto; // Nombre agregando info. 
        }

        divBg_white1.appendChild(mb1);

        // Le creo otro small para guardar el mensaje, solo si no es el sistema
        let textGray1 = document.createElement("small");
        //textGray1.classList.add('text-black','font-light');
        textGray1.classList.add('text-black','font-light','overflow-hidden', 'overflow-ellipsis', 'block','text-base');
        
        let arrNyE = archivoAux.split('.'); 

        if(archivo != ""){ // Si hay archivo 
            
            let punto  = ".";
            
            if(punto+arrNyE[1] === ".webp" || punto+arrNyE[1] === ".png" || punto+arrNyE[1] === ".jpg" || punto+arrNyE[1] === ".jpeg" || 
            punto+arrNyE[1] === ".gif" || punto+arrNyE[1] === ".tiff"){ // TODO LO QUE TENGA QUE VER CON IMAGENES 
                    
                // <a title="Los Tejos" href="http://www.lostejos.com"><img src="casarural.jpg" alt="Los Tejos" /></a>
                let a = document.createElement("a");
                a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                a.target = true;
                let archivoImg = document.createElement("img");
                
                //console.log("Lo que concateno tiene:"+arrNyE[0]+punto+arrNyE[1]);
                
                archivoImg.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                archivoImg.setAttribute('width','640');
                archivoImg.setAttribute('height','480');
                archivoImg.addEventListener('error', Error_Cargar,false);
                
                // Si anda bien, osea encuentra el archivo, hace esto. 
                a.appendChild(archivoImg);
                divBg_white1.appendChild(a);
                
                // Si no hace esto. 
                function Error_Cargar() {
                    window.event.srcElement.style.display = "None";
                    let small = document.createElement("small");
                    let icon = document.createElement("i");
                    icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    small.textContent = " No se encontró la Imagen  ".concat('\n');
                    divBg_white1.appendChild(small);
                    divBg_white1.appendChild(icon);
                }
                
                
                // <i class="fa-solid fa-circle-exclamation"></i>

            }else if(punto+arrNyE[1] === ".mp4" || punto+arrNyE[1] === ".mkv" || punto+arrNyE[1] === ".avi" || punto+arrNyE[1] === ".mov" || 
            punto+arrNyE[1] === ".flv" || punto+arrNyE[1] === ".divx"){ // TODO LO QUE TENGA QUE VER CON VIDEOS.
                // <video src="video.mp4" width="640" height="480"></video>
                let archivoVideo = document.createElement("video");
                archivoVideo.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); 
                archivoVideo.setAttribute('width','640');
                archivoVideo.setAttribute('height','480');
                archivoVideo.muted = true;
                archivoVideo.autoplay = true;
                archivoVideo.loop = true;
                archivoVideo.controls = true;

                archivoVideo.addEventListener('error', Error_Cargar,false);

                divBg_white1.appendChild(archivoVideo);

                function Error_Cargar() {
                    
                    let small = document.createElement("small");
                    let icon = document.createElement("i");
                    icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    small.textContent = " No se encontró el Video  ".concat('\n');
                    divBg_white1.appendChild(small);
                    divBg_white1.appendChild(icon);
                }


            }else if(punto+arrNyE[1] === ".mp3" || punto+arrNyE[1] === ".m4a" || punto+arrNyE[1] === ".aac" || punto+arrNyE[1] === ".wav" || punto+arrNyE[1] === ".aiff" || 
            punto+arrNyE[1] === ".wma" || punto+arrNyE[1] === ".opus" || punto+arrNyE[1] === ".ogg"){ // TODO LO QUE TENGA QUE VER CON MUSICA.
                let archivoMusica = document.createElement("audio");
                // <audio src="audio.mp3" preload="none" controls></audio>
                archivoMusica.setAttribute('src',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`); 
                archivoMusica.setAttribute('preload','none'); 
                archivoMusica.controls = true;
                archivoMusica.addEventListener('error', Error_Cargar,false);

                divBg_white1.appendChild(archivoMusica);

                function Error_Cargar() {
                    let small = document.createElement("small");
                    let icon = document.createElement("i");
                    icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    small.textContent = " No se encontró el archivo de Audio  ".concat('\n');
                    divBg_white1.appendChild(small);
                    divBg_white1.appendChild(icon);
                }


                
            }else if(punto+arrNyE[1] === ".pdf" || punto+arrNyE[1] === ".doc" || punto+arrNyE[1] === ".docx" || punto+arrNyE[1] === ".txt" || 
            punto+arrNyE[1] === ".odt" || punto+arrNyE[1] === ".xlsx" || punto+arrNyE[1] === ".pptx"){
                // FALTA CONTROLAR SI NO FALTA EL DOCUMENTO. 

                    let a = document.createElement("a");
                    a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                    a.target = true;
                    let icon = document.createElement("i");
                    icon.classList.add('fa-regular','fa-file','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                    a.appendChild(icon);
                    divBg_white1.appendChild(a);


            }else if(punto+arrNyE[1] === ".py" || punto+arrNyE[1] === ".rar" || punto+arrNyE[1] === ".zip" ||  punto+arrNyE[1] === ".html" || 
            punto+arrNyE[1] === ".tmp" || punto+arrNyE[1] === ".dat" || punto+arrNyE[1] === ".exe" || punto+arrNyE[1] === ".deb" || 
            punto+arrNyE[1] === ".vcf" || punto+arrNyE[1] === ".dmg" || punto+arrNyE[1] === ".psd" || punto+arrNyE[1] === ".sql"){
                // <i class="fa-duotone fa-file-zipper"></i> <i class="fa-solid fa-file-lines"></i>

                // FALTA CONTROLAR SI FALTAN ARCHIVOS. 

                let a = document.createElement("a");
                a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                a.target = true;
                let icon = document.createElement("i");

                if(punto+arrNyE[1] === ".vcf"){ // Si es el contacto de una persona, le hago un icono distinto porque es importante. 
                    icon.classList.add('fa-solid','fa-user','fa-2x');
                    mensaje = archivo; 
                }else{
                    icon.classList.add('fa-solid','fa-file-lines','fa-2x'); 
                }
                a.appendChild(icon);
                divBg_white1.appendChild(a);
                divBg_white1.appendChild(textGray1);
                
            }
            
        }

        let a = document.createElement("a");
        let icon = document.createElement("i");
        let erLlamada = /^null$/;
        let erLlamadaperdida = /^Llamada perdida$/;

        if(erLlamada.test(mensaje)){
            icon.classList.add('fa-solid','fa-phone','arrow-up-right','fa-2x');
            a.appendChild(icon);
            divBg_white1.appendChild(a);
            textGray1.textContent = 'Llamada'
        }else if(erLlamadaperdida.test(mensaje)){
            icon.classList.add('fa-solid','fa-phone-slash','arrow-up-right','fa-2x');
            a.appendChild(icon);
            divBg_white1.appendChild(a);
            textGray1.textContent = 'Llamada perdida'
        }else{
            textGray1.textContent = `${mensaje}`;
        }
        divBg_white1.appendChild(textGray1);

        /* textGray1.textContent = `${mensaje}`;
        divBg_white1.appendChild(textGray1); */

        // La hora la comparten tanto el que tiene el sistema como el que no tiene el sistema. 
        let textGrayHora1 = document.createElement("small");
        textGrayHora1.classList.add('text-gray-500','font-light','self-end');
        textGrayHora1.textContent = `${fechaYhora}`;
        
        divFlexCol1.appendChild(textGrayHora1);
        
    }
}

function CargarMensajesFront(){

    let nombreSeleccionado= SeleccionarNombre().value;
    let id_div = document.getElementById("idContenido");
    let iniciales1 = "U1";
    let iniciales2 = "U2";
    let msjDelSistema = "SistemaDeWhatsApp"; 
    usaFiltro
    // Variables para Filtro Fecha 
    let flagFiltro = usaFiltro(); 

    if(flagFiltro){ // Creo las variables en caso de que se use el filtro
        //agrear array para soportar multiples fechas
        var preDate=[];
        var postDate=[];

            window.fechas?.forEach(item => {
                console.log("fecha 1 "+ item);
                var fechaInicioFin = item.display.split('-');
                preDate.push(toMs(fechaInicioFin[0].trim()));
                postDate.push(toMs(fechaInicioFin[1].trim()));
            });

    }


    
    for (let index = 0; index < ArrayJSON.length; index++) {

        let nombre = ArrayJSON[index].Nombre; 

        let archivo = ArrayJSON[index].NameFileWhitExtension;
        
        let archivoAux = ArrayJSON[index].NameFileWhitExtension; 

        let mensaje = ArrayJSON[index].Mensaje; 

        let fechaYhora = ArrayJSON[index].Fecha +" "+ArrayJSON[index].Hora; 

        let fechaJSON = ArrayJSON[index].Fecha;

        if(!flagFiltro){ // No uso filtro 
            MensajesDinamicos(nombreSeleccionado,id_div,iniciales1,iniciales2,msjDelSistema,nombre,archivo,archivoAux,mensaje,fechaYhora);
        }else{ // Uso filtro, aplico filtro para ver si invoco para mostrar o no. 
            let fechaMs = toMs(fechaJSON);
            let cumpleFiltro = preDate.some((pre, i) => fechaMs >= pre && fechaMs <= postDate[i]);
            if (cumpleFiltro) {
                MensajesDinamicos(nombreSeleccionado, id_div, iniciales1, iniciales2, msjDelSistema, nombre, archivo, archivoAux, mensaje, fechaYhora);
            }
        }
    }
}

function CargarJSON(evento){
    
    console.log("Entre dentro de la funcion abrirArchivo");

    let archivo = evento.target.files[0]; // Este cero, es porque damos la posibilidad en este caso de abrir un archivo, se podría abrir mas si se le pone un atributo multiples al input.
    console.log(archivo.name);
    let ArrayParaNombres = new Array();

    if(archivo){ // Si selecciono un archivo 

        console.log("Entre por que se abrio archivo");

        let reader = new FileReader();

        reader.onload = function(e){

            let contenido = e.target.result;

            let textArea = document.getElementById("contenido");

            textArea.value = "";

            if(ArrayNameyText.length > 0){
                ArrayNameyText = []; 
            }

            ArrayJSON = JSON.parse(contenido); 

            ArrayParaNombres = JSON.parse(contenido); 

            nombres = GuardarNombres(ArrayParaNombres);

            console.log('Nombres de los participantes', nombres); 

            CargarNombresFront(nombres); 

            document.getElementById('contenido').value = contenido;
        }

        flagArchivo = 1; // Esto lo vamos a utilizar para saber si se abrio o no el archivo.

        reader.readAsText(archivo); // Queremos leer el contenido del archivo que ha cargado el usuario como texto.

    }else{
        
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado un archivo!',
          })
       
    }

}

// Evento Exportar Chat 
let exportar = document.getElementById("idExportar"); 
exportar.addEventListener("click",funExportar); 

// Evento Abrir archivo JSON 
let InputArchivo = document.getElementById("ArchivoJSON");
document.getElementById("ArchivoJSON").addEventListener('change',(e) => {
    CargarJSON(e);
});

// Evento Agregar Información 
let btnAgregar = document.getElementById("BtnAgregar");
let textArea = document.getElementById("contenidoTextArea");
textArea.value = "";
btnAgregar.addEventListener("click",() =>{

    let InputText = document.getElementById("InputTexto");
    const $nombresSelect = document.querySelector("#Nombres_Personas");
    const indice = $nombresSelect.selectedIndex;

    if(indice === ArrayNameyText.length){ // Es decir que seleccionaron el actor Principal. 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es posible aportar información si no hay autor',
        })

    }else{

        if(InputText.value != ""){
            ArrayNameyText[indice].texto = InputText.value;
            textArea.value = textArea.value + ArrayNameyText[indice].nombre + " - " +ArrayNameyText[indice].texto + "\n";
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No ha aportado información!',
            })
        }

    }
    
    InputText.value = "";

    console.log(ArrayNameyText);
        
});

// Evento Iniciar
let BtnIniciar = document.getElementById("Comenzar");
BtnIniciar.addEventListener("click", () => {

    //#region 
    /* Antes de cargar tengo que ver si tengo elementos en el div content
    Si es asi tengo que limpiar y luego volver a cargar.
    Esto funcion limpia el front, es decir yo deje a alguien seleccionado 
    Y luego cambio para seleccionar queda lo anterior, entonces lo que tengo que hacer
    es limpiar. */
    //#endregion
    
    if(flagArchivo === 1){
        let id = document.getElementById("idContenido");

        while(id.firstChild) {
            id.removeChild(id.firstChild);
        }

        console.log(ArrayJSON);

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Iniciando Parsing',
            showConfirmButton: false,
            timer: 800
        })

        //#region
        /* Esta variable copiaLineas, es necesario para no trabajar directamente con el array line, dado que se va modificando, por lo cual no trabajamos sobre la referencia, sino sobre la copia por ejecución, porque si trabajaramos sobre el mismo array que es line, ese arreglo por ejecución va a hacer modificado y por tanto cuando se de iniciar nuevamente, trabajeremos sobre ese modificado y no es lo que se pretende*/
        /* De todas formas este es un control, por si le dan iniciar iniciar iniciar varias veces sin recargar la pagina, digamos para hacerlo mas robusto */
        //#endregion 

        let copiaJSON = [];

        for (let index = 0; index < ArrayJSON.length; index++) {
            copiaJSON[index] = ArrayJSON[index];
        }
        
        CargarMensajesFront(copiaJSON);

    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado ningún archivo JSON!',
        }) 
    }
    
});

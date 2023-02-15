// Metodo para escribir texto en un elemento. document.createElement(element);
    // Ejemplo:

// Escribir texto en un elemento: element.textContext = texto 

// Escribir HTML en un elemento: element.innerHTML = codigo HTML

// Añadir un elemento al DOM: parent.appendChild(element) (hay mas formas de hacerlo) 
    // parent es el padre del elemento que queremos insertar.
    
    let line = new Array();

    let nombres = new Array(); // Almacena los nombres de los participantes del chat 

    let ArrayNameyText = new Array();
    
    let flagArchivo = 0;

    function download(filename, html) {

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' +encodeURI(html));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
    function funExportar(){

        if(flagArchivo === 1){
            let divChat = document.getElementById("idContenido").innerHTML;
            let cadenahtml = ""; 
            cadenahtml += "<!DOCTYPE html><html lang="+'"en"'+"> <head> <meta charset="+'"UTF-8"'+"><meta http-equiv="+"'X-UA-Compatible'"+" content="+"'IE=edge'"+"><meta name="+"'viewport'"+" content="+"'width=device-width, initial-scale=1.0'"+"><title>Document</title> "+"<script src="+"'https://cdn.tailwindcss.com'"+"></script>"+"<link rel="+"'stylesheet'"+" href="+"'style.css'"+"></link>"+"<link href="+"'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css'"+" rel="+"'stylesheet'"+" integrity="+"'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC'"+" crossorigin="+"'anonymous'"+">"+"<script src="+"'https://kit.fontawesome.com/fea845fb58.js'"+" crossorigin="+"'anonymous'"+"></script>"+"</head><body>"+ "<section class="+"'h-screen flex overflow-hidden'"+">" + "<div class="+"'bg-white w-2/12 p-6'"+"></div>"+ "<div class="+"'cuerpo w-8/12 overflow-auto'"+">" +" <p class="+"'gradiente px-20 py-6'"+ "style="+"'text-align: center; font-size: xx-large;'"+"> Chat de Whatsapp</p> <hr></hr>" +"<br>" +`${divChat}`+"</div>"+ "<div class="+"'bg-white w-2/12 p-6'"+"></div>" +"</section>"+"</body></html>";
            let filename = "ChatDeWhatsapp.html";
            download(filename, cadenahtml);
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha seleccionado ningún archivo!',
            }) 
        }
    }
    

    function SeleccionarNombre() {
        let selection = document.getElementById("Nombres_Personas");
        return selection.options[selection.selectedIndex];
    }
    

    function guardarNombres(lineas){
      
        /* Acá tenemos dos clases de expresiones regulares porque, consideramos el caso de que whatsapp haya hecho la exportación con el formato de fecha 
        3/11/22 8:48 - 
        o así
        4/8/20 8:33 a. m. - / 4/8/20 8:33 p. m. -
        */

        let ERfechayhora1 = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2}$/;
    
        let ERfechayhora2 = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2} (p. m.|a. m.)$/;
    
        let arrayNombres = new Array();
    
        let primeraVez = 0; 
    
        for (let index = 0; index < lineas.length-1; index++){
    
            let sublinea = lineas[index];
    
            let fecha = sublinea.split(' -'); // Corto hasta la fecha 
    
            if(ERfechayhora1.test(fecha[0].replace(/\u00A0/, " ")) || ERfechayhora2.test(fecha[0].replace(/\u00A0/, " "))){
    
                let dospuntos = ":";
    
                let fechaytexto = sublinea.split(' -');
    
                let texto = fechaytexto[1];
                
                if(texto.includes(dospuntos)){
    
                    let nombreytexto = texto.split(':');
    
                    if(primeraVez === 0){
                        arrayNombres.push(nombreytexto[0]);
                        primeraVez = 1;
                    }else{
                        if(!arrayNombres.includes(nombreytexto[0])){
                            arrayNombres.push(nombreytexto[0]);
                        }
    
                    }
                }
    
            }
    
        }   
    
        return arrayNombres;
    
    }
    
    function Lineas(array){
    
        let sublinea = array; 

        let sublineaAux = array;
    
        let nombreSeleccionado= SeleccionarNombre().value;
    
        let id_div = document.getElementById("idContenido");
    
        let iniciales2 = "U1";
    
        let iniciales1 = "U2";

        let ERfechayhora = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2} (p. m.|a. m.)$/;

        /* Vamos a poner algo para identificar univocamente el formato de los txt */

        /* El hecho de probar una fechaytextoAyx y usar sublineaAux es para verificar si estoy trabajando con el formato ese de la expresión regular ERfechayhora esto es porque podemos tener lineas de txt de la siguiente forma:
        11/9/22 4:12 a. m. - : - No lo soporto más
        Entonces si separo por sublinea.split(' -'); fechaytexto tendría 3 partes porque el mismo usuario agrego el - 
        Para poder arreglar esto y hacer que independientemente del formato me quede dos partes siempre y no 3, osea la parte de la fecha y hora por un lado y el texto por el otro (junto con el nombre) decidi discriminar por esos casos, de modo que si el formato es parecido al de la ERfechayhora use un split para que siempre me quede en dos partes o si es otro formato osea como el mas normal, use el otro split. 

        */

        let fechaytextoAux = sublineaAux.split(' -');

        let fechaytexto; 

        if(ERfechayhora.test(fechaytextoAux[0].replace(/\u00A0/, " "))){
            fechaytexto = sublinea.split('. -');
        }else{
            fechaytexto = sublinea.split(' -');
        }

        //fechaytexto = sublinea.split('. -');

        //console.log("Lo que tiene sublinea luego de haber cortado | -"+ fechaytexto);
    
        let texto = fechaytexto[1];
    
        //console.log("Texto: "+texto);
    
        let nombreytexto = texto.split(': ');
        
        //console.log("Fecha: "+fechaytexto[0]);
    
        //console.log("Nombre o Telefono: "+ nombreytexto[0]);
    
        //console.log("Mensaje: "+nombreytexto[1]);
        
        //console.log('\n');
    
        //console.log("Indice del primer for: "+index);
        
        // Cargo los datos dinamicos. 
    
        /* console.log("Nombre dentro del for:"+nombreytexto[0]);
        console.log("Nombre Recuperado"+nombreSeleccionado); */
        
        if(nombreytexto[0] != " "+nombreSeleccionado){
            
            let divFlex1 = document.createElement("div");

            if(nombreytexto[1] != undefined){
                divFlex1.classList.add('flex','mb-12');
            }else{
                divFlex1.classList.add('flex','justify-center','items-center');
            }
           

            id_div.appendChild(divFlex1);
    
            let divPull1 = document.createElement("div");
            
            if(nombreytexto[1] != undefined){ // Este control hace que si no es un mensaje normal, o sea es algo como el chat esta cifrado de extremo a extremo... que no cree el icono de usuario que esta abajo del mensaje. 
                divPull1.classList.add('pull_left', 'userpic_wrap', 'w-12', 'mr-4', 'self-end');
                divFlex1.appendChild(divPull1);
            }

            let divUserPic1 = document.createElement("div");
            divUserPic1.classList.add('userpic', 'userpic8');
            divUserPic1.style.width = '42px';
            divUserPic1.style.height = '42px';
    
            divPull1.appendChild(divUserPic1);
    
            let divInitials1 = document.createElement("div");
            divInitials1.classList.add('initials');
            divInitials1.style.lineHeight = '42px';
            divInitials1.textContent = `${iniciales1}`;
    
            divUserPic1.appendChild(divInitials1);
    
            let divFlexCol1 = document.createElement("div");

            if(nombreytexto[1] != undefined){
                divFlexCol1.classList.add('flex','flex-col');
            }else{
                divFlexCol1.classList.add('flex','mb-12','justify-center','items-center','flex-col');
            }
            
            divFlex1.appendChild(divFlexCol1);
    
            let divBg_white1 = document.createElement("div");

            if(nombreytexto[1] != undefined){ // Acá dependiendo del mensaje, tendrá un color el mensaje o otro color. 
                divBg_white1.classList.add('bg-white','p-6','w-96','rounded-3xl','rounded-bl-none', 'shadow-sm', 'mb-2');
            }else{
                divBg_white1.classList.add('bg-slate-200','p-6','w-full','rounded-3xl', 'shadow-sm', 'mb-2');
            }
            
            divFlexCol1.appendChild(divBg_white1);
    
            let mb1 = document.createElement("p");
            mb1.classList.add('mb-1');
    
            const isLargeNumber = (element) => element.nombre === nombreytexto[0];
        
            if(ArrayNameyText.findIndex(isLargeNumber) != -1){
    
                if(ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto === "") // No agrego texto, pero encuentra un nombre 
                    mb1.textContent = `${nombreytexto[0]}`;
                else
                    mb1.textContent = `${nombreytexto[0]}` + " - "+ ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto;
            }else{
                mb1.textContent = `${nombreytexto[0]}`;
            }
    
            divBg_white1.appendChild(mb1);
    
            let textGray1 = document.createElement("small");
            textGray1.classList.add('text-gray-500','font-light');
    
            //console.log("Nombre y Textoooo"+ nombreytexto[1]);
    
            if (nombreytexto[1] === undefined) {
                // Signica que no hay texto 
                textGray1.textContent = "";
                console.log("Entro por acá lo que tiene nombreytexto es:" + nombreytexto[1]); 
            } else {
                // Acá si hay texto (Corregir acá )
                //textGray1.textContent = `${nombreytexto[1]}`;
                
                // Acá vendría todo lo que tiene que ver con el parsing, para saber si es o no una imagen. 
                let mensaje = nombreytexto[1];
                let arrDSplie = mensaje.split(' (archivo adjunto)');
                console.log("A ver que tiene nombre y texto en el if:"+mensaje);
                console.log("Posicion 1 del mensaje:(Nombre) en el if: "+arrDSplie[0]);
                console.log("Posicion 2 del mensaje:(Extension) en el if:"+arrDSplie[1]);
    
                let nombreYExtension = arrDSplie[0]; // Acá esta guardado como el nombre con la extension.
                let arrNyE = nombreYExtension.split('.'); 
                //console.log("Nombre:"+arrNyE[0]);
                //console.log("Extension:"+ arrNyE[1]);
                //console.log("Arr Despues del split completo",arrDSplie);
                
                if(arrDSplie[1] === undefined){ // Cuando corto hasta archivo adjunto, si no encuentra esa palabra en la posicion 1 da undefined, eso significa que no es ninguna archivo por lo cual lo que hago, es poner el mensaje normal. 
                    
                    // No hay extension, lo que implica que tenemos que mostrar el mensaje completo, o sea mostrar el small 
                    textGray1.textContent = `${mensaje}`;
                    divBg_white1.appendChild(textGray1);
                    //console.log("Entro por acá lo que tiene nombreytexto es:" + nombreytexto[1]); 
                    //console.log("Lo que tiene arrNyE"+arrNyE);
    
                }else{
                    // Y acá ya habría que discriminar entre las distintas extension que puedo tener y crear dinamicamente la etiqueta html que corresponda.
                    // que no había que mostrar el small sino la imagen 
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

                        textGray1.textContent = `${arrDSplie[1]}`;
                        divBg_white1.appendChild(textGray1);
                        
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

                        textGray1.textContent = `${arrDSplie[1]}`;
                        divBg_white1.appendChild(textGray1);

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

                         textGray1.textContent = `${arrDSplie[1]}`;
                         divBg_white1.appendChild(textGray1);

    
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
                        a.appendChild(icon);
                        divBg_white1.appendChild(a);

                        textGray1.textContent = `${arrDSplie[1]}`;
                        divBg_white1.appendChild(textGray1);
                        
                    }
                    
                }
    
    
            }
    
            let textGrayHora1 = document.createElement("small");
            textGrayHora1.classList.add('text-gray-500','font-light');
            textGrayHora1.textContent = `${fechaytexto[0]}`;
    
            divFlexCol1.appendChild(textGrayHora1);
        }else{
    
            let divFlex2 = document.createElement("div");
            divFlex2.classList.add('flex','mb-12','flex-row-reverse');
    
            id_div.appendChild(divFlex2);
    
            let divPull2 = document.createElement("div");
            divPull2.classList.add('pull_left', 'userpic_wrap', 'w-12', 'ml-4', 'self-end');
    
            divFlex2.appendChild(divPull2);
    
            let divUserPic2 = document.createElement("div");
            divUserPic2.classList.add('userpic', 'userpic5');
            divUserPic2.style.width = '42px';
            divUserPic2.style.height = '42px';
    
            divPull2.appendChild(divUserPic2);
    
            let divInitials2 = document.createElement("div");
            divInitials2.classList.add('initials');
            divInitials2.style.lineHeight = '42px';
            divInitials2.textContent = `${iniciales2}`;
    
            divUserPic2.appendChild(divInitials2);
    
            let divFlexCol2 = document.createElement("div");
            divFlexCol2.classList.add('flex','flex-col');
    
            divFlex2.appendChild(divFlexCol2);
    
            let divBg_white2 = document.createElement("div");
            divBg_white2.classList.add('p-6','w-96','rounded-3xl','rounded-br-none', 'shadow-sm', 'mb-2');
            divBg_white2.style.background = '#dcf8c6'
    
            divFlexCol2.appendChild(divBg_white2);
    
            let mb2 = document.createElement("p");
            mb2.classList.add('mb-1','text-black');
            
            const isLargeNumber = (element) => element.nombre === nombreytexto[0];
        
            if(ArrayNameyText.findIndex(isLargeNumber) != -1){
                if(ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto === "") // No agrego texto, pero encuentra un nombre 
                    mb2.textContent = `${nombreytexto[0]}`;
                else
                    mb2.textContent = `${nombreytexto[0]}` + " - "+ ArrayNameyText[ArrayNameyText.findIndex(isLargeNumber)].texto;
                    
            }else{
                mb2.textContent = `${nombreytexto[0]}`;
            }
    
            divBg_white2.appendChild(mb2);
    
            let textGray2 = document.createElement("small");
            textGray2.classList.add('text-black','font-light');
    
            if (nombreytexto[1] === undefined) {
                textGray2.textContent = "";
            }
            else {
                // Acá si hay texto (Corregir acá )
                //textGray1.textContent = `${nombreytexto[1]}`;
    
                // Acá vendría todo lo que tiene que ver con el parsing, para saber si es o no una imagen. 
                let mensaje = nombreytexto[1];
                let arrDSplie = mensaje.split(' (archivo adjunto)');
                console.log("A ver que tiene nombre y texto en el else:"+mensaje);
                //console.log("A ver que tiene nombre extension:"+arrDSplie[0]);
    
                let nombreYExtension = arrDSplie[0];
                let arrNyE = nombreYExtension.split('.');
                //console.log("Nombre en el otro lado :"+arrNyE[0]);
                //console.log("Extension en el otro lado:"+ arrNyE[1]);
                console.log("Posicion 1 del mensaje:(Nombre) en el else: "+arrDSplie[0]);
                console.log("Posicion 2 del mensaje:(Extension) en el else:"+arrDSplie[1]);
                //console.log("Arr Despues del split completo",arrDSplie);
    
                if(arrDSplie[1] === undefined){
                    // No hay extension, lo que implica que tenemos que mostrar el mensaje completo, o sea mostrar el small 
                    textGray2.textContent = `${mensaje}`;
                    divBg_white2.appendChild(textGray2);
                    //console.log("Entro por acá lo que tiene nombreytexto es:" + nombreytexto[1]); 
                    //console.log("Lo que tiene arrNyE"+arrNyE);

    
                }else{
                    // Y acá ya habría que discriminar entre las distintas extension que puedo tener y crear dinamicamente la etiqueta html que corresponda.
                    // que no había que mostrar el small sino la imagen 
                    console.log("A ver que tiene arrDSplie en el else: "+arrDSplie[1]);


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

                        a.appendChild(archivoImg);
                        divBg_white2.appendChild(a);

                        /* Estas dos lineas que estan acá se las agrego por el hecho de que como arrDSplie es distinto de undefined lo que va a pasar es que tiene un mensaje, si bien dentro del mensaje esta inmerso el nombre de la imagen con su extensión, puede pasar que se haya escrito algo sobre la imagen, es decir se haya enviado la imagen con un texto y si no agrego esto, no se muestra, por lo cual es necesario agregarle esto para que además de mostrar la imagen, muestre el mensaje que pueda llegar a tener. */
                        textGray2.textContent = `${arrDSplie[1]}`;
                        divBg_white2.appendChild(textGray2);

                        function Error_Cargar() {
                            window.event.srcElement.style.display = "None";
                            let small = document.createElement("small");
                            let icon = document.createElement("i");
                            icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                            small.textContent = " No se encontró la Imagen  ".concat('\n');
                            divBg_white2.appendChild(small);
                            divBg_white2.appendChild(icon);
                        }


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

                        textGray2.textContent = `${arrDSplie[1]}`;
                        divBg_white2.appendChild(textGray2);

                        function Error_Cargar() {
                            
                            let small = document.createElement("small");
                            let icon = document.createElement("i");
                            icon.classList.add('fa-solid','fa-circle-exclamation','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                            small.textContent = " No se encontró el Video  ".concat('\n');
                            divBg_white2.appendChild(small);
                            divBg_white2.appendChild(icon);
                        }

                    }else if(punto+arrNyE[1] === ".mp3" || punto+arrNyE[1] === ".m4a" ||  punto+arrNyE[1] === ".aac" || punto+arrNyE[1] === ".wav" || punto+arrNyE[1] === ".aiff" || 
                    punto+arrNyE[1] === ".wma" || punto+arrNyE[1] === ".opus" || punto+arrNyE[1] === ".ogg"){
                        let archivoMusica = document.createElement("audio");
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


                    } else if(punto+arrNyE[1] === ".pdf" || punto+arrNyE[1] === ".doc" || punto+arrNyE[1] === ".docx" || punto+arrNyE[1] === ".txt" || 
                    punto+arrNyE[1] === ".odt" || punto+arrNyE[1] === ".xlsx" || punto+arrNyE[1] === ".pptx"){
                        // <i class="fa-solid fa-file"></i> 

                        // FALTA CONTROLAR SI NO VIENE DOCUMENTOS.

                         let a = document.createElement("a");
                         a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                         a.target = true;
                         let icon = document.createElement("i");
                         icon.classList.add('fa-regular','fa-file','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                         a.appendChild(icon);
                         divBg_white2.appendChild(a);

                         textGray2.textContent = `${arrDSplie[1]}`;
                         divBg_white2.appendChild(textGray2);

                    }else if(punto+arrNyE[1] === ".py" || punto+arrNyE[1] === ".rar" || punto+arrNyE[1] === ".zip" ||  punto+arrNyE[1] === ".html" || 
                    punto+arrNyE[1] === ".tmp" || punto+arrNyE[1] === ".dat" || punto+arrNyE[1] === ".exe" || punto+arrNyE[1] === ".deb" || 
                    punto+arrNyE[1] === ".vcf" || punto+arrNyE[1] === ".dmg" || punto+arrNyE[1] === ".psd" || punto+arrNyE[1] === ".sql"){
                        // <i class="fa-duotone fa-file-zipper"></i> <i class="fa-solid fa-file-lines"></i>

                        // FALTA CONTROLAR SI NO VIENE ALGUN ARCHIVO.

                        let a = document.createElement("a");
                        a.setAttribute('href',"../Fuente/"+`${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`);
                        a.target = true;
                        let icon = document.createElement("i");
                        icon.classList.add('fa-solid','fa-file-lines','fa-2x'); // Tengo que agregarle el replace para eliminar los caracteres invsibles
                        a.appendChild(icon);
                        divBg_white2.appendChild(a);

                        textGray2.textContent = `${arrDSplie[1]}`;
                        divBg_white2.appendChild(textGray2);
    
                    }
                    
                }
    
            }
    
            //divBg_white2.appendChild(textGray2);
    
            let textGrayHora2 = document.createElement("small");
            textGrayHora2.classList.add('text-gray-500','font-light','self-end');
            textGrayHora2.textContent = `${fechaytexto[0]}`;
    
            divFlexCol2.appendChild(textGrayHora2);
        } 

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


    function cargarFront(line){
    
        // nombres me va a permitir saber cuantos usuarios hay, y por cada usuario distinto como que puedo crear una inicial, tener en cuenta. 
    
        let primerElemento = line[0];
        
        console.log("Primer elemento de la lista: "+primerElemento);
    
        console.log('\n');
    
        let actualIndex = 0; // Almacena el indice para una linea en particular
    
        let flag = 0; // Me avisa si siguen viniendo lineas. 

        let valorFecha; 
        
        let fechayhora;

        let fechasolita;

        let preDate; 

        let postDate;
    
        let ERfechayhora1 = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2}$/;
    
        let ERfechayhora2 = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2} (p. m.|a. m.)$/;
    
        let sublineaAuxiliar = ""; 

        let flagFiltro = usaFiltro(); 

        /* Nota: La funcion .replace(/\u00A0/, " ") sirve para eliminar caracteres basura
        Si hay otro error, puede que no haya aplicado esta funcion en algun lado, veremos :B
        */
        
        for (let index = 0; index < line.length-1; index++) {
    
            let sublinea = line[index];
    
            let fecha = sublinea.split(' -'); // Corto hasta la fecha 
    
            //console.log("Haber lo que tiene fecha en la posicion 0",fecha[0]);
    
            //console.log("Haber lo que tiene fecha en la posicion 1",fecha[1]);
    
            // Control para ver si chequeo o no cadena, para luego hacer concatenacion
    
            //console.log("Este es er1 "+ !ERfechayhora1.test(fecha[0].replace(/\u00A0/, " ")));
    
            //console.log("Este es er2 "+ !ERfechayhora2.test(fecha[0].replace(/\u00A0/, " ")));
    
            if(!(ERfechayhora1.test(fecha[0].replace(/\u00A0/, " ")) || ERfechayhora2.test(fecha[0].replace(/\u00A0/, " ")))){ // Si es distinto de fecha 
    
                console.log('Es algo distinto de fecha');
                console.log("El texto que tiene es: "+ sublinea);
                
                if(flag === 0){ // O sea antes había una fecha, es la primera vez que entra. 
    
                    actualIndex = index -1; 
                    line[index-1] = line[index-1].concat('\n' + line[index]);
                    line[index].split(index,1); // Luego de haber concatenado, elimino el indice actual, ya que en mi arreglo no lo necesito mas. 
                    console.log("La linea actual tiene:"+line[index-1]);
                    flag = 1; 
                }else{
                    line[index - (index-actualIndex)] = line[index - (index-actualIndex)].concat('\n'+line[index]);
                    line[index].split(index,1);
                    console.log("La linea actual tiene:"+line[index - (index-actualIndex)]);
                }
    
                /* También va line[index+1] === "" 
                Acá hay dos casos, se puede dar el caso en que tengamos 
                3/11/22 11:23 - Agustín Figueroa: PruebaTxt.txt (archivo adjunto)
                PruebaTxt.txt
                ""
    
                Es decir que no haya nada Después de ese PruebaTxt.txt por lo cual cuando abajo verifique por el if si solo dejamos el control ERfechayhora.test(line[index+1].split(' -')[0]) no va a entrar.
    
                De la misma manera si tenemos algo como: 
                3/11/22 11:23 - Agustín Figueroa: PruebaTxt.txt (archivo adjunto)
                ""
                Que no tengamos nada depués de esa fecha, pasa que si entro por ahí entro porque el espacio en blanco es algo también que es distinto de fecha, y eso también se lo tiene concatenar a lo anterior. 
                
                */
                
                // Acá no muestro nada, solo concateno, lo hago eso en else. 
                
                sublineaAuxiliar = line[index - (index-actualIndex)];

                if(!flagFiltro){ // O sea que no uso el filtro. Hago lo normal 
                    if(index === line.length-2){
                        Lineas(sublineaAuxiliar);
                    }
                }else{
                    if(index === line.length-2 && (toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){
                        Lineas(sublineaAuxiliar);
                    }
                }
                
                
            } else { // Comienza el texto con fecha 

                if(!flagFiltro){ // O sea que no se utilizo el filtro. 
                    if(flag === 1){  // Antes venia de una concatenacion  
                        console.log("Lo que le paso es:" + line[index]); 
                        Lineas(sublineaAuxiliar);
                    }
        
                    if(ERfechayhora1.test(line[index+1].split(' -')[0].replace(/\u00A0/, " ")) || ERfechayhora2.test(line[index+1].split(' -')[0].replace(/\u00A0/, " "))){ // Si lo que viene despues es fecha, muestro la fecha actual
                        Lineas(line[index]);
                    }
    
                    if(index === line.length-2){ // Si es la ultima posicion, o sea lo ultimo que leo antes del "" de la ultima linea del txt 
                        Lineas(line[index]);
                    }

                }else{ // Acá habría que agregar otra cosita mas!
                    //console.log("Ups re rompio!!!");

                    fechayhora = fecha[0];
                    fechasolita = fechayhora.split(' ');
                    //console.log("Fecha solita tiene: "+ fechasolita[0]);

                    // A la fecha solita esa la accedo como fechasolita[0]
                    valorFecha = document.getElementById("Fecha").value;
                    //console.log("El valor de la fecha es: "+valorFecha);

                    let fechaInicioFin = valorFecha.split('-');
                    //console.log("Fecha Inicio: "+fechaInicioFin[0]);
                    //console.log("Fecha Fin: "+fechaInicioFin[1]);
                    
                    preDate = toMs(fechaInicioFin[0]);
                    //console.log("preDate es: "+preDate);

                    postDate = toMs(fechaInicioFin[1]);
                    //console.log("postDate es: "+postDate);

                    //console.log("El resultado de fecha solita es: "+resultado);
                    
                    if(flag === 1 && (toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){  // Antes venia de una concatenacion  
                        //console.log("Lo que le paso es:" + line[index]); 
                        
                        Lineas(sublineaAuxiliar);
                    }
                    
                    if((toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate) && (ERfechayhora1.test(line[index+1].split(' -')[0].replace(/\u00A0/, " ")) || ERfechayhora2.test(line[index+1].split(' -')[0].replace(/\u00A0/, " "))) ){ // Si lo que viene despues es fecha, muestro la fecha actual
                        //console.log("Esta entrando por acá, es raro");
                        Lineas(line[index]);
                    }
                    
                    if(index === line.length-2 && (toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){ // Si es la ultima posicion, o sea lo ultimo que leo antes del "" de la ultima linea del txt 
                        //console.log("Esta entrando por acá, mas raro todavia");
                        Lineas(line[index]);
                    }

                }
    
                flag = 0;
                
            }
    
        }   

        //console.log("A ver que tiene la ultima linea"+line[line.length-2]);
    
    }
    
    function abrirArchivo(evento){
    
        console.log("Entre dentro de la funcion abrirArchivo");
    
        let archivo = evento.target.files[0]; // Este cero, es porque damos la posibilidad en este caso de abrir un archivo, se podría abrir mas si se le pone un atributo multiples al input.
    
        if(archivo){ // Si selecciono un archivo 
    
            console.log("Entre por que se abrio archivo");
    
            let reader = new FileReader();
    
            reader.onload = function(e){
    
                let contenido = e.target.result;
    
                // Chequear error, hay que tener en cuenta que si separo por salto de linea, podrían quedarme lineas como: Mañana voy sola o llamo a otra chica
                
                // Por lo cual debería de tener un control para esos casos, todavía no se me ocurre, consultar.
    
                let textArea = document.getElementById("contenidoTextArea");
    
                textArea.value = "";
    
                let lineas = contenido.split('\n');
    
                let lineasParaNombres = new Array();
    
                if(line.length > 0){
                    line = [];
                }
    
                if(ArrayNameyText.length> 0){
                    ArrayNameyText = [];
                }
    
                for(let linea of lineas) {
                    line.push(linea);
                    lineasParaNombres.push(linea);
                }
    
                nombres = guardarNombres(lineasParaNombres);
    
                for (let index = 0; index < nombres.length; index++) {
                    
                    let objNameYText = {
                        nombre:"",
                        texto:"",
                        indice:index, // Lo voy a dejar por las dudas, en una de esa me sirve 
                    }
                    objNameYText.nombre = nombres[index];
                    // Falta el texto 
                    ArrayNameyText.push(objNameYText);
                    
                }
    
                //console.log(ArrayNameyText);
                
                //console.log("Lista de nombres: " + nombres);
    
                const $nombresSelect = document.querySelector("#Nombres_Personas");
    
                //console.log("Nombre select tiene:",$nombresSelect);
    
                const indice = $nombresSelect.selectedIndex;
    
                //console.log(indice);
    
                if(indice === -1){ // Si no hay elementos los creo. 
                    
                    for (let index = 0; index < nombres.length; index++) {
                        const option = document.createElement('option');
                        option.textContent = `${nombres[index]}`;
                        $nombresSelect.appendChild(option);
                        //console.log(option);
                    }
                    
                }else{
                    for (let i = $nombresSelect.options.length; i >= 0; i--) {
                        $nombresSelect.remove(i);
                    }
                    
                    for (let index = 0; index < nombres.length; index++) {
                        const option = document.createElement('option');
                        option.textContent = `${nombres[index]}`;
                        $nombresSelect.appendChild(option);
                    }
                } 
    
                document.getElementById('contenido').value = contenido;
            }
            flagArchivo = 1; 
    
            reader.readAsText(archivo); // Queremos leer el contenido del archivo que ha cargado el usuario como texto
    
        }else{
            
            //document.getElementById('mensajes').innerText = 'No se ha seleccionado un archivo'; 
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha seleccionado un archivo!',
              })
           
        }
    
    }
    
    
    let InputArchivo = document.getElementById("archivoTexto");
    
    console.log(InputArchivo);
    
    document.getElementById("archivoTexto").addEventListener('change',(e) => {
    
        abrirArchivo(e);
    
    });
    
    
    let btnTelefono = document.getElementById("BtnAgregar");
    
    let textArea = document.getElementById("contenidoTextArea");
    
    textArea.value = "";
    
    btnTelefono.addEventListener("click",() =>{
    
        // Valor del telefono 
        let InputText = document.getElementById("InputTexto");
    
        const $nombresSelect = document.querySelector("#Nombres_Personas");
    
        const indice = $nombresSelect.selectedIndex;
    
        if(InputText.value != ""){
            ArrayNameyText[indice].texto = InputText.value;
            textArea.value = textArea.value + ArrayNameyText[indice].nombre + " - " +ArrayNameyText[indice].texto + "\n";
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No ha aportado ninguna información!',
            })
        }
    
        InputText.value = "";
    
        console.log(ArrayNameyText);
        
    })
    
    
    let BtnIniciar = document.getElementById("Comenzar");
    
    BtnIniciar.addEventListener("click", () => {
    
        // Antes de cargar tengo que ver si tengo elementos en el div content
        /*Si es asi tengo que limpiar y luego volver a cargar.*/
    
        /* Esto funcion limpia el front, es decir yo deje a alguien seleccionado 
        Y luego cambio para seleccionar queda lo anterior, entonces lo que tengo que hacer
        es limpiar.
        */
    
        if(flagArchivo === 1){
            let id = document.getElementById("idContenido");
    
            while(id.firstChild) {
                id.removeChild(id.firstChild);
            }
    
            //console.log("Recupero el array");
            console.log(line);
            //console.log(nombres);
    
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Iniciando Parsing',
                showConfirmButton: false,
                timer: 800
            })
    
            cargarFront(line);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha seleccionado ningún archivo!',
            }) 
        }
        
        
    });
    
    
    
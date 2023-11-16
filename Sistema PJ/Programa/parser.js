    let line = new Array();

    let nombres = new Array(); // Almacena los nombres de los participantes del chat 

    let ArrayNameyText = new Array();
    
    let flagArchivo = 0;

    let ERfechayhora = /\d{1,2}\/\d{1,2}\/\d{2,4}(,)? \d{1,2}:\d{2}( (p. m.|a. m.))?/; // Si aparece un nuevo formato en una exportación, modificar un poco esta ER, no sacando, sino agregando y en general agregar con ? es decir 0 o 1 vez, para que los demás formatos se sigan respetando. 
    
    function download(filename, html) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
    function funExportar(){
        
        /* Nota: También se podría embeber el stilo y evitar copiar y pegar el archivo style en fuente. El hecho es que hay que tener cuidado con la interpolación porque pareciera que los estilos pueden interferir entre ellos, es decir hay que interpolar bien. Por el momento lo dejamos como está...*/

        if(flagArchivo === 1){
            let divChat = document.getElementById("idContenido").innerHTML;
            let antes = /\.\.\/Fuente\//g; // El uso de la ER, junto con /g es para que replace no solo tome la primer aparición de la palabra fuente, sino todas las que haya. 
            let ahora = "";
            let divChatNuevo = divChat.replace(antes,ahora);
            let cadenahtml = ""; 
            cadenahtml += "<!DOCTYPE html><html lang="+'"en"'+"> <head> <meta charset="+'"UTF-8"'+"><meta http-equiv="+"'X-UA-Compatible'"+" content="+"'IE=edge'"+"><meta name="+"'viewport'"+" content="+"'width=device-width, initial-scale=1.0'"+"><title>Chat Exportado</title> "+"<script src="+"'https://cdn.tailwindcss.com'"+"></script>"+"<link rel="+"'stylesheet'"+" href="+"'style.css'"+"></link>"+"<link href="+"'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css'"+" rel="+"'stylesheet'"+" integrity="+"'sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC'"+" crossorigin="+"'anonymous'"+">"+"<script src="+"'https://kit.fontawesome.com/fea845fb58.js'"+" crossorigin="+"'anonymous'"+"></script>"+"</head><body>"+ "<section class="+"'h-screen flex overflow-hidden'"+">" + "<div class="+"'bg-white w-2/12 p-6'"+"></div>"+ "<div class="+"'cuerpo w-8/12 overflow-auto'"+">" +" <p class="+"'gradiente px-20 py-6'"+ "style="+"'text-align: center; font-size: xx-large;'"+"> Chat de WhatsApp</p> <hr></hr>" +"<br>" +`${divChatNuevo}`+"</div>"+ "<div class="+"'bg-white w-2/12 p-6'"+"></div>" +"</section>"+"</body></html>";
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
      
        //console.log(lineas);

        /* 
        
        let ERfechayhora1 = /^\d{1,2}\/\d{1,2}\/\d{2,4}(,)? \d{1,2}:\d{2}$/;
    
        let ERfechayhora2 = /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{1,2}:\d{2} (p. m.|a. m.)$/; 
        
        Antes hacía uso de estas dos expresiones regulares, ahora toda se puede compactar en una sola que es: 

        let ERfechayhora1 = /^\d{1,2}\/\d{1,2}\/\d{2,4}(,)? \d{1,2}:\d{2}( (p. m.|a. m.))?$/;

        Observemos que en esta última parte ( (p. m.|a. m.))? se deja un espacio al inicio, o sea antes del segundo parentesis ( (p. ... porque en caso de que no haya eso de pm am 
        Se saltea todo eso de am pm pero si hay, hay un espacio y luego aparece am y pm. 
        
        */

        let arrayNombres = new Array();
    
        let primeraVez = 0; 
    
        for (let index = 0; index < lineas.length-1; index++){
    
            let sublinea = lineas[index];
    
            let fecha = sublinea.split(' -'); // Corto hasta la fecha 
    
            if(ERfechayhora.test(fecha[0].replace(/\s/g, " "))){ 
    
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

        // Acá llegan los mensajes con las fechas, no hay mensajes los cuales no tengan fecha, las concatenaciones correspondientes se hicieron en cargarFront. 
    
        let sublinea = array; 

        //console.log("Sublinea tiene: \n" + sublinea); 
    
        let nombreSeleccionado= SeleccionarNombre().value;
    
        let id_div = document.getElementById("idContenido");
    
        let iniciales2 = "U1";
    
        let iniciales1 = "U2";

        let fechaytexto; 

        fechaytexto = sublinea.split(/\.? -/);/*  Esta expresión regular me permite particionar esta parte de un mensaje: 27/4/2022, 16:33" - "Papá: hola hijo todo bien? de esta manera en fecha y texto me quedaría por un lado toda la fecha y por otro, el nombre del auto junto con su mensaje, el hecho de haber incorporado también \.? en la ER es porque en algunos casos los mensajes estan de esta forma: 
        30/7/20 9:36 p. m". - "Papá: hola hijo todo bien? */

        let texto = fechaytexto[1];

        //console.log("Autor y mensaje: \n"+texto);
    
        let nombreytexto = texto.split(/: (.*)/); // Esta ER me permite quedarme con esta parte de un mensaje "Papá:" hola hijo todo bien? el hecho de haber utilizado una ER es porque su uso solo el split(': ') si como parte del mensaje de una conversación también aparece ": " también cortará la cadena del mensaje, y no es lo que se pretende, esta ER hace que solo corte hasta el primer ": " y luego el resto si aparece nuevamente ": " no siga cortando. 

        //console.log(nombreytexto);
        
        if(nombreytexto[0] != " "+nombreSeleccionado){ // Solo lo cumplen los actores secundarios. 
            
            let divFlex1 = document.createElement("div");

            if(nombreytexto[1] != undefined){
                divFlex1.classList.add('flex','mb-12'); // Mensaje de usuario
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
                divBg_white1.classList.add('bg-slate-200','p-6','w-full','rounded-3xl', 'shadow-sm', 'mb-2'); // Color azul, o sea que no es un mensaje normal, es del sistema
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
            //textGray1.classList.add('text-gray-500','font-light');
            textGray1.classList.add('text-gray-500','font-light','overflow-hidden', 'overflow-ellipsis', 'block');
            
            //console.log("Nombre y Textoooo"+ nombreytexto[1]);
    
            if (nombreytexto[1] === undefined) { // O sea que es un mensaje del sistema 
                // Signica que no hay texto 
                textGray1.textContent = "";
            } else {

                let mensaje = nombreytexto[1];
                let arrDSplie; 
                let nombreYExtension; 
                let arrNyE;
                
                if(mensaje.includes(' (archivo adjunto)')){ // Se que en esta posición hay un archivo 
                    // Corto como corresponde... 
                    arrDSplie = mensaje.split(' (archivo adjunto)');
                    nombreYExtension = arrDSplie[0];
                    arrNyE = nombreYExtension.split('.'); 
                    let message = nombreytexto.splice(2); // Elimina los 2 primeros elementos, o sea saco el nombre de la posicion 0, y el nombre del archivo de la posicion 1, y ahora si tiene mensajes, lo junto todo. 
                    let mensajeFinal = message.join(""); // El join me juntaria todos los mensajes que haya puesto, después del mensaje... 

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
                        
                        //Estas dos lineas que estan acá se las agrego por el hecho de que como arrDSplie es distinto de undefined lo que va a pasar es que tiene un mensaje, si bien dentro del mensaje esta inmerso el nombre de la imagen con su extensión, puede pasar que se haya escrito algo sobre la imagen, es decir se haya enviado la imagen con un texto y si no agrego esto, no se muestra, por lo cual es necesario agregarle esto para que además de mostrar la imagen, muestre el mensaje que pueda llegar a tener.

                        textGray1.textContent = `${mensajeFinal}`;
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

                        textGray1.textContent = `${mensajeFinal}`;
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

                         textGray1.textContent = `${mensajeFinal}`;
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

                        if(punto+arrNyE[1] === ".vcf"){ // Si es el contacto de una persona, le hago un icono distinto porque es importante. 
                            icon.classList.add('fa-solid','fa-user','fa-2x');
                            textGray1.textContent = `${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`;
                        }else{
                            icon.classList.add('fa-solid','fa-file-lines','fa-2x'); 
                            textGray1.textContent = `${mensajeFinal}`;
                        }
                        a.appendChild(icon);
                        divBg_white1.appendChild(a);
                        divBg_white1.appendChild(textGray1);
                        
                    }

                }else{
                    // Si no hay un archivo, tiene texto, pero no sabemos el texto no solo esta en una posición, sino en varias, por eso es que se elimina la primer posicion que corresponde al nombre y luego concateno el resto de los elementos del array, con el join... 
                    let message = nombreytexto.splice(1);  
                    let mensajeFinal = message.join("");    
                    textGray1.textContent = `${mensajeFinal}`;
                    divBg_white1.appendChild(textGray1);
                }

            }
    
            console.log("A ver que tiene fechaytexto[0] \n"+fechaytexto[0]); 
            
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
            divBg_white2.style.background = '#dcf8c6';
    
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
            //textGray2.classList.add('text-black','font-light');
            textGray2.classList.add('text-black','font-light','overflow-hidden', 'overflow-ellipsis', 'block');

            
            if (nombreytexto[1] === undefined) {
                textGray2.textContent = "";
            }
            else {
                
                let mensaje = nombreytexto[1];
                let arrDSplie; 
                let nombreYExtension; 
                let arrNyE;
                
                if(mensaje.includes(' (archivo adjunto)')){ // Se que en esta posición hay un archivo 
                    // Corto como corresponde... 
                    arrDSplie = mensaje.split(' (archivo adjunto)');
                    nombreYExtension = arrDSplie[0];
                    arrNyE = nombreYExtension.split('.'); 
                    let message = nombreytexto.splice(2);
                    let mensajeFinal = message.join(""); 

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
                        textGray2.textContent = `${mensajeFinal}`;
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

                        textGray2.textContent = `${mensajeFinal}`;
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

                         textGray2.textContent = `${mensajeFinal}`;
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
                        
                        if(punto+arrNyE[1] === ".vcf"){
                            icon.classList.add('fa-solid','fa-user','fa-2x');
                            textGray2.textContent = `${(arrNyE[0]+punto+arrNyE[1]).replace(/[\u{0080}-\u{FFFF}]/gu,"")}`;
                        }else{
                            icon.classList.add('fa-solid','fa-file-lines','fa-2x'); 
                            textGray2.textContent = `${mensajeFinal}`;
                        }
                        
                        a.appendChild(icon);
                        divBg_white2.appendChild(a);
                        divBg_white2.appendChild(textGray2);
    
                    }

                }else{

                    let message = nombreytexto.splice(1);  
                    let mensajeFinal = message.join("");    
                    textGray2.textContent = `${mensajeFinal}`;
                    divBg_white2.appendChild(textGray2);
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
        /* console.log("parts[2] tiene: "+parts[2]); // año 
        console.log("parts[1] tiene: "+parts[1]); // mes 
        console.log("parts[0] tiene: "+parts[0]); // dia 
        console.log("La longitud del año es: "+parts[2].length); */

        if(parts[2].length === 4){
            newStr = parts[2].substring(2, parts[2].length);
            //console.log("El nuevo string tiene: "+newStr);
            return new Date(newStr, parts[1] - 1, parts[0]).getTime();
        }
        
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }

    
    function cargarFront(line){
    
        // nombres me va a permitir saber cuantos usuarios hay, y por cada usuario distinto como que puedo crear una inicial, tener en cuenta. 
    
        //let primerElemento = line[0];
        
        //console.log("Primer elemento de la lista: "+primerElemento);
    
        console.log('\n');
    
        let actualIndex = 0; // Almacena el indice para una linea en particular
    
        let flag = 0; // Me avisa si siguen viniendo lineas. 

        let valorFecha; 
        
        let fechayhora;

        let fechasolita;

        let preDate; 

        let postDate;
    
        let sublineaAuxiliar = ""; 

        let flagFiltro = usaFiltro(); 

        /* Nota: La funcion .replace(/\s/g, " ") sirve para eliminar caracteres basura
        Si hay otro error, puede que no haya aplicado esta funcion en algun lado, veremos :B
        */
        
        for (let index = 0; index < line.length-1; index++) {
    
            let sublinea = line[index];
    
            let fecha = sublinea.split(' -'); // Corto hasta la fecha 

            //console.log("A ver que tiene fecha: \n"+JSON.stringify(fecha)); 

    
            if(!ERfechayhora.test(fecha[0].replace(/\s/g, " "))){ // Si es distinto de fecha 
    
                //console.log('Es algo distinto de fecha');
                //console.log("El texto que tiene es: "+ sublinea);
                
                if(flag === 0){ // O sea antes había una fecha, es la primera vez que entra. 
                    actualIndex = index -1; 
                    line[index-1] = line[index-1].concat('\n' + line[index]);
                    line[index].split(index,1); // Luego de haber concatenado, elimino el indice actual, ya que en mi arreglo no lo necesito mas. 
                    //console.log("La linea actual tiene:"+line[index-1]);
                    flag = 1; 
                }else{
                    line[index - (index-actualIndex)] = line[index - (index-actualIndex)].concat('\n'+line[index]);
                    line[index].split(index,1);
                    //console.log("La linea actual tiene:"+line[index - (index-actualIndex)]);
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

                //console.log("A VER LO QUE TIENE ESTA SUBLINEA AUXILIAR: "+sublineaAuxiliar);
                
                if(!flagFiltro){ // O sea que no uso el filtro. Hago lo normal 
                    if(index === line.length-2){
                        Lineas(sublineaAuxiliar);
                    }
                }else{
                    //console.log("Entro por acá"); 
                    if(index === line.length-2 && (toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){
                        //console.log("Entra al if"); 
                        Lineas(sublineaAuxiliar);
                    }
                }
                
                
            } else { // Comienza el texto con fecha 

                if(!flagFiltro){ // O sea que no se utilizo el filtro. 
                    if(flag === 1){  // Antes venia de una concatenacion  
                        //console.log("Lo que le paso es:" + line[index]); 
                        //console.log(sublineaAuxiliar); 
                        Lineas(sublineaAuxiliar);
                        
                    }
        
                    if(ERfechayhora.test(line[index+1].split(' -')[0].replace(/\s/g, " "))){ // Si lo que viene despues es fecha, muestro la fecha actual
                        Lineas(line[index]);
                    }
                    
                    if(index === line.length-2){ // Si es la ultima posicion, o sea lo ultimo que leo antes del "" de la ultima linea del txt 
                        Lineas(line[index]);
                    }

                }else{ 

                    //console.log("Se uso el filtro y además es una fecha: \n"+JSON.stringify(fecha)); 

                    fechayhora = fecha[0];
                    
                    //console.log("A ver que tiene esto: " + fechayhora);

                    fechasolita = fechayhora.split(/\,? /);
                    console.log("Fecha solita tiene: \n"+ fechasolita[0]);

                    // A la fecha solita esa la accedo como fechasolita[0]
                    valorFecha = document.getElementById("Fecha").value;
                    //console.log("El valor de la fecha es: "+valorFecha);

                    let fechaInicioFin = valorFecha.split(' - ');
                    console.log("Fecha Inicio: \n"+fechaInicioFin[0]);
                    console.log("Fecha Fin: \n"+fechaInicioFin[1]);
                    
                    preDate = toMs(fechaInicioFin[0].trim());
                    console.log("preDate es: "+preDate);

                    postDate = toMs(fechaInicioFin[1].trim());
                    console.log("postDate es: "+postDate);
                    
                    //console.log("Fecha txt con toMS: \n"+toMs(fechasolita[0])); 

                    /* if((toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){
                        console.log("Se cumple\n"); 
                    }

                    console.log("Valor del flag: \n"+flag); 

                    console.log("A ver que tiene sublineauaxiliar: \n"+sublineaAuxiliar.split(' -')[0].split(/\,? /)[0]);
                    
                    console.log("\n\n"); */ 

                    /* En el 1° IF se debe preguntar por la fecha que fue concatenada y no la fecha actual, por eso es que tomo sublineaAuxiliar para ver su fecha, porque es en la misma donde tengo realizada la fecha y la concatenación. Luego se verifica que esa fecha concatenada se encuentre en el rango establecido por el usuario.*/

                    if(flag === 1 && (toMs(sublineaAuxiliar.split(' -')[0].split(/\,? /)[0]) >= preDate && toMs(sublineaAuxiliar.split(' -')[0].split(/\,? /)[0]) <= postDate)){  
                        console.log("Entra por acá, primer condicion");
                        Lineas(sublineaAuxiliar);
                    } // 1° IF 
                    
                    if((toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate) && (ERfechayhora.test(line[index+1].split(' -')[0].replace(/\s/g, " "))) ){ // Si lo que viene despues es fecha, muestro la fecha actual
                        console.log("Esta entrando por acá, es raro");
                        Lineas(line[index]);
                    } // 2° IF 
                    
                    if(index === line.length-2 && (toMs(fechasolita[0]) >= preDate && toMs(fechasolita[0]) <= postDate)){ // Si es la ultima posicion, o sea lo ultimo que leo antes del "" de la ultima linea del txt 
                        console.log("Esta entrando por acá, mas raro todavia");
                        Lineas(line[index]);
                    } // 3° IF 

                }
    
                flag = 0;
                
            }
    
        }   
    
    }
    
    function abrirArchivo(evento){
    
        console.log("Entre dentro de la funcion abrirArchivo");
    
        let archivo = evento.target.files[0]; // Este cero, es porque damos la posibilidad en este caso de abrir un archivo, se podría abrir mas si se le pone un atributo multiples al input.
    
        if(archivo){ // Si selecciono un archivo 
    
            console.log("Entre por que se abrio archivo");
    
            let reader = new FileReader();
    
            reader.onload = function(e){
    
                let contenido = e.target.result;
    
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

                console.log("Participantes: \n" + nombres);
                
                console.log("Longitud de la lista de nombrest: \n" + nombres.length);
                
                const $nombresSelect = document.querySelector("#Nombres_Personas");
    
                //console.log("Nombre select tiene:",$nombresSelect);
    
                const indice = $nombresSelect.selectedIndex;
    
                //console.log(indice);

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
                sinactor.textContent = "Sin autor Principal";
                $nombresSelect.appendChild(sinactor);
                
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
    
    //console.log(InputArchivo);
    
    document.getElementById("archivoTexto").addEventListener('change',(e) => {
    
        abrirArchivo(e);
    
    });
    
    
    let btnAgregar = document.getElementById("BtnAgregar");
    
    let textArea = document.getElementById("contenidoTextArea");
    
    textArea.value = "";
    
    btnAgregar.addEventListener("click",() =>{
    
        // Valor del telefono 
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
    
        //console.log(ArrayNameyText);
        
    });
    
    
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
    
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Iniciando Parsing',
                showConfirmButton: false,
                timer: 800
            })
    
            /* Esta variable copiaLineas, es necesario para no trabajar directamente con el array line, dado que se va modificando, por lo cual no trabajamos sobre la referencia, sino sobre la copia por ejecución, porque si trabajaramos sobre el mismo array que es line, ese arreglo por ejecución va a hacer modificado y por tanto cuando se de iniciar nuevamente, trabajeremos sobre ese modificado y no es lo que se pretende*/
            /* De todas formas este es un control, por si le dan iniciar iniciar iniciar varias veces sin recargar la pagina, digamos para hacerlo mas robusto */

            let copiaLineas = [];

            for (let index = 0; index < line.length; index++) {
                copiaLineas[index] = line[index];
            }
            
            console.log(copiaLineas);

            cargarFront(copiaLineas);

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha seleccionado ningún archivo!',
            }) 
        }
        
        
    });
    
    
    

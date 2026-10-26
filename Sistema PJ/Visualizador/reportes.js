    //funciones usadas para generar hashes
    const cachedFolderFiles = [];
    async function generarHashes(arrayNombres,folder=1) {

        if (!cachedFolderFiles[folder]) {
            return new Promise((resolve, reject) => {
                const input = document.getElementById('folderInput');

                // Listen for selection change once
                input.onchange = async (e) => {
                    cachedFolderFiles[folder] = e.target.files;
                    try {
                        const hash = await procesarBuffersArchivos(arrayNombres,cachedFolderFiles[folder]);
                        resolve(hash);
                    } catch (err) {
                        reject(err);
                    }
                };

                // Force open the folder dialog box
                input.click();
            });
        } else {
            return await procesarBuffersArchivos(arrayNombres,cachedFolderFiles[folder]);
        }
    }

    async function procesarBuffersArchivos(arrayNombres, folderContents) {
        const buffers = [];
        let hashes = [];
        for (const file of arrayNombres) {

            const cleanFile = file.replace(/[\u200E\u200F\u202A-\u202E]/g, "").trim();

            let matchedFile = null;

            for (let i = 0; i < folderContents.length; i++) {
                if (folderContents[i].name === cleanFile || folderContents[i].webkitRelativePath.endsWith('/' + cleanFile)) {
                    matchedFile = folderContents[i];
                    break;
                }
            }

            if (!matchedFile) {
                throw new Error(`Could not find file: ${cleanFile}`);
            }
            else
            {
                const buffer = await matchedFile.arrayBuffer();
                const hashBuffer= await crypto.subtle.digest('SHA-256', buffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                hashes.push({name:file,hash:hashHex});
                console.log(hashHex);
            }
        }
        return hashes; // Devuelve los hashes
    }


async function exportarReporteHTML() {
    try {
        const numeroCausa = document.getElementById('inputPEX')?.value || 'N/D';
        const fechaReporte = document.getElementById('inputFechaReporte')?.value || 'N/D';

        const perito = {
            nombre: document.getElementById('inputNombrePerito')?.value || '',
            apellido: document.getElementById('inputApellidoPerito')?.value || '',
            dependencia: document.getElementById('inputDependenciaPerito')?.value || ''
        };

        const aportante = {
            nombre: document.getElementById('inputNombreAportante')?.value || '',
            apellido: document.getElementById('inputApellidoAportante')?.value || '',
            dni: document.getElementById('inputDNIAportante')?.value || ''
        };

        const dispositivo = {
            marca: document.getElementById('inputMarcaDispositivo')?.value || '',
            modelo: document.getElementById('inputModeloDispositivo')?.value || '',
            imei: document.getElementById('inputImeiDispositivo')?.value || ''
        };

        const arrayNombres = typeof nombres !== 'undefined' ? nombres : [];
        const mapaParticipantes = typeof capturasParticipantes !== 'undefined' ? capturasParticipantes : {};
        const listaChat = typeof capturasChat !== 'undefined' ? capturasChat : [];
        const listaMultimedia = typeof multimedia !== 'undefined' ? multimedia : (typeof multimediasAgregados !== 'undefined' ? multimediasAgregados : []);
        const rutaBaseImagenes = "";
        console.log(arrayArchivosAlcanzados);
        const listaHashesMultimediasChat = await generarHashes(arrayArchivosAlcanzados,1);
         listaHashesMultimediasChat.push(...await generarHashes(listaChat,2));
         listaHashesMultimediasChat.push(...await generarHashes(listaMultimedia,2));
        const mapaParticipantesPlano= [...new Set([...capturasParticipantes.values()].flat())]
        console.log(mapaParticipantesPlano);
        listaHashesMultimediasChat.push(...await generarHashes(mapaParticipantesPlano,2));


        const renderizarParticipantesHTML = () => {
            if (!arrayNombres || arrayNombres.length === 0) {
                return `<p class="empty">No hay nombres ni capturas de participantes registradas.</p>`;
            }

            let html = `<h3>Capturas de Participantes</h3>`;
            arrayNombres.forEach(nombre => {
                const imagenes = mapaParticipantes[nombre] || (mapaParticipantes.get && mapaParticipantes.get(nombre)) || [];

                html += `
                <details class="sub-card" open>
                <summary><strong>Participante: ${nombre}</strong> (${imagenes.length} capturas)</summary>`;

                if (imagenes.length === 0) {
                    html += `<p class="empty" style="margin-top: 10px;">Sin capturas asociadas.</p>`;
                } else {
                    html += `<div class="image-grid">`;
                    imagenes.forEach(imgName => {
                        const rutaCompleta = `${rutaBaseImagenes}${imgName}`;
                        html += `
                        <div class="image-card">
                        <a href="${rutaCompleta}" target="_blank" title="Abrir imagen en nueva ventana">
                        <img src="${rutaCompleta}" alt="${imgName}" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\'error-img\'>No se pudo cargar: ${imgName}</span>';">
                        </a>
                        <span class="img-caption">${imgName}</span>
                        </div>`;
                    });
                    html += `</div>`;
                }
                html += `</details>`;
            });
            return html;
        };

        // 2. Renderizado de imagenes
        const renderizarChatHTML = () => {
            if (!listaChat || listaChat.length === 0) {
                return `<p class="empty">No hay capturas de chat registradas.</p>`;
            }

            let html = `
            <details class="sub-card" open>
            <summary><strong>Capturas de Chat</strong> (${listaChat.length} elementos)</summary>
            <div class="image-grid">`;

            listaChat.forEach(imgName => {
                const rutaCompleta = `${rutaBaseImagenes}${imgName}`;
                html += `
                <div class="image-card">
                <a href="${rutaCompleta}" target="_blank" title="Abrir imagen en nueva ventana">
                <img src="${rutaCompleta}" alt="${imgName}" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\'error-img\'>No se pudo cargar: ${imgName}</span>';">
                </a>
                <span class="img-caption">${imgName}</span>
                </div>`;
            });
            html += `</div></details>`;
            return html;
        };

        // 3. calculo de hashes
        const renderizarHashesHTML = () => {
            if (!listaHashesMultimediasChat || listaHashesMultimediasChat.length === 0) {
                return `<p class="empty">No hay hashes registrados.</p>`;
            }

            let html = `
            <details class="sub-card" open>
            <summary><strong>Hashes Registrados</strong> (${listaHashesMultimediasChat.length} elementos)</summary>
            <ul class="text-list">`;

            listaHashesMultimediasChat.forEach(hash => {
                html += `<li><code>${hash.hash} ${hash.name}</code></li>`;
            });
            html += `</ul></details>`;
            return html;
        };

        // 4. Renderizar Multimedia
        const renderizarMultimediaHTML = () => {
            if (!listaMultimedia || listaMultimedia.length === 0) {
                return `<p class="empty">No hay elementos multimedia registrados.</p>`;
            }

            let html = `
            <details class="sub-card" open>
            <summary><strong>Elementos Multimedia</strong> (${listaMultimedia.length} elementos)</summary>
            <ul class="text-list">`;

            listaMultimedia.forEach(item => {
                html += `<li><a href="${item}" target="_blank" class="media-link" title="Abrir archivo multimedia">${item}</a></li>`;
            });
            html += `</ul></details>`;
            return html;
        };

        // Plantilla HTML con estilos completos
        const contenidoHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Técnico - Numero de Causa: ${numeroCausa}</title>
        <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 20px; background-color: #f4f6f9; }
        .container { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; text-align: center; }
        h2 { color: #34495e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #2980b9; margin-top: 20px; }
        .card { background: #fdfdfd; border: 1px solid #e1e1e1; padding: 15px; border-radius: 6px; margin-bottom: 15px; }

        /* Estilos para listas desplegables (details / summary) */
        details.sub-card { background: #fff; border: 1px solid #dcdcdc; padding: 12px; border-radius: 5px; margin-top: 10px; transition: background 0.2s; }
        details.sub-card[open] { background: #fcfcfc; }
        summary { font-size: 1.05em; color: #34495e; cursor: pointer; outline: none; padding: 4px; user-select: none; }
        summary:hover { color: #3498db; }

        .card p { margin: 5px 0; }
        .meta-info { background: #ecf0f1; padding: 10px 15px; border-radius: 5px; margin-bottom: 20px; display: flex; justify-content: space-between; }

        /* Cuadrícula e interactividad de las imágenes */
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; margin-top: 12px; }
        .image-card { background: #fafafa; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .image-card a { display: block; overflow: hidden; border-radius: 4px; }
        .image-card img { max-width: 100%; height: 130px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc; display: block; margin: 0 auto; transition: transform 0.2s ease, opacity 0.2s ease; }
        .image-card a:hover img { transform: scale(1.04); opacity: 0.9; }
        .img-caption { display: block; font-size: 0.75em; color: #555; margin-top: 6px; word-break: break-all; }
        .error-img { font-size: 0.75em; color: #e74c3c; font-style: italic; display: block; padding: 15px 0; }

        .text-list { margin-top: 10px; padding-left: 20px; }
        .text-list li { margin-bottom: 5px; word-break: break-all; }
        code { background: #f1f1f1; padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }

        /* Estilo para los enlaces multimedia */
        .media-link { color: #2980b9; text-decoration: none; font-weight: 500; }
        .media-link:hover { text-decoration: underline; color: #1abc9c; }

        .empty { color: #7f8c8d; font-style: italic; }
        footer { text-align: center; margin-top: 40px; font-size: 0.9em; color: #95a5a6; }
        </style>
        </head>
        <body>
        <div class="container">
        <h1>Informe Técnico de Peritaje</h1>

        <div class="meta-info">
        <div><strong>Numero de causa:</strong> ${numeroCausa}</div>
        <div><strong>Fecha de Reporte:</strong> ${fechaReporte}</div>
        </div>

        <h2>1. Datos del Perito</h2>
        <div class="card">
        <p><strong>Nombre y Apellido:</strong> ${perito.nombre} ${perito.apellido}</p>
        <p><strong>Dependencia:</strong> ${perito.dependencia || 'No especificada'}</p>
        </div>

        <h2>2. Datos del Aportante</h2>
        <div class="card">
        <p><strong>Nombre y Apellido:</strong> ${aportante.nombre} ${aportante.apellido}</p>
        <p><strong>DNI:</strong> ${aportante.dni || 'No especificado'}</p>
        </div>

        <h2>3. Datos del Dispositivo</h2>
        <div class="card">
        <p><strong>Marca:</strong> ${dispositivo.marca || 'N/D'}</p>
        <p><strong>Modelo:</strong> ${dispositivo.modelo || 'N/D'}</p>
        <p><strong>IMEI:</strong> ${dispositivo.imei || 'N/D'}</p>
        </div>

        <h2>4. Registros y Adjuntos</h2>
        <div class="card">
        ${renderizarParticipantesHTML()}
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        ${renderizarChatHTML()}

        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        ${renderizarMultimediaHTML()}
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">
        ${renderizarHashesHTML()}
        </div>

        <footer>
        Reporte generado automáticamente el ${new Date().toLocaleString()}
        </footer>
        </div>
        </body>
        </html>`;

        // Generar archivo descargable
        const blob = new Blob([contenidoHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const enlaceDescarga = document.createElement('a');

        enlaceDescarga.href = url;
        enlaceDescarga.download = `Reporte_${numeroCausa ? numeroCausa.replace(/[^a-zA-Z0-9-_]/g, '_') : 'Tecnico'}.html`;

        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();

        document.body.removeChild(enlaceDescarga);
        URL.revokeObjectURL(url);

        console.log("Reporte HTML con imágenes y multimedia clickeables exportado con éxito.");
    } catch (error) {
        console.error("Error al generar el reporte HTML:", error);
        alert("Ocurrió un error al generar el reporte HTML.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnGenerar = document.getElementById('generarReporteBtn');
    if (btnGenerar) {
        btnGenerar.addEventListener('click', (e) => {
            e.preventDefault();
            exportarReporteHTML();
        });
    }
});


//Guardo toda la informacion en un json para despues poder restaurarlo
function guardarBorrador() {
    const numeroDeCausa = document.getElementById('inputPEX').value || 'borrador';

    const reporteData = {
        // Datos de cada campo de input del formulario
        numeroDeCausa: numeroDeCausa,
        fechaReporte: document.getElementById('inputFechaReporte').value,
        perito: {
            nombre: document.getElementById('inputNombrePerito').value,
            apellido: document.getElementById('inputApellidoPerito').value,
            dependencia: document.getElementById('inputDependenciaPerito').value
        },
        aportante: {
            nombre: document.getElementById('inputNombreAportante').value,
            apellido: document.getElementById('inputApellidoAportante').value,
            dni: document.getElementById('inputDNIAportante').value
        },
        dispositivo: {
            marca: document.getElementById('inputMarcaDispositivo').value,
            modelo: document.getElementById('inputModeloDispositivo').value,
            imei: document.getElementById('inputImeiDispositivo').value
        },

        ListaCapturasParticipantes: (typeof capturasParticipantes !== 'undefined' && capturasParticipantes instanceof Map)
        ? Array.from(capturasParticipantes.entries())
        : (capturasParticipantes || []),
        ListaCapturasChat: capturasChat || [],
        ListaMultimedia: multimediasAgregados || []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reporteData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);

    downloadAnchor.setAttribute("download", `reporte_${numeroDeCausa}.json`);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    console.log("Borrador guardado con éxito.");
}

    document.getElementById('guardarBorradorBtn').addEventListener('click', () => {
        guardarBorrador();
    });

    //Restauro la informacion guardada en un json
    function cargarBorrador(cargaCompleta) {
        const input = document.getElementById('fileInput');
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    //Vuevlo a cargar los campos de input
                    const data = JSON.parse(e.target.result);
                    document.getElementById('inputPEX').value = data.numeroDeCausa || '';
                    document.getElementById('inputFechaReporte').value = data.fechaReporte || '';

                    // Perito
                    document.getElementById('inputNombrePerito').value = data.perito?.nombre || '';
                    document.getElementById('inputApellidoPerito').value = data.perito?.apellido || '';
                    document.getElementById('inputDependenciaPerito').value = data.perito?.dependencia || '';

                    // Aportante
                    document.getElementById('inputNombreAportante').value = data.aportante?.nombre || '';
                    document.getElementById('inputApellidoAportante').value = data.aportante?.apellido || '';
                    document.getElementById('inputDNIAportante').value = data.aportante?.dni || '';

                    // Dispositivo
                    document.getElementById('inputMarcaDispositivo').value = data.dispositivo?.marca || '';
                    document.getElementById('inputModeloDispositivo').value = data.dispositivo?.modelo || '';
                    document.getElementById('inputImeiDispositivo').value = data.dispositivo?.imei || '';

                    //Vuelvo a cargar los array con los multimedias y capturas
                    if (typeof capturasParticipantes !== 'undefined' && data.ListaCapturasParticipantes) {
                        capturasParticipantes = new Map(data.ListaCapturasParticipantes) ;
                    }
                    if (typeof capturasChat !== 'undefined') {
                        capturasChat = data.ListaCapturasChat || [];
                    }
                    if (typeof multimediasAgregados !== 'undefined') {
                        multimediasAgregados = data.ListaMultimedia || [];
                    }
                    if (typeof cargaCompleta === 'function') {
                        cargaCompleta();
                    }
                    console.log("Borrador recuperado con éxito.");
                } catch (error) {
                    console.error("Error al leer o parsear el archivo JSON:", error);
                    alert("El archivo seleccionado no es un borrador válido.");
                }
            };

            reader.readAsText(file);
        };
        input.click();
    }

    document.getElementById('cargarBorradorBtn').addEventListener('click', () => {
        cargarBorrador((data) => {
            renderList('scrollCapturasChat', capturasChat,0);
            renderList('scrollMultimedia', multimediasAgregados,0);
            console.log("Interfaz actualizada con los datos del borrador.");

        }

        );


    });



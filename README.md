# Sistema-PJ — Herramienta para Preservar y Visualizar Evidencia Digital de Aplicaciones de Mensajería Instantánea

## Descripción

Sistema-PJ es una herramienta de código abierto orientada al ámbito judicial que permite preservar y visualizar evidencia digital proveniente de aplicaciones de mensajería instantánea. Dado que los formatos de exportación de estas aplicaciones presentan dificultades para su lectura y análisis, la herramienta transforma esa información en una representación visual fiel a la interfaz original de la aplicación, facilitando la labor de peritos informáticos y operadores judiciales.

La herramienta fue desarrollada en el marco de una **Práctica Profesional Supervisada (PPS)** de la Licenciatura en Ciencias de la Computación, llevada a cabo en el **Departamento de Investigación de Delitos Complejos del Ministerio Público Fiscal de la Provincia de San Luis**, en virtud de un convenio con la **Facultad de Ciencias Físico Matemáticas y Naturales de la Universidad Nacional de San Luis**.

## Contexto de uso

La evidencia digital obtenida de aplicaciones de mensajería es cada vez más frecuente en causas judiciales de diversa índole: grooming, extorsión, violencia doméstica, violencia de género, estafas, robos, entre otras. Uno de los procedimientos más comunes es el **aporte voluntario de evidencia**, donde los involucrados exportan sus conversaciones desde el dispositivo móvil y las presentan como prueba.

El problema es que el formato exportado —generalmente un archivo `.txt`— presenta cierto tecnicismo que lo hace ilegible para los operadores judiciales. Esta herramienta resuelve ese problema.

## Funcionalidades

- Carga y parseo del archivo `.txt` exportado desde WhatsApp (Android)
- Conversión a formato JSON estructurado
- Visualización de la conversación en una interfaz tipo chat
- Filtrado por rango de fechas
- Identificación del titular de la cuenta
- Soporte para mensajes con archivos multimedia adjuntos
- Exportación del chat visualizado

## Aplicaciones soportadas

| Aplicación | Sistema Operativo | Estado |
|---|---|---|
| WhatsApp | Android | ✅ Disponible |
| WhatsApp | iOS | 🔄 En desarrollo |
| Telegram | — | 🔄 En desarrollo |

## Estructura del repositorio

```
Sistema-PJ/
├── Analizador/        # Parser del archivo .txt exportado (Android)
├── Visualizador/      # Interfaz visual del chat
└── README.md
```

## Instrucciones de uso

### WhatsApp Android

1. Exportar la conversación desde WhatsApp en el dispositivo Android (sin multimedia o con multimedia).
2. Guardar todos los archivos de exportación en la carpeta Fuente 
3. Abrir `Analizador/AbrirArchivo.html` en el navegador.
4. Cargar el archivo `.txt` exportado.
5. Descargar el archivo JSON generado.
6. Abrir `Visualizador/visualizador.html` en el navegador.
7. Cargar el archivo JSON para visualizar la conversación.

### WhatsApp iOS

Próximamente disponible de forma integrada. El parser está en desarrollo.

## Tecnologías utilizadas

- HTML, CSS, JavaScript (interfaz y lógica del analizador Android)
- Bootstrap 5
- jQuery / Moment.js / DateRangePicker
- SweetAlert2
- Python (parsers en desarrollo para iOS y Telegram)

## Estado del proyecto

Versión actual: **beta**. La herramienta se encuentra en una etapa funcional para WhatsApp Android y está siendo extendida para soportar otras aplicaciones de mensajería.

## Licencia

Este proyecto se distribuye bajo la licencia **GNU General Public License v3.0 (GPL-3.0)**.

Esto implica que cualquier uso, modificación o distribución del código debe:
- Reconocer a los autores originales.
- Distribuirse bajo la misma licencia.
- Mantener el código fuente accesible.

Para más detalles ver el archivo [LICENSE](./LICENSE).

## Autores

Este proyecto fue concebido y desarrollado por:

| Rol | Nombre |
|---|---|
| Desarrollador | Agustín Mario Figueroa |
| Director | Dr. Ing. Enrique Alfredo Miranda |
| Co-Directora | Ma. Ing. Lorena Soledad Baigorria Fernandez |

## Contribuciones

Las contribuciones son bienvenidas. Si encontrás un bug, querés proponer una mejora o extender la herramienta a otras plataformas de mensajería.

El único requisito es que cualquier desarrollo derivado mantenga el carácter de **código abierto y libre uso**.

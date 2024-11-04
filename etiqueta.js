// Obtener los parámetros de la URL (datos del formulario)
function getParameterByName(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Asignar valores a los elementos HTML
document.getElementById('tituloEtiqueta').textContent = getParameterByName('titulo') || '195/65R16 91H XL M+S';
document.getElementById('producto').textContent = getParameterByName('producto') || 'Neumáticos';
document.getElementById('chas').textContent = getParameterByName('chas') || 'E012410227324WR';
document.getElementById('parte').textContent = getParameterByName('parte') || '4499';
document.getElementById('modelo').textContent = getParameterByName('modelo') || 'CONFORT F01';
document.getElementById('razonSocial').textContent = getParameterByName('razonSocial') || 'Sunset Tires Corporation';
document.getElementById('cuit').textContent = getParameterByName('cuit') || '30-71593752-9';
document.getElementById('licencia1').textContent = getParameterByName('licencia1') || 'E4*30R02/22*81949*01';

// Generar el código QR con los datos
const qrData = `${getParameterByName('producto')} - ${getParameterByName('chas')}`;
const qrCodeImg = document.getElementById('qrCode');
qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

// Esperar a que las imágenes necesarias (QR y opcional) estén cargadas usando Promesas
function waitForImagesToLoad() {
    const promises = [];

    // Esperar a que el QR esté cargado
    promises.push(new Promise((resolve) => {
        if (qrCodeImg.complete) {
            resolve();
        } else {
            qrCodeImg.onload = () => resolve();
        }
    }));

    // Verificar si la imagen opcional está visible y esperar a que se cargue
    const imagenOpcional = document.getElementById('imagenOpcional').querySelector("img");
    if (imagenOpcional && imagenOpcional.complete === false) {
        promises.push(new Promise((resolve) => {
            imagenOpcional.onload = () => resolve();
        }));
    }

    return Promise.all(promises);
}

// Verificar si mostrarImagen está en la URL y es "true"
const mostrarImagen = getParameterByName('mostrarImagen');
if (mostrarImagen === 'true') {
    document.getElementById('imagenOpcional').style.display = 'block';
}

// Cambiar color del encabezado dinámicamente
document.getElementById('headerColor').addEventListener('input', (event) => {
    document.documentElement.style.setProperty('--header-bg-color', event.target.value);
});

// Descargar como PDF
async function downloadPDF() {
    const etiqueta = document.getElementById("etiqueta");
    const colorPicker = document.querySelector(".color-picker");

    // Obtener el título de la etiqueta y el modelo para el nombre del archivo
    const titulo = document.getElementById('tituloEtiqueta').textContent.trim();
    const modelo = document.getElementById('modelo').textContent.trim();
    const nombreArchivo = `${titulo}_${modelo}.pdf`.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_'); // Limpiar caracteres especiales y espacios

    colorPicker.style.display = "none"; // Ocultar selector de color temporalmente

    // Esperar a que todas las imágenes necesarias estén cargadas
    await waitForImagesToLoad();

    // Generar el PDF
    generatePDF(etiqueta, colorPicker, nombreArchivo);
}

// Función para generar el PDF usando html2canvas y jsPDF
function generatePDF(etiqueta, colorPicker, nombreArchivo) {
    setTimeout(() => {
        // Ajustes de html2canvas para mejor calidad en la captura
        html2canvas(etiqueta, { 
            scale: 4, // Aumenta la escala para mejorar la resolución
            useCORS: true, 
            allowTaint: true,
            backgroundColor: null // Sin fondo adicional para capturar sólo el contenido
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            // Configuración del tamaño exacto del PDF en mm convertido a puntos (90x100 mm -> 255x283 puntos)
            const pdfWidth = 255;
            const pdfHeight = 283;

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt", // Usamos puntos para mejor control
                format: [pdfWidth, pdfHeight] // Tamaño fijo de 90x100 mm en puntos
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Añade la imagen ajustada al PDF
            pdf.save(nombreArchivo); // Usa el nombre personalizado para el archivo

            colorPicker.style.display = "flex"; // Restaurar el selector de color
        }).catch(error => console.error("Error al generar el PDF:", error));
    }, 500);
}

function volverAlInicio() {
    window.location.href = "index.html"; // Redirige a la página de inicio
}

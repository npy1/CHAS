// Obtener los parámetros de la URL (datos del formulario)
const urlParams = new URLSearchParams(window.location.search);

// Asignar los valores a los elementos HTML
document.getElementById('producto').textContent = urlParams.get('producto');
document.getElementById('chas').textContent = urlParams.get('chas');
document.getElementById('parte').textContent = urlParams.get('parte');
document.getElementById('modelo').textContent = urlParams.get('modelo');
document.getElementById('razonSocial').textContent = urlParams.get('razonSocial');
document.getElementById('cuit').textContent = urlParams.get('cuit');
document.getElementById('licencia1').textContent = urlParams.get('licencia1');

// Generar el código QR con los datos
const qrData = `${urlParams.get('producto')} - ${urlParams.get('chas')}`;
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}`;
document.getElementById('qrCode').src = qrCodeUrl;

// public/js/notificaciones.js

const socket = io();
const panel = document.getElementById('notificationPanel');
const count = document.getElementById('notificationCount');
let solicitudes = 0;

function toggleNotifications() {
  panel.classList.toggle('active');
}

socket.on('nueva-solicitud', (data) => {
  solicitudes++;
  count.textContent = solicitudes;
  count.style.display = 'inline';

  const solicitudHtml = `
    <p><strong>${data.nombre}</strong> te ha enviado una solicitud de amistad</p>
    <button onclick="responderSolicitud('aceptada', '${data.nombre}')">Aceptar</button>
    <button onclick="responderSolicitud('rechazada', '${data.nombre}')">Rechazar</button>
    <hr>
  `;
  panel.innerHTML += solicitudHtml;
});

function responderSolicitud(respuesta, nombre) {
  socket.emit('respuesta-solicitud', { respuesta, nombre });
  alert(`Solicitud ${respuesta} enviada a ${nombre}`);
  solicitudes--;
  count.textContent = solicitudes;
  if (solicitudes === 0) {
    count.style.display = 'none';
  }
  panel.innerHTML = '';
  panel.classList.remove('active');
}

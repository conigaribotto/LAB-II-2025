
const usuarioId = localStorage.getItem('usuarioId');
const perfilForm = document.getElementById('perfil-form');
const passForm = document.getElementById('pass-form');
const messageDiv = document.getElementById('perfil-message');
const publicacionesDiv = document.getElementById('contenedor-publicaciones');
const publicacionForm = document.getElementById('publicacion-form');
const publicacionMensaje = document.getElementById('publicacion-mensaje');

window.onload = async () => {
  const res = await fetch(`/usuario/${usuarioId}`);
  const usuario = await res.json();
  perfilForm.nombre.value = usuario.nombre;
  perfilForm.email.value = usuario.email;
  perfilForm.intereses.value = usuario.intereses || '';
  perfilForm.antecedentes.value = usuario.bio || '';
  document.getElementById('nombre-usuario').textContent = usuario.nombre;
  if (usuario.avatar) document.getElementById('avatar-preview').src = usuario.avatar;

  const lista = document.getElementById("usuarios-lista");
  const r = await fetch(`/usuarios`);
  const usuarios = await r.json();
  lista.innerHTML = usuarios.filter(u => u.id != usuarioId)
    .map(u => `<p>${u.nombre} (${u.email}) <button onclick="enviarSolicitud(${usuarioId}, ${u.id}, '${usuario.nombre}')">Agregar</button></p>`).join('');

  await cargarPublicaciones();
  await cargarAmigosAceptados();
};

perfilForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(perfilForm);
  formData.append('usuarioId', usuarioId);
  const res = await fetch('/usuario/editar', { method: 'POST', body: formData });
  const data = await res.text();
  messageDiv.textContent = data;
  messageDiv.style.color = res.ok ? 'green' : 'red';
});

passForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nuevaPass = passForm.nuevaPass.value;
  const res = await fetch('/usuario/pass', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, password: nuevaPass })
  });
  const data = await res.text();
  messageDiv.textContent = data;
  messageDiv.style.color = res.ok ? 'green' : 'red';
});

publicacionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(publicacionForm);
  formData.append('usuarioId', usuarioId);
  const res = await fetch('/upload', { method: 'POST', body: formData });
  const data = await res.json().catch(() => ({ message: 'Error inesperado' }));
  publicacionMensaje.textContent = data.message || 'Error al publicar';
  publicacionMensaje.style.color = res.ok ? 'green' : 'red';
  if (res.ok) {
    publicacionForm.reset();
    await cargarPublicaciones();
  }
});

async function cargarPublicaciones() {
  const res = await fetch('/imagenes');
  const imagenes = await res.json();
  publicacionesDiv.innerHTML = '';
  for (const img of imagenes.reverse().filter(img => img.usuario_id == usuarioId)) {
    const comentarios = await fetch(`/comentarios/${img.id}`).then(r => r.json());
    const card = document.createElement('div');
    card.className = 'publicacion-card';
    card.innerHTML = `
      <img src="${img.ruta}" alt="Imagen publicada" />
      <p>${img.caption}</p>
      <div class="comentarios">
        <h4>Comentarios</h4>
        <div class="comentarios-lista" id="comentarios-${img.id}">
          ${comentarios.map(c => `<p><strong>${c.usuario.nombre}:</strong> ${c.texto}</p>`).join('')}
        </div>
        <form onsubmit="return enviarComentario(${img.id}, this)">
          <input type="text" name="texto" placeholder="Escribe un comentario..." required>
          <button type="submit">Comentar</button>
        </form>
      </div>
    `;
    publicacionesDiv.appendChild(card);
  }
}

function enviarComentario(imagenId, form) {
  const texto = form.texto.value;
  fetch('/comment', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, imagenId, usuarioId })
  }).then(r => r.json()).then(data => {
    if (data.comentario) {
      const contenedor = document.getElementById('comentarios-' + imagenId);
      contenedor.innerHTML = `<p><strong>Tú:</strong> ${texto}</p>` + contenedor.innerHTML;
      form.reset();
    }
  });
  return false;
}

function enviarSolicitud(de_usuario_id, para_usuario_id, nombre) {
  fetch('/amistad/enviar', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ de_usuario_id, para_usuario_id, de_usuario_nombre: nombre })
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => console.error(err));
}

// NOTIFICACIONES LATERALES
const socket = io();
socket.emit('registrar-usuario', usuarioId);
const panel = document.getElementById('notificationPanel');
const lista = document.getElementById('notificacionesLista');

socket.on('nueva-solicitud', async (data) => {
  if (parseInt(data.para_usuario_id) === parseInt(usuarioId)) {
    await cargarSolicitudesPendientes();
  }
});

async function cargarSolicitudesPendientes() {
  const res = await fetch(`/amistades/pendientes/${usuarioId}`);
  const solicitudes = await res.json();
  if (!solicitudes.length) {
    lista.innerHTML = 'No hay solicitudes';
    return;
  }
  lista.innerHTML = '';
  solicitudes.forEach(s => {
    lista.innerHTML += `
      <p><strong>${s.de_usuario_nombre}</strong> te envió una solicitud</p>
      <button onclick="responderSolicitud('aceptada', ${s.id})">Aceptar</button>
      <button onclick="responderSolicitud('rechazada', ${s.id})">Rechazar</button>
      <hr>`;
  });
}

function responderSolicitud(estado, id) {
  fetch('/amistad/responder', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, estado })
  })
  .then(r => r.text())
  .then(() => {
    cargarSolicitudesPendientes();
    cargarAmigosAceptados();
  });
}

// Cargar amigos aceptados
async function cargarAmigosAceptados() {
  const res = await fetch(`/amistades/aceptadas/${usuarioId}`);
  const amigos = await res.json();
  const lista = document.getElementById('lista-amigos');

  if (!amigos.length) {
    lista.innerHTML = '<li>No tienes amigos aún.</li>';
    return;
  }

  lista.innerHTML = amigos.map(a =>
    `<li><strong>${a.nombre}</strong> (${a.email})</li>`
  ).join('');
}

cargarSolicitudesPendientes();

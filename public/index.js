const formBusqueda = document.getElementById('form-busqueda');
const resultadosDiv = document.getElementById('resultados');
const usuarioId = localStorage.getItem('usuarioId');
const userSessionDiv = document.getElementById("user-session");
const authButtons = document.getElementById("auth-buttons");

formBusqueda.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('search-bar').value.trim();
  if (!query) return;

  const resUsuarios = await fetch('/usuarios');
  const usuarios = await resUsuarios.json();
  const resultados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  resultadosDiv.innerHTML = `<h2 style="text-align:center; margin-bottom: 30px;">Resultados de la búsqueda</h2>`;

  for (const usuario of resultados) {
    const publicacionesRes = await fetch('/imagenes?usuarioId=' + usuario.id);
    const publicaciones = await publicacionesRes.json();

    resultadosDiv.innerHTML += `
      <div class="resultado-perfil">
        <img src="${usuario.avatar || '/uploads/default.jpg'}" class="resultado-avatar" />
        <h3 class="resultado-nombre">${usuario.nombre}</h3>
        <p class="resultado-email"><strong>Email:</strong> ${usuario.email}</p>
        <p class="resultado-intereses"><strong>Intereses:</strong> ${usuario.intereses || 'No especificados'}</p>
        <p class="resultado-bio"><strong>Biografía:</strong> ${usuario.bio || 'Sin biografía'}</p>
      </div>
    `;

    for (const img of publicaciones.reverse()) {
      const comentarios = await fetch(`/comentarios/${img.id}`).then(r => r.json());

      resultadosDiv.innerHTML += `
        <div class="resultado-publicacion">
          <img src="${img.ruta}" />
          <p class="resultado-caption">${img.caption}</p>
          <div class="comentarios">
            <h4>Comentarios</h4>
            <div class="comentarios-lista" id="comentarios-${img.id}">
              ${comentarios.map(c => `<p><strong>${c.usuario.nombre}:</strong> ${c.texto}</p>`).join('')}
            </div>
            ${usuarioId ? `
              <form onsubmit="return enviarComentarioDesdeBusqueda(${img.id}, this)">
                <input type="text" name="texto" placeholder="Escribí un comentario..." required />
                <button type="submit">Comentar</button>
              </form>
            ` : '<p style="color: gray; font-size: 0.9rem;">Iniciá sesión para comentar</p>'}
          </div>
        </div>
      `;
    }
  }

  if (resultados.length === 0) {
    resultadosDiv.innerHTML = `<p style="text-align:center; color: gray;">No se encontraron usuarios con ese criterio.</p>`;
  }
});

// Enviar comentario desde resultados
function enviarComentarioDesdeBusqueda(imagenId, form) {
  const texto = form.texto.value;
  fetch('/comment', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto, imagenId, usuarioId })
  })
    .then(r => r.json())
    .then(data => {
      if (data.comentario) {
        const contenedor = document.getElementById('comentarios-' + imagenId);
        contenedor.innerHTML = `<p><strong>Tú:</strong> ${texto}</p>` + contenedor.innerHTML;
        form.reset();
      }
    });
  return false;
}

// Verificar sesión activa
async function verificarSesion() {
  if (usuarioId) {
    const res = await fetch(`/usuario/${usuarioId}`);
    const user = await res.json();
    document.getElementById('user-nombre').textContent = user.nombre;
    document.getElementById('user-avatar').src = user.avatar || '/uploads/default.jpg';
    userSessionDiv.style.display = 'flex';
    authButtons.style.display = 'none';
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('usuarioId');
  location.reload();
}

verificarSesion();

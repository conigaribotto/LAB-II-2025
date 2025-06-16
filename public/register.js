document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const messageDiv = document.getElementById("register-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
      });

      const text = await response.text();

      if (response.ok) {
        mostrarMensaje("✅ Usuario registrado con éxito", "green");
        form.reset();
      } else {
        mostrarMensaje(`❌ ${text}`, "red");
      }
    } catch (err) {
      mostrarMensaje("❌ Error al conectar con el servidor", "red");
    }
  });

  function mostrarMensaje(texto, color) {
    messageDiv.textContent = texto;
    messageDiv.style.color = color;
  }
});

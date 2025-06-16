document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const messageDiv = document.getElementById("login-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("usuarioId", result.id);
        window.location.href = "/perfil.html";
      } else {
        mostrarMensaje(`❌ ${result}`, "red");
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

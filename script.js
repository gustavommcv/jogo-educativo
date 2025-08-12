let homeTitle = document.querySelector(".home__title");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("jogo.json");
    const data = await response.json();

    homeTitle.textContent = data.titulo;
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
  }
});

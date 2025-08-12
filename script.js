let gameData = {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("jogo.json");
    gameData = await response.json();

    document.querySelector(".home__title").textContent = gameData.titulo;

    document.querySelector(".app-button").addEventListener("click", startGame);
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
  }
});

function startGame() {
  document.getElementById("homeScreen").style.display = "none";
  const gameScreen = document.getElementById("gameScreen");
  gameScreen.style.display = "block";

  const targetsContainer = document.getElementById("targetsContainer");
  gameData.etapas.forEach((etapa) => {
    const target = document.createElement("div");
    target.className = "target";
    target.innerHTML = `<h3 class="target__name">${etapa.nome}</h3>`;

    targetsContainer.appendChild(target);
  });

  const blocksContainer = document.getElementById("blocksContainer");
  gameData.etapas.forEach((etapa) => {
    const block = document.createElement("div");
    block.classList = "block";
    block.innerHTML = `<p class="block__description">${etapa.descricao}</p>`;

    blocksContainer.appendChild(block);
  });
}

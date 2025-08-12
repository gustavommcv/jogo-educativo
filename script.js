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
  gameScreen.style.display = "flex";

  const targetsContainer = document.getElementById("targetsContainer");
  const blocksContainer = document.getElementById("blocksContainer");

  blocksContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    blocksContainer.classList.add("drag-over");
  });

  blocksContainer.addEventListener("dragleave", (e) => {
    if (!blocksContainer.contains(e.relatedTarget)) {
      blocksContainer.classList.remove("drag-over");
    }
  });

  blocksContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    blocksContainer.classList.remove("drag-over");

    const blockId = e.dataTransfer.getData("text/plain");
    const block = document.getElementById(blockId);
    blocksContainer.appendChild(block);
  });

  gameData.etapas.forEach((etapa) => {
    const target = document.createElement("div");
    target.className = "target";
    target.innerHTML = `<h3 class="target__name">${etapa.nome}</h3>`;

    target.addEventListener("dragover", (e) => {
      e.preventDefault();
      target.classList.add("drag-over");
    });

    target.addEventListener("dragleave", (e) => {
      if (!target.contains(e.relatedTarget)) {
        target.classList.remove("drag-over");
      }
    });

    target.addEventListener("drop", (e) => {
      e.preventDefault();
      target.classList.remove("drag-over");

      const blockId = e.dataTransfer.getData("text/plain");
      const block = document.getElementById(blockId);
      target.appendChild(block);
    });

    targetsContainer.appendChild(target);
  });

  gameData.etapas.forEach((etapa, i) => {
    const block = document.createElement("div");
    block.id = `block-${i}`;
    block.draggable = true;
    block.className = "block";
    block.innerHTML = `<p class="block__description">${etapa.descricao}</p>`;

    block.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", block.id);
      block.classList.add("dragging");
    });

    block.addEventListener("dragend", () => {
      block.classList.remove("dragging");
    });

    blocksContainer.appendChild(block);
  });
}

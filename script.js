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
  const checkButton = document.querySelector(".check-button");

  let score = 0;
  let maxScore = 4;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.className = "score-display";
  scoreDisplay.innerHTML = `<span>Pontuação: ${score}/${maxScore}</span>`;
  gameScreen.insertBefore(scoreDisplay, targetsContainer);

  const updateScore = () => {
    scoreDisplay.innerHTML = `<span>Pontuação: ${score}/${maxScore}</span>`;
  };

  const checkAllTargetsFilled = () => {
    const targets = document.querySelectorAll(".target");
    const allFilled = Array.from(targets).every(
      (target) => target.querySelector(".block:not(.dragging)") !== null,
    );

    checkButton.disabled = !allFilled;

    if (allFilled) {
      checkButton.classList.remove("disabled");
    } else {
      checkButton.classList.add("disabled");
    }
  };

  const updateTargetState = (target) => {
    const blocks = target.querySelectorAll(".block:not(.dragging)");
    const hasBlock = blocks.length > 0;

    target.classList.remove("occupied");
    target.classList.remove("incorrect");

    if (!target.querySelector(".block.locked")) {
      target.classList.remove("correct");
    }

    if (hasBlock) {
      target.classList.add("occupied");
    }

    checkAllTargetsFilled();
  };

  checkButton.disabled = true;
  checkButton.classList.add("disabled");

  checkButton.addEventListener("click", () => {
    if (!checkButton.disabled) {
      const targets = document.querySelectorAll(".target");
      let allCorrect = true;
      let correctCount = 0;

      targets.forEach((target, index) => {
        const block = target.querySelector(".block");
        if (block) {
          const blockId = block.id;
          const expectedBlockId = `block-${index}`;

          if (blockId === expectedBlockId) {
            correctCount++;
            target.classList.add("correct");
            target.classList.remove("incorrect");
            block.classList.add("locked");
            block.draggable = false;
            block.style.cursor = "default";

            if (!target.classList.contains("was-correct")) {
              score++;
              target.classList.add("was-correct");
            }
          } else {
            allCorrect = false;

            target.classList.add("incorrect");
            target.classList.remove("correct");

            setTimeout(() => {
              target.removeChild(block);
              blocksContainer.appendChild(block);
              target.classList.remove("incorrect", "occupied");
              updateTargetState(target);
            }, 1000);
          }
        }
      });

      updateScore();

      if (allCorrect) {
        setTimeout(() => {
          showFinalScreen(score, maxScore);
        }, 1500);
      } else {
        const incorrectTargets = Array.from(targets).filter((target, index) => {
          const block = target.querySelector(".block");
          if (block) {
            const blockId = block.id;
            const expectedBlockId = `block-${index}`;
            return blockId !== expectedBlockId;
          }
          return false;
        });

        const targetNames = incorrectTargets
          .map((target) => target.querySelector(".target__name").textContent)
          .join(", ");

        alert(
          `Ops! Apenas ${correctCount} de ${targets.length} blocos estão corretos.\n\nTargets incorretos: ${targetNames}\n\nOs blocos incorretos voltaram para suas posições originais. Tente novamente!`,
        );
      }
    }
  });

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

      if (!target.classList.contains("occupied")) {
        target.classList.add("drag-over");
      }
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

      const existingBlock = target.querySelector(".block");

      if (existingBlock) {
        existingBlock.remove();
        blocksContainer.appendChild(existingBlock);
      }

      target.appendChild(block);

      updateTargetState(target);

      block.addEventListener("click", () => {
        target.removeChild(block);

        blocksContainer.appendChild(block);

        updateTargetState(target);
      });
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

      document.querySelectorAll(".target").forEach((target) => {
        const blocks = target.querySelectorAll(".block:not(.dragging)");
        const hasBlock = blocks.length > 0;

        if (hasBlock) {
          target.classList.add("occupied");
        } else {
          target.classList.remove("occupied");
        }
      });

      checkAllTargetsFilled();
    });

    blocksContainer.appendChild(block);
  });
}

function showFinalScreen(score, maxScore) {
  const gameScreen = document.getElementById("gameScreen");
  gameScreen.style.display = "none";

  const finalScreen = document.createElement("div");
  finalScreen.className = "final-screen";
  finalScreen.innerHTML = `
    <div class="final-content">
      <h1 class="final-title">Parabéns!</h1>
      <p class="final-message">Você completou o jogo com sucesso!</p>
      <div class="final-score">
        <h2>Pontuação Final</h2>
        <p class="score-number">${score}/${maxScore}</p>
        <p class="score-percentage">${Math.round((score / maxScore) * 100)}%</p>
      </div>
      <button class="app-button restart-button" type="button">Jogar Novamente</button>
    </div>
  `;

  document.querySelector("main").appendChild(finalScreen);

  finalScreen.querySelector(".restart-button").addEventListener("click", () => {
    location.reload();
  });
}

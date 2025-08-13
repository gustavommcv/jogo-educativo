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

  const GAME_TIME_SECONDS = 60;

  let score = 0;
  const maxScore = gameData.etapas.length;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.className = "score-display";
  scoreDisplay.innerHTML = `<span>Pontuação: ${score}/${maxScore}</span>`;
  gameScreen.insertBefore(scoreDisplay, targetsContainer);

  const timerDisplay = document.createElement("div");
  timerDisplay.className = "timer-display";
  timerDisplay.innerHTML = `<span>Tempo: ${GAME_TIME_SECONDS}s</span>`;
  gameScreen.insertBefore(timerDisplay, scoreDisplay);

  let timeLeft = GAME_TIME_SECONDS;
  let timerInterval;

  const updateTimer = () => {
    if (timeLeft < 0) {
      timeLeft = 0;
    }

    timerDisplay.innerHTML = `<span>Tempo: ${timeLeft}s</span>`;

    if (timeLeft <= 0) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      timerDisplay.innerHTML = `<span>Tempo esgotado!</span>`;
      timerDisplay.classList.add("time-up");

      checkButton.disabled = true;
      checkButton.classList.add("disabled");

      showTimeUpOptions();
    }
  };

  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimer();
    }, 1000);
  };

  const showTimeUpOptions = () => {
    const timeUpOverlay = document.createElement("div");
    timeUpOverlay.className = "time-up-overlay";
    timeUpOverlay.innerHTML = `
      <div class="time-up-content">
        <h2>⏰ Tempo Esgotado!</h2>
        <p>Você não conseguiu completar o jogo a tempo.</p>
        <div class="time-up-buttons">
          <button class="app-button try-again-button" type="button">Tentar Novamente</button>
          <button class="app-button home-button" type="button">Voltar ao Início</button>
        </div>
      </div>
    `;

    document.body.appendChild(timeUpOverlay);

    timeUpOverlay
      .querySelector(".try-again-button")
      .addEventListener("click", () => {
        timeUpOverlay.remove();

        resetGame();
      });

    timeUpOverlay
      .querySelector(".home-button")
      .addEventListener("click", () => {
        location.reload();
      });
  };

  const resetGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    document.querySelectorAll(".target").forEach((target) => {
      const block = target.querySelector(".block");
      if (block) {
        target.removeChild(block);
        blocksContainer.appendChild(block);
        target.classList.remove(
          "occupied",
          "correct",
          "incorrect",
          "was-correct",
        );

        block.classList.remove("locked", "was-correct");
        block.draggable = true;
        block.style.cursor = "grab";
      }
    });

    shuffleBlocks();

    score = 0;
    updateScore();

    timeLeft = GAME_TIME_SECONDS;
    timerDisplay.innerHTML = `<span>Tempo: ${timeLeft}s</span>`;
    timerDisplay.classList.remove("time-up");

    checkButton.disabled = true;
    checkButton.classList.add("disabled");

    startTimer();
  };

  const updateScore = () => {
    scoreDisplay.innerHTML = `<span>Pontuação: ${score}/${maxScore}</span>`;
  };

  const checkAllTargetsFilled = () => {
    const targets = document.querySelectorAll(".target");

    const filledCount = Array.from(targets).filter(
      (target) => target.querySelector(".block") !== null,
    ).length;

    const allFilled = filledCount === maxScore;

    checkButton.disabled = !allFilled;

    if (allFilled) {
      checkButton.classList.remove("disabled");
    } else {
      checkButton.classList.add("disabled");
    }
  };

  const updateTargetState = (target) => {
    const hasBlock = target.querySelector(".block") !== null;

    if (hasBlock) {
      target.classList.add("occupied");
    } else {
      target.classList.remove("occupied");
    }

    checkAllTargetsFilled();
  };

  const shuffleBlocks = () => {
    const blocks = Array.from(blocksContainer.children);

    blocks.forEach((block) => {
      block.classList.remove("locked", "was-correct", "dragging");
      block.draggable = true;
      block.style.cursor = "grab";
    });

    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }

    blocks.forEach((block) => {
      blocksContainer.appendChild(block);
    });
  };

  checkButton.disabled = true;
  checkButton.classList.add("disabled");

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
    const sourceIndex = block?.dataset?.sourceTargetIndex;
    if (sourceIndex !== undefined && sourceIndex !== "") {
      const sourceTarget = document.querySelector(`.target[data-target-index="${sourceIndex}"]`);
      if (sourceTarget) {
        sourceTarget.classList.remove("correct", "incorrect");
        updateTargetState(sourceTarget);
      }
      delete block.dataset.sourceTargetIndex;
    }
    blocksContainer.appendChild(block);
    checkAllTargetsFilled();
  });

  gameData.etapas.forEach((etapa, targetIndex) => {
    const target = document.createElement("div");
    target.className = "target";
    target.innerHTML = `<h3 class="target__name">${etapa.nome}</h3>`;
    target.dataset.targetIndex = String(targetIndex);

    target.addEventListener("dragover", (e) => {
      const existingBlock = target.querySelector(".block");
      const isLocked = !!(existingBlock && existingBlock.classList.contains("locked"));
      if (isLocked) {
        return;
      }
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
      
      const lockedExisting = target.querySelector(".block.locked");
      if (lockedExisting) {
        return;
      }

      const existingBlock = target.querySelector(".block");
      if (existingBlock) {
        existingBlock.remove();
        blocksContainer.appendChild(existingBlock);

        existingBlock.classList.remove("locked", "was-correct", "dragging");
        existingBlock.draggable = true;
        existingBlock.style.cursor = "grab";
      }
      
      target.classList.remove("correct", "incorrect");
      target.appendChild(block);
      updateTargetState(target);

      if (block._targetClickHandler) {
        block.removeEventListener("click", block._targetClickHandler);
      }
      block._targetClickHandler = () => {
        if (!block.classList.contains("locked")) {
          target.removeChild(block);
          blocksContainer.appendChild(block);

          block.classList.remove("locked", "was-correct", "dragging");
          block.draggable = true;
          block.style.cursor = "grab";

          target.classList.remove("correct", "incorrect");
          updateTargetState(target);
        }
      };
      block.addEventListener("click", block._targetClickHandler);
    });

    targetsContainer.appendChild(target);
  });

  gameData.etapas.forEach((etapa, index) => {
    const block = document.createElement("div");
    block.id = `block-${index}`;
    block.draggable = true;
    block.className = "block";
    block.innerHTML = `<p class="block__description">${etapa.descricao}</p>`;

    block.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", block.id);
      block.classList.add("dragging");
      const parent = block.parentElement;
      if (parent && parent.classList.contains("target")) {
        block.dataset.sourceTargetIndex = parent.dataset.targetIndex || "";
      } else {
        delete block.dataset.sourceTargetIndex;
      }
    });

    block.addEventListener("dragend", () => {
      block.classList.remove("dragging");
    });

    blocksContainer.appendChild(block);
  });

  shuffleBlocks();

  startTimer();

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

            block.classList.remove("locked", "was-correct", "dragging");
            block.draggable = true;
            block.style.cursor = "grab";

            target.classList.remove("incorrect", "occupied");
            updateTargetState(target);
          }, 1000);
        }
      }
      });

  updateScore();

  if (allCorrect) {
    clearInterval(timerInterval);

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
      `Ops! Apenas ${correctCount} de ${maxScore} blocos estão corretos.\n\nTargets incorretos: ${targetNames}\n\nOs blocos incorretos voltaram para suas posições originais. Tente novamente!`,
    );
  }
}
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

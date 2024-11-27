const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const playerInfo = document.getElementById("playerInfo");
const boardSize = 5;

let bombPosition, safeCells, clickedCells;
let playerName, playerMoney, currentMoney;

// Função para configurar o jogo
function startGameSetup() {
  const nameInput = document.getElementById("playerName");
  const moneyInput = document.getElementById("playerMoney");

  playerName = nameInput.value.trim();
  playerMoney = parseFloat(moneyInput.value);

  if (!playerName || isNaN(playerMoney) || playerMoney <= 0) {
    alert("Por favor, insira um nome válido e um valor de aposta maior que zero.");
    return;
  }

  currentMoney = playerMoney;

  setupScreen.classList.add("d-none");
  gameScreen.classList.remove("d-none");

  playerInfo.textContent = `Jogador: ${playerName} | Dinheiro Atual: R$ ${currentMoney.toFixed(2)}`;
  startGame();
}


// Função para iniciar o jogo
function startGame() {
  gameBoard.innerHTML = ""; /*Limpa o tabuleiro*/
  clickedCells = new Set();
  safeCells = boardSize * boardSize - 1; /*Celulas sem bomba*/
  message.textContent = "Clique nas células para encontrar os tesouros. Evite a bomba!";
  message.className = "text-primary";
  restartButton.classList.add("d-none");

  bombPosition = Math.floor(Math.random() * boardSize * boardSize);

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("square-cell", "border");
    cell.dataset.index = i;

    cell.addEventListener("click", () => checkCell(cell));

    gameBoard.appendChild(cell);
  }
}


// Função para verificar a célula clicada
function checkCell(cell) {
  const cellIndex = parseInt(cell.dataset.index, 10);

  if (clickedCells.has(cellIndex)) return;

  clickedCells.add(cellIndex);

  if (cellIndex === bombPosition) {
    cell.innerHTML = '<i class="bi bi-x-lg"></i>';
    cell.classList.add("bg-danger");
    message.textContent = "Você encontrou a bomba, passa o dinheiro!";
    message.className = "text-danger font-weight-bold";
    alert("Você encontrou a bomba! Jogo encerrado.");
    endGame(false);
  } else {
    cell.innerHTML = '<i class="bi bi-gem"></i>';
    cell.classList.add("bg-success");

    currentMoney += 0.2;
    playerInfo.textContent = `Jogador: ${playerName} | Dinheiro Atual: R$ ${currentMoney.toFixed(2)}`;

    if (clickedCells.size === safeCells) {
      message.textContent = "Parabéns! Você encontrou todos os diamantes!";
      message.className = "text-success font-weight-bold";
      alert("Parabéns! Você venceu!");
      endGame(true);
    }
  }
}

// Função para finalizar o jogo
function endGame(won) {
  const cells = document.querySelectorAll(".square-cell");
  cells.forEach(cell => cell.removeEventListener("click", () => checkCell(cell)));

  restartButton.classList.remove("d-none");

  if (won) {
    const bombCell = document.querySelector(`[data-index="${bombPosition}"]`);
    bombCell.innerHTML = '<i class="bi bi-x-lg"></i>';
    bombCell.classList.add("bg-danger");
  }
}

// Função para voltar à tela de configuração
function returnToSetup() {
  setupScreen.classList.remove("d-none");
  gameScreen.classList.add("d-none");
  document.getElementById("playerName").value = "";
  document.getElementById("playerMoney").value = "";
}

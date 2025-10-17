// === CONFIGURAÇÕES ===
const words = ["HTML", "CSS", "JS", "HOSPEDAGEM", "GITHUB", "PERFORMANCE"];
const gridSize = 12;

const gridElement = document.getElementById("grid");
const wordListElement = document.getElementById("wordList");
const message = document.getElementById("message");
const progressText = document.getElementById("progress");

let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
let selectedCells = [];
let foundWords = [];

// === LISTA DE PALAVRAS ===
words.forEach(word => {
  const li = document.createElement("li");
  li.textContent = word;
  li.id = "word-" + word;
  wordListElement.appendChild(li);
});

// === POSICIONAMENTO DE PALAVRAS ===
function placeWord(word) {
  const directions = ["H", "V"];
  let placed = false;

  while (!placed) {
    const dir = directions[Math.floor(Math.random() * 2)];
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);

    if (dir === "H" && col + word.length <= gridSize) {
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] && grid[row][col + i] !== word[i]) fits = false;
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
        placed = true;
      }
    } else if (dir === "V" && row + word.length <= gridSize) {
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] && grid[row + i][col] !== word[i]) fits = false;
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
        placed = true;
      }
    }
  }
}

words.forEach(placeWord);

// === COMPLETA COM LETRAS ALEATÓRIAS ===
for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    if (!grid[r][c]) {
      grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
}

// === MONTA GRADE ===
for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = grid[r][c];
    cell.dataset.row = r;
    cell.dataset.col = c;
    cell.addEventListener("click", () => handleCellClick(cell));
    gridElement.appendChild(cell);
  }
}

// === INTERAÇÃO ===
function handleCellClick(cell) {
  if (cell.classList.contains("found")) return;

  cell.classList.toggle("selected");
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const index = selectedCells.findIndex(c => c.row === row && c.col === col);

  if (index >= 0) {
    selectedCells.splice(index, 1);
  } else {
    selectedCells.push({ row, col, letter: grid[row][col] });
  }

  checkWord();
}

// === VERIFICA SE FORMOU UMA PALAVRA ===
function checkWord() {
  const letters = selectedCells.map(c => c.letter).join("");

  for (const word of words) {
    if (letters === word || letters.split("").reverse().join("") === word) {
      selectedCells.forEach(c => {
        const cell = document.querySelector(`[data-row='${c.row}'][data-col='${c.col}']`);
        cell.classList.remove("selected");
        cell.classList.add("found");
      });

      if (!foundWords.includes(word)) {
        foundWords.push(word);
        showMessage(`✅ Você encontrou: ${word}`);
        document.getElementById("word-" + word).classList.add("found");
        progressText.textContent = `${foundWords.length} / ${words.length} encontradas`;
      }

      selectedCells = [];
    }
  }
}

// === MENSAGEM ANIMADA ===
function showMessage(text) {
  message.textContent = text;
  message.classList.add("show");
  setTimeout(() => message.classList.remove("show"), 2000);
}

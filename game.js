// Core Game Engine
class RobotGame {
  constructor() {
    this.grid = [];
    this.robot = { x: 0, y: 0, direction: "east" };
    this.variables = {
      energy: 10,
      gems_collected: 0,
    };
    this.levelConfig = null;
    this.currentChallenge = null;
    this.functions = {};
    this.sequence = [];
  }

  initGrid(size = 5) {
    this.grid = [];
    for (let y = 0; y < size; y++) {
      this.grid[y] = [];
      for (let x = 0; x < size; x++) {
        this.grid[y][x] = {
          type: "empty",
          hasGem: false,
          hasFlag: false,
          isWall: false,
          isSafe: true,
          isDanger: false,
        };
      }
    }
  }

  setLevelConfig(config) {
    this.levelConfig = config;
    this.initGrid(5);
    this.variables.energy = config.startEnergy || 10;
    this.variables.gems_collected = 0;
    this.robot = {
      ...config.startPos,
      direction: config.startDirection || "east",
    };
    this.functions = {};
    this.sequence = [];

    if (config.elements) {
      config.elements.forEach((elem) => {
        if (elem.type === "gem") {
          this.grid[elem.y][elem.x].hasGem = true;
        } else if (elem.type === "flag") {
          this.grid[elem.y][elem.x].hasFlag = true;
        } else if (elem.type === "wall") {
          this.grid[elem.y][elem.x].isWall = true;
        } else if (elem.type === "safe") {
          this.grid[elem.y][elem.x].isSafe = true;
          this.grid[elem.y][elem.x].isDanger = false;
        } else if (elem.type === "danger") {
          this.grid[elem.y][elem.x].isDanger = true;
          this.grid[elem.y][elem.x].isSafe = false;
        }
      });
    }
  }

  move() {
    if (this.variables.energy <= 0) {
      throw new Error("No energy left!");
    }

    let newX = this.robot.x;
    let newY = this.robot.y;

    switch (this.robot.direction) {
      case "north":
        newY--;
        break;
      case "east":
        newX++;
        break;
      case "south":
        newY++;
        break;
      case "west":
        newX--;
        break;
    }

    if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) {
      throw new Error("Robot hit the wall!");
    }

    if (this.grid[newY][newX].isWall) {
      throw new Error("Robot hit a wall!");
    }

    this.robot.x = newX;
    this.robot.y = newY;
    this.variables.energy--;

    return true;
  }

  pickUp() {
    if (this.grid[this.robot.y][this.robot.x].hasGem) {
      this.grid[this.robot.y][this.robot.x].hasGem = false;
      this.variables.gems_collected++;
      return true;
    }
    return false;
  }

  gemAhead() {
    let checkX = this.robot.x;
    let checkY = this.robot.y;

    switch (this.robot.direction) {
      case "north":
        checkY--;
        break;
      case "east":
        checkX++;
        break;
      case "south":
        checkY++;
        break;
      case "west":
        checkX--;
        break;
    }

    if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
      return false;
    }

    return this.grid[checkY][checkX].hasGem;
  }

  pathClear() {
    let checkX = this.robot.x;
    let checkY = this.robot.y;

    switch (this.robot.direction) {
      case "north":
        checkY--;
        break;
      case "east":
        checkX++;
        break;
      case "south":
        checkY++;
        break;
      case "west":
        checkX--;
        break;
    }

    if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
      return false;
    }

    return !this.grid[checkY][checkX].isWall;
  }

  tileIsSafe() {
    return this.grid[this.robot.y][this.robot.x].isSafe;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  reset() {
    const savedFunctions = { ...this.functions };
    const savedSequence = [...this.sequence];

    this.setLevelConfig(this.levelConfig);

    this.functions = savedFunctions;
    this.sequence = savedSequence;

    this.updateDisplay();
  }

  checkGoal() {
    if (!this.levelConfig || !this.levelConfig.goal) return false;

    const goal = this.levelConfig.goal;

    if (goal.type === "reachFlag") {
      return this.grid[this.robot.y][this.robot.x].hasFlag;
    }

    if (goal.type === "collectGems") {
      return this.variables.gems_collected >= goal.count;
    }

    if (goal.type === "reachFlagSafely") {
      const currentTile = this.grid[this.robot.y][this.robot.x];
      if (currentTile.isDanger) {
        return false;
      }
      return (
        this.grid[this.robot.y][this.robot.x].hasFlag &&
        this.variables.energy > 0
      );
    }

    return false;
  }

  updateDisplay() {
    document.getElementById("energy-value").textContent = this.variables.energy;
    document.getElementById("gems-value").textContent =
      this.variables.gems_collected;
    this.renderGrid();
  }

  renderGrid() {
    const container = document.getElementById("grid-container");
    if (!container) return;

    container.innerHTML = "";

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const tile = document.createElement("div");
        tile.className = "tile";

        const cell = this.grid[y][x];

        if (cell.isSafe && !cell.isDanger) {
          tile.classList.add("safe");
        } else if (cell.isDanger) {
          tile.classList.add("danger");
        } else if (cell.isWall) {
          tile.classList.add("wall");
        }

        let content = "";

        if (this.robot.x === x && this.robot.y === y) {
          content += `<span class="robot ${this.robot.direction}">🤖</span>`;
        } else if (cell.hasGem) {
          content += '<span class="gem">💎</span>';
        }

        if (cell.hasFlag) {
          content += '<span class="flag">🚩</span>';
        }

        tile.innerHTML = content || "&nbsp;";
        container.appendChild(tile);
      }
    }
  }
}

const game = new RobotGame();

// UI Rendering Functions
function loadLevel(levelNum) {
  currentLevelNum = levelNum;
  currentChallengeNum = 0;

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.level) === levelNum) {
      btn.classList.add("active");
    }
  });

  const container = document.getElementById("game-container");
  container.innerHTML = "";

  if (levelNum === 1) {
    loadLevel1();
  } else if (levelNum === 2) {
    loadLevel2();
  } else if (levelNum === 3) {
    loadLevel3();
  }
}

function loadLevel1() {
  const container = document.getElementById("game-container");
  const challenge = level1Challenges[currentChallengeNum];

  game.setLevelConfig(challenge.config);
  game.currentChallenge = challenge;

  if (challenge.type === "function") {
    game.sequence = [];
  }

  container.innerHTML = `
    <div class="game-grid" id="grid-container"></div>
    <div class="controls-panel">
      <div class="challenge-title">${challenge.title}</div>
      <div class="challenge-description">${challenge.description}</div>
      ${renderLevel1Controls(challenge.type)}
      <div class="action-buttons">
        <button class="btn btn-secondary" onclick="resetChallenge()">Reset</button>
      </div>
      <div id="message"></div>
    </div>
  `;

  game.updateDisplay();

  if (challenge.type === "if") {
    selectedDirectionForIf = null;
  }
}

function renderLevel1Controls(type) {
  if (type === "variable") {
    return `
      <div class="control-group">
        <label>Use arrow buttons to move:</label>
        <div class="arrow-buttons">
          <button class="arrow-btn" onclick="moveRobot('up')" style="grid-column: 2; grid-row: 1;">↑</button>
          <button class="arrow-btn" onclick="moveRobot('left')" style="grid-column: 1; grid-row: 2;">←</button>
          <button class="arrow-btn" onclick="moveRobot('down')" style="grid-column: 2; grid-row: 2;">↓</button>
          <button class="arrow-btn" onclick="moveRobot('right')" style="grid-column: 3; grid-row: 2;">→</button>
        </div>
      </div>
    `;
  } else if (type === "loop") {
    return `
      <div class="control-group">
        <label>Repeat move+collect how many times?</label>
        <input type="number" id="loop-count" min="1" max="10" placeholder="Enter number" />
        <button class="btn btn-primary" onclick="executeLoop()" style="margin-top: 10px;">Run</button>
      </div>
    `;
  } else if (type === "if") {
    return `
      <div class="control-group">
        <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: #1565c0;">Choose Direction & IF:</div>
          <div id="next-tile-preview" style="margin-top: 10px; padding: 8px; background: white; border-radius: 4px; font-size: 0.9em; min-height: 40px;">
            <span id="tile-status-text">Choose a direction to see tile preview...</span>
          </div>
        </div>
        <label style="margin-bottom: 10px; display: block;">1. Choose direction:</label>
        <div class="arrow-buttons">
          <button class="arrow-btn" onclick="selectDirectionForIf('up')" id="dir-up" style="grid-column: 2; grid-row: 1;">↑</button>
          <button class="arrow-btn" onclick="selectDirectionForIf('left')" id="dir-left" style="grid-column: 1; grid-row: 2;">←</button>
          <button class="arrow-btn" onclick="selectDirectionForIf('down')" id="dir-down" style="grid-column: 2; grid-row: 2;">↓</button>
          <button class="arrow-btn" onclick="selectDirectionForIf('right')" id="dir-right" style="grid-column: 3; grid-row: 2;">→</button>
        </div>
        <div class="checkbox-group" style="margin: 15px 0;">
          <input type="checkbox" id="if-checkbox" />
          <label for="if-checkbox"><strong>2. Use IF condition</strong> (check if tile is green, uncheck if tile is red)</label>
        </div>
        <button class="btn btn-primary" onclick="moveRobotWithDirectionAndIf()" style="width: 100%; margin-bottom: 10px;">3. Move</button>
        <p style="margin-top: 10px; font-size: 0.9em; color: #666; line-height: 1.5;">
          <strong>Rules:</strong><br>
          • If tile is <span style="color: #4caf50; font-weight: 600;">green</span> → Check IF, then Move<br>
          • If tile is <span style="color: #f44336; font-weight: 600;">red</span> → Check IF (prevents moving), then Move<br>
          • Wrong choice = Challenge Failed!
        </p>
      </div>
    `;
  } else if (type === "function") {
    return `
      <div class="function-builder">
        <label>Build your sequence:</label>
        <div class="arrow-buttons">
          <button class="arrow-btn" onclick="addToSequence('up')" style="grid-column: 2; grid-row: 1;">↑</button>
          <button class="arrow-btn" onclick="addToSequence('left')" style="grid-column: 1; grid-row: 2;">←</button>
          <button class="arrow-btn" onclick="addToSequence('down')" style="grid-column: 2; grid-row: 2;">↓</button>
          <button class="arrow-btn" onclick="addToSequence('right')" style="grid-column: 3; grid-row: 2;">→</button>
        </div>
        <div class="sequence-display" id="sequence-display"></div>
        <button class="btn function-btn" onclick="saveFunction()">Save as patrol()</button>
        <div id="function-buttons"></div>
      </div>
    `;
  }
  return "";
}

function loadLevel2() {
  const container = document.getElementById("game-container");
  const puzzle = level2Puzzles[currentChallengeNum];

  game.setLevelConfig(puzzle.config);
  game.currentChallenge = puzzle;

  container.innerHTML = `
    <div class="game-grid" id="grid-container"></div>
    <div class="controls-panel">
      <div class="challenge-title">${puzzle.title}</div>
      <div class="challenge-description">${puzzle.description}</div>
      <div class="code-display" id="code-display">${renderCodeWithBlanks(
        puzzle
      )}</div>
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="executeLevel2()">Run</button>
        <button class="btn btn-secondary" onclick="game.reset(); game.updateDisplay()">Reset</button>
      </div>
      <div id="message"></div>
    </div>
  `;

  game.updateDisplay();
}

function renderCodeWithBlanks(puzzle) {
  let code = puzzle.code;
  puzzle.blanks.forEach((blank, index) => {
    const placeholder = blank.type === "dropdown" ? "_______" : "___";
    if (blank.type === "dropdown") {
      code = code.replace(
        placeholder,
        `<select id="blank-${index}" class="dropdown-blank">
          <option value="" selected disabled>Select</option>
          ${blank.options
            .map((opt) => `<option value="${opt}">${opt}</option>`)
            .join("")}
        </select>`
      );
    } else {
      code = code.replace(
        placeholder,
        `<input type="number" id="blank-${index}" class="dropdown-blank" min="1" max="10" placeholder="Enter number" />`
      );
    }
  });
  return code;
}

function loadLevel3() {
  const container = document.getElementById("game-container");
  const challenge = level3Challenges[currentChallengeNum];

  game.setLevelConfig(challenge.config);
  game.currentChallenge = challenge;

  container.innerHTML = `
    <div class="game-grid" id="grid-container"></div>
    <div class="controls-panel">
      <div style="background: #e8f5e9; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #4caf50;">
        <div style="font-weight: 600; margin-bottom: 8px; color: #2e7d32;">Available Functions:</div>
        <div style="font-family: 'Courier New', monospace; font-size: 0.9em; color: #1b5e20;">
          <strong>Actions:</strong> move(), pickUp(), turnLeft(), turnRight()<br>
          <strong>Conditions:</strong> gemAhead(), pathClear(), tileIsSafe()<br>
          <strong>Control:</strong> repeat(n) { }, if(condition) { }, while(condition) { }
        </div>
      </div>
      <div class="challenge-title">${challenge.title}</div>
      <div class="challenge-description">${challenge.description}</div>
      <div class="control-group">
        <label>Write your code (max 5 lines):</label>
        <textarea id="code-input" class="code-input" placeholder="Type your code here..."></textarea>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="executeLevel3()">Run</button>
        <button class="btn hint-btn" onclick="toggleHint()">Hint</button>
        <button class="btn btn-secondary" onclick="game.reset(); game.updateDisplay()">Reset</button>
      </div>
      <div class="hint-box" id="hint-box">${challenge.hint}</div>
      <div id="message"></div>
    </div>
  `;

  game.updateDisplay();
}

// Level 1 Functions
function resetChallenge() {
  game.reset();
  game.updateDisplay();

  if (game.currentChallenge && game.currentChallenge.type === "function") {
    game.sequence = [];
    const sequenceDisplay = document.getElementById("sequence-display");
    if (sequenceDisplay) {
      sequenceDisplay.innerHTML = "";
    }
    const funcButtons = document.getElementById("function-buttons");
    if (funcButtons) {
      funcButtons.innerHTML = "";
    }
  }

  if (game.currentChallenge && game.currentChallenge.type === "if") {
    updateNextTilePreview();
  }
}

function moveRobot(direction) {
  try {
    if (direction === "up") {
      game.robot.direction = "north";
      game.move();
    } else if (direction === "down") {
      game.robot.direction = "south";
      game.move();
    } else if (direction === "left") {
      game.robot.direction = "west";
      game.move();
    } else if (direction === "right") {
      game.robot.direction = "east";
      game.move();
    }
    game.updateDisplay();
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function executeLoop() {
  const countInput = document.getElementById("loop-count").value;
  if (!countInput || countInput === "") {
    showMessage("Please enter a number!", "error");
    return;
  }
  const count = parseInt(countInput);
  if (isNaN(count) || count < 1) {
    showMessage("Please enter a valid number (1-10)!", "error");
    return;
  }

  game.reset();

  try {
    for (let i = 0; i < count; i++) {
      game.pickUp();
      game.move();
      game.updateDisplay();
      await game.delay(400);
    }
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

let selectedDirectionForIf = null;

function selectDirectionForIf(direction) {
  selectedDirectionForIf = direction;

  ["up", "down", "left", "right"].forEach((dir) => {
    const btn = document.getElementById(`dir-${dir}`);
    if (btn) {
      btn.style.opacity = dir === direction ? "1" : "0.5";
      btn.style.transform = dir === direction ? "scale(1.1)" : "scale(1)";
    }
  });

  updateTilePreviewForDirection(direction);
}

function updateTilePreviewForDirection(direction) {
  const previewDiv = document.getElementById("next-tile-preview");
  const statusText = document.getElementById("tile-status-text");

  if (!previewDiv || !statusText) return;

  let checkX = game.robot.x;
  let checkY = game.robot.y;
  let dirName = "";

  switch (direction) {
    case "up":
      checkY--;
      dirName = "North (↑)";
      break;
    case "down":
      checkY++;
      dirName = "South (↓)";
      break;
    case "left":
      checkX--;
      dirName = "West (←)";
      break;
    case "right":
      checkX++;
      dirName = "East (→)";
      break;
  }

  if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
    statusText.innerHTML = `<span style="color: #666;">Cannot move ${dirName} - out of bounds!</span>`;
    previewDiv.style.background = "#f5f5f5";
    previewDiv.style.border = "2px solid #ccc";
    return;
  }

  const nextTile = game.grid[checkY][checkX];
  const isSafe = nextTile && nextTile.isSafe;

  if (isSafe) {
    statusText.innerHTML = `<span style="color: #4caf50; font-weight: 600;">✓ Tile ${dirName} is GREEN (safe)</span>`;
    previewDiv.style.background = "#c8e6c9";
    previewDiv.style.border = "2px solid #4caf50";
  } else {
    statusText.innerHTML = `<span style="color: #f44336; font-weight: 600;">✗ Tile ${dirName} is RED (danger)</span>`;
    previewDiv.style.background = "#ffcdd2";
    previewDiv.style.border = "2px solid #f44336";
  }
}

function moveRobotWithDirectionAndIf() {
  if (!selectedDirectionForIf) {
    showMessage("Please select a direction first!", "error");
    return;
  }

  const checkbox = document.getElementById("if-checkbox");
  if (!checkbox) {
    showMessage("Error: IF checkbox not found", "error");
    return;
  }

  const ifEnabled = checkbox.checked;
  const direction = selectedDirectionForIf;

  switch (direction) {
    case "up":
      game.robot.direction = "north";
      break;
    case "down":
      game.robot.direction = "south";
      break;
    case "left":
      game.robot.direction = "west";
      break;
    case "right":
      game.robot.direction = "east";
      break;
  }

  let checkX = game.robot.x;
  let checkY = game.robot.y;

  switch (direction) {
    case "up":
      checkY--;
      break;
    case "down":
      checkY++;
      break;
    case "left":
      checkX--;
      break;
    case "right":
      checkX++;
      break;
  }

  if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
    showMessage("❌ Challenge Failed! Cannot move out of bounds.", "error");
    return;
  }

  const nextTile = game.grid[checkY][checkX];
  if (!nextTile) {
    showMessage("Error: Invalid tile position!", "error");
    return;
  }

  const isSafe = nextTile.isSafe;
  let choiceIsCorrect = false;

  if (isSafe) {
    if (ifEnabled) {
      choiceIsCorrect = true;
    } else {
      choiceIsCorrect = false;
    }
  } else {
    if (ifEnabled) {
      choiceIsCorrect = true;
    } else {
      choiceIsCorrect = false;
    }
  }

  if (!choiceIsCorrect) {
    if (isSafe) {
      showMessage(
        "❌ Challenge Failed! Wrong choice. When tile is GREEN, you should CHECK IF. Try again!",
        "error"
      );
    } else {
      try {
        game.move();
        showMessage(
          "❌ Challenge Failed! Wrong choice. When tile is RED, you should CHECK IF to prevent moving into danger. Robot stepped on danger tile!",
          "error"
        );
      } catch (error) {
        showMessage(
          "❌ Challenge Failed! Wrong choice. When tile is RED, you should CHECK IF to prevent moving into danger.",
          "error"
        );
      }
    }
    game.updateDisplay();
    return;
  }

  try {
    if (isSafe) {
      game.move();
      showMessage(
        "✓ Correct! IF condition passed. Robot moved safely.",
        "success"
      );
    } else {
      showMessage(
        "✓ Correct! IF condition prevented moving into danger. Robot is safe.",
        "success"
      );
    }

    game.updateDisplay();
    selectedDirectionForIf = null;
    ["up", "down", "left", "right"].forEach((dir) => {
      const btn = document.getElementById(`dir-${dir}`);
      if (btn) {
        btn.style.opacity = "1";
        btn.style.transform = "scale(1)";
      }
    });
    document.getElementById("tile-status-text").innerHTML =
      "Choose a direction to see tile preview...";
    checkGoal();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

function addToSequence(direction) {
  game.sequence.push(direction);
  updateSequenceDisplay();
}

function updateSequenceDisplay() {
  const display = document.getElementById("sequence-display");
  const icons = { up: "↑", down: "↓", left: "←", right: "→" };
  display.innerHTML = game.sequence
    .map((dir) => `<span class="sequence-item">${icons[dir]}</span>`)
    .join("");
}

function saveFunction() {
  if (game.sequence.length === 0) {
    showMessage("Please create a sequence first!", "error");
    return;
  }

  game.functions.patrol = [...game.sequence];
  const funcButtons = document.getElementById("function-buttons");
  funcButtons.innerHTML =
    '<button class="btn function-btn" onclick="executePatrol()">Execute patrol()</button>';
  showMessage("Function saved! Click patrol() to execute it.", "success");
}

async function executePatrol() {
  if (!game.functions.patrol || !Array.isArray(game.functions.patrol)) {
    showMessage(
      "No patrol function saved. Please create a sequence first!",
      "error"
    );
    return;
  }

  game.reset();

  try {
    for (const dir of game.functions.patrol) {
      if (dir === "up") {
        game.robot.direction = "north";
      } else if (dir === "down") {
        game.robot.direction = "south";
      } else if (dir === "left") {
        game.robot.direction = "west";
      } else if (dir === "right") {
        game.robot.direction = "east";
      }
      game.move();
      game.updateDisplay();
      await game.delay(400);
    }
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Level 2 Functions
async function executeLevel2() {
  const puzzle = level2Puzzles[currentChallengeNum];
  game.reset();

  const answers = [];
  for (let index = 0; index < puzzle.blanks.length; index++) {
    const blank = puzzle.blanks[index];
    const element = document.getElementById(`blank-${index}`);
    if (blank.type === "dropdown") {
      const value = element.value;
      if (!value || value === "") {
        showMessage("Please select an option from the dropdown!", "error");
        return;
      }
      answers.push(value);
    } else {
      const value = element.value;
      if (!value || value === "") {
        showMessage("Please enter a number!", "error");
        return;
      }
      answers.push(parseInt(value));
    }
  }

  let allCorrect = true;
  puzzle.blanks.forEach((blank, index) => {
    if (blank.type === "dropdown" && answers[index] !== blank.answer) {
      allCorrect = false;
    } else if (blank.type === "number" && answers[index] !== blank.answer) {
      allCorrect = false;
    }
  });

  if (!allCorrect) {
    showMessage("Incorrect answer! Try again.", "error");
    return;
  }

  try {
    let code = puzzle.code;
    puzzle.blanks.forEach((blank, index) => {
      const placeholder = blank.type === "dropdown" ? "_______" : "___";
      code = code.replace(placeholder, answers[index]);
    });

    if (code.includes("repeat")) {
      const match = code.match(/repeat\s*\(\s*(\d+)\s*\)/);
      if (match) {
        const count = parseInt(match[1]);
        for (let i = 0; i < count; i++) {
          game.move();
          game.pickUp();
          game.updateDisplay();
          await game.delay(400);
        }
      }
    } else if (code.includes("if")) {
      const match = code.match(/if\s*\(\s*(\w+)\s*\(\s*\)\s*\)/);
      if (match) {
        const condition = match[1];
        if (condition === "gemAhead" && game.gemAhead()) {
          game.move();
          game.pickUp();
        }
      }
    } else if (code.includes("while")) {
      game.variables.energy = 10;
      game.robot.direction = "east";

      while (game.variables.energy > 0 && game.robot.x < 4) {
        game.move();
        game.updateDisplay();
        await game.delay(400);
      }

      if (game.variables.energy > 0) {
        game.robot.direction = "north";
        while (game.variables.energy > 0 && game.robot.y > 0) {
          game.move();
          game.updateDisplay();
          await game.delay(400);
          if (game.checkGoal()) {
            break;
          }
        }
      }
    }

    game.updateDisplay();
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// Level 3 Functions
async function executeLevel3() {
  const challenge = level3Challenges[currentChallengeNum];
  const codeInput = document.getElementById("code-input").value;

  if (!codeInput.trim()) {
    showMessage("Please write some code!", "error");
    return;
  }

  game.reset();

  try {
    // remove newlines and extra spaces to allow multi-line input
    let code = codeInput.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

    while (code.length > 0) {
      let matchFound = false;

      // Check repeat()
      const repeatRegex = /^repeat\s*\(\s*(\d+)\s*\)\s*\{\s*(.+?)\s*\}/;
      let match = code.match(repeatRegex);
      if (match) {
        const count = parseInt(match[1]);
        const body = match[2];
        for (let i = 0; i < count; i++) {
          await executeBlock(body);
        }
        code = code.substring(match[0].length).trim();
        matchFound = true;
        continue;
      }

      // Check IF: if()
      const ifRegex = /^if\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/;
      match = code.match(ifRegex);
      if (match) {
        const condition = match[1];
        const body = match[2];
        let conditionMet = false;
        if (condition === "gemAhead" && game.gemAhead()) conditionMet = true;
        if (condition === "pathClear" && game.pathClear()) conditionMet = true;

        if (conditionMet) {
          await executeBlock(body);
        }
        code = code.substring(match[0].length).trim();
        matchFound = true;
        continue;
      }

      // Check while()
      const whileRegex = /^while\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/;
      match = code.match(whileRegex);
      if (match) {
        const condition = match[1];
        const body = match[2];

        let safety = 0;
        while (safety < 20) {
          let conditionMet = false;
          if (condition === "pathClear" && game.pathClear())
            conditionMet = true;
          if (condition === "gemAhead" && game.gemAhead()) conditionMet = true;

          if (!conditionMet) break;

          await executeBlock(body);
          safety++;
        }

        code = code.substring(match[0].length).trim();
        matchFound = true;
        continue;
      }

      // other
      const funcRegex = /^(move|pickUp|turnLeft|turnRight)\s*\(\s*\)/;
      match = code.match(funcRegex);
      if (match) {
        const action = match[1];
        if (action === "move") game.move();
        if (action === "pickUp") game.pickUp();
        if (action === "turnLeft") game.robot.direction = "west"; // Simple turn logic for this grid

        game.updateDisplay();
        await game.delay(300);

        code = code.substring(match[0].length).trim();
        if (code.startsWith(";")) code = code.substring(1).trim();
        matchFound = true;
        continue;
      }

      if (!matchFound) {
        code = code.substring(1).trim();
      }
    }

    game.updateDisplay();

    // validation
    if (
      challenge.requiresGemCollection &&
      game.variables.gems_collected === 0
    ) {
      showMessage(
        "❌ You must collect the gem! Use if(gemAhead()) to pick it up.",
        "error"
      );
      return;
    }

    checkGoal();
  } catch (error) {
    showMessage("Error: " + error.message, "error");
  }
}

async function executeBlock(bodyString) {
  const commands = bodyString
    .split(/[;]+/)
    .map((c) => c.trim())
    .filter((c) => c);

  for (const cmd of commands) {
    if (cmd === "move()" || cmd === "move") {
      game.move();
    } else if (cmd === "pickUp()" || cmd === "pickUp") {
      game.pickUp();
    }
    game.updateDisplay();
    await game.delay(300);
  }
}

function toggleHint() {
  const hintBox = document.getElementById("hint-box");
  hintBox.classList.toggle("show");
}

function checkGoal() {
  if (game.checkGoal()) {
    showMessage("🎉 Success! Goal achieved!", "success");
    setTimeout(() => {
      nextChallenge();
    }, 2000);
  }
}

function nextChallenge() {
  if (
    currentLevelNum === 1 &&
    currentChallengeNum < level1Challenges.length - 1
  ) {
    currentChallengeNum++;
    loadLevel1();
  } else if (
    currentLevelNum === 2 &&
    currentChallengeNum < level2Puzzles.length - 1
  ) {
    currentChallengeNum++;
    loadLevel2();
  } else if (
    currentLevelNum === 3 &&
    currentChallengeNum < level3Challenges.length - 1
  ) {
    currentChallengeNum++;
    loadLevel3();
  } else {
    if (currentLevelNum === 3) {
      showCompletionOverlay();
    } else {
      showMessage(
        "🎉 Great job! You completed this level. Select the next level to continue.",
        "success"
      );
    }
  }
}

function showMessage(text, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  setTimeout(() => {
    messageDiv.textContent = "";
    messageDiv.className = "message";
  }, 5000);
}

function showCompletionOverlay() {
  const completionOverlay = document.getElementById("completion-overlay");
  if (completionOverlay) {
    completionOverlay.classList.add("active");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const completionOverlay = document.getElementById("completion-overlay");
  const startBtn = document.getElementById("start-game-btn");
  const restartBtn = document.getElementById("restart-game-btn");

  const startGame = () => {
    if (introOverlay) introOverlay.classList.remove("active");
    currentLevelNum = 1;
    currentChallengeNum = 0;
    loadLevel(1);
  };

  const resetToStart = () => {
    currentLevelNum = 1;
    currentChallengeNum = 0;
    if (completionOverlay) completionOverlay.classList.remove("active");
    loadLevel(1);
  };

  if (startBtn) startBtn.addEventListener("click", startGame);
  if (restartBtn) restartBtn.addEventListener("click", resetToStart);

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      loadLevel(parseInt(btn.dataset.level));
    });
  });

  if (introOverlay) {
    introOverlay.classList.add("active");
  }
});

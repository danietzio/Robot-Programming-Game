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
      throw new Error("Robot hit the boundary!");
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

    if (checkX >= 0 && checkX < 5 && checkY >= 0 && checkY < 5) {
      if (this.grid[checkY][checkX].hasGem) {
        this.grid[checkY][checkX].hasGem = false;
        this.variables.gems_collected++;
        return true;
      }
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

    if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) return false;
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

    if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) return false;
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
    const eVal = document.getElementById("energy-value");
    const gVal = document.getElementById("gems-value");
    if (eVal) eVal.textContent = this.variables.energy;
    if (gVal) gVal.textContent = this.variables.gems_collected;
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

// --- UI Rendering Functions ---

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

  let resetButtonHTML = `<button class="btn btn-secondary" onclick="resetChallenge()">Reset</button>`;
  if (challenge.type === "loop") resetButtonHTML = "";

  container.innerHTML = `
    <div class="game-grid" id="grid-container"></div>
    <div class="controls-panel">
      <div class="challenge-title">${challenge.title}</div>
      <div class="challenge-description">${challenge.description}</div>
      ${renderLevel1Controls(challenge.type)}
      <div class="action-buttons">
        ${resetButtonHTML}
      </div>
      <div id="message"></div>
    </div>
  `;

  game.updateDisplay();
}

function renderLevel1Controls(type) {
  if (type === "variable") {
    return `
      <div class="control-group">
        <label>Tap arrows or use Keyboard to move:</label>
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
          <div style="font-weight: 600; margin-bottom: 8px; color: #1565c0;">Safety Mode (IF Check)</div>
          <div class="checkbox-group">
            <input type="checkbox" id="safety-mode-toggle" />
            <label for="safety-mode-toggle" style="cursor:pointer">
              <strong>ON: Check if Safe</strong> <br>
              <span style="font-weight:normal; font-size:0.85em">If ON: Robot stops at Danger.<br>If OFF: Robot walks into Danger.</span>
            </label>
          </div>
        </div>
        
        <label style="margin-bottom: 10px; display: block;">Select direction to move:</label>
        <div class="arrow-buttons">
          <button class="arrow-btn" onclick="moveWithSafety('up')" style="grid-column: 2; grid-row: 1;">↑</button>
          <button class="arrow-btn" onclick="moveWithSafety('left')" style="grid-column: 1; grid-row: 2;">←</button>
          <button class="arrow-btn" onclick="moveWithSafety('down')" style="grid-column: 2; grid-row: 2;">↓</button>
          <button class="arrow-btn" onclick="moveWithSafety('right')" style="grid-column: 3; grid-row: 2;">→</button>
        </div>
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

  let resetButtonHTML = `<button class="btn btn-secondary" onclick="game.reset(); game.updateDisplay()">Reset</button>`;
  if (currentChallengeNum === 0 || currentChallengeNum === 1) {
    resetButtonHTML = "";
  }

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
        ${resetButtonHTML}
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
        `<input type="number" id="blank-${index}" class="dropdown-blank" min="1" max="10" placeholder="#" />`
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
        <div style="font-weight: 600; margin-bottom: 8px; color: #2e7d32;">Available Commands:</div>
        <div style="font-family: 'Courier New', monospace; font-size: 0.85em; color: #1b5e20;">
          move() &nbsp; pickUp() &nbsp; repeat(n){ } <br>
          if(condition){ } &nbsp; while(condition){ }
        </div>
      </div>
      <div class="challenge-title">${challenge.title}</div>
      <div class="challenge-description">${challenge.description}</div>
      <div class="control-group">
        <label>Write your code:</label>
        <textarea id="code-input" class="code-input" placeholder="move() \npickUp()"></textarea>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="executeLevel3()">Run Code</button>
        <button class="btn hint-btn" onclick="toggleHint()">Hint</button>
        <button class="btn btn-secondary" onclick="resetChallenge()">Reset</button>
      </div>
      <div class="hint-box" id="hint-box">${challenge.hint}</div>
      <div id="message"></div>
    </div>
  `;

  game.updateDisplay();
}

function resetChallenge() {
  game.reset();
  game.updateDisplay();

  if (game.currentChallenge && game.currentChallenge.type === "function") {
    game.sequence = [];
    const sequenceDisplay = document.getElementById("sequence-display");
    if (sequenceDisplay) sequenceDisplay.innerHTML = "";
    const funcButtons = document.getElementById("function-buttons");
    if (funcButtons) funcButtons.innerHTML = "";
  }

  const codeInput = document.getElementById("code-input");
  if (codeInput) codeInput.value = "";
}

function moveRobot(direction) {
  try {
    if (direction === "up") game.robot.direction = "north";
    if (direction === "down") game.robot.direction = "south";
    if (direction === "left") game.robot.direction = "west";
    if (direction === "right") game.robot.direction = "east";

    game.move();
    game.updateDisplay();
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
    setTimeout(() => {
      resetChallenge();
      showMessage("Resetting...", "error");
    }, 1000);
  }
}

function moveWithSafety(direction) {
  const safetyToggle = document.getElementById("safety-mode-toggle");
  const isSafetyOn = safetyToggle ? safetyToggle.checked : false;

  if (direction === "up") game.robot.direction = "north";
  if (direction === "down") game.robot.direction = "south";
  if (direction === "left") game.robot.direction = "west";
  if (direction === "right") game.robot.direction = "east";

  let checkX = game.robot.x;
  let checkY = game.robot.y;
  if (direction === "up") checkY--;
  if (direction === "down") checkY++;
  if (direction === "left") checkX--;
  if (direction === "right") checkX++;

  if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
    showMessage("Cannot move there (Wall/Boundary)", "error");
    setTimeout(() => resetChallenge(), 1000);
    return;
  }

  const nextTile = game.grid[checkY][checkX];

  if (isSafetyOn) {
    if (nextTile.isDanger) {
      showMessage(
        "⚠️ Safety System Active: Danger detected! Robot refused to move.",
        "success"
      );
      game.updateDisplay();
      return;
    } else {
      try {
        game.move();
        showMessage("Safety System Active: Path clear. Moving.", "success");
      } catch (e) {
        showMessage(e.message, "error");
        setTimeout(resetChallenge, 1000);
      }
    }
  } else {
    if (nextTile.isDanger) {
      try {
        game.move();
        game.updateDisplay();
        showMessage(
          "❌ CRITICAL: Safety was OFF! Robot stepped on danger.",
          "error"
        );
        setTimeout(() => resetChallenge(), 1000);
      } catch (e) {
        showMessage(e.message, "error");
        setTimeout(resetChallenge, 1000);
      }
    } else {
      try {
        game.move();
      } catch (e) {
        showMessage(e.message, "error");
        setTimeout(resetChallenge, 1000);
      }
    }
  }

  game.updateDisplay();
  checkGoal();
}

async function executeLoop() {
  const countInput = document.getElementById("loop-count").value;
  if (!countInput) {
    showMessage("Enter a number!", "error");
    return;
  }

  const count = parseInt(countInput);
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
    setTimeout(resetChallenge, 1000);
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
    showMessage("Sequence is empty!", "error");
    return;
  }
  game.functions.patrol = [...game.sequence];
  const funcButtons = document.getElementById("function-buttons");
  funcButtons.innerHTML =
    '<button class="btn function-btn" onclick="executePatrol()">Execute patrol()</button>';
  showMessage("Function saved!", "success");
}

async function executePatrol() {
  if (!game.functions.patrol) return;
  game.reset();
  try {
    for (const dir of game.functions.patrol) {
      if (dir === "up") game.robot.direction = "north";
      else if (dir === "down") game.robot.direction = "south";
      else if (dir === "left") game.robot.direction = "west";
      else if (dir === "right") game.robot.direction = "east";

      game.move();
      game.updateDisplay();
      await game.delay(400);
    }
    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
    setTimeout(resetChallenge, 1000);
  }
}

async function executeLevel2() {
  const puzzle = level2Puzzles[currentChallengeNum];
  game.reset();

  const answers = [];
  for (let index = 0; index < puzzle.blanks.length; index++) {
    const element = document.getElementById(`blank-${index}`);
    if (!element.value) {
      showMessage("Please fill in all blanks.", "error");
      return;
    }
    answers.push(
      puzzle.blanks[index].type === "number"
        ? parseInt(element.value)
        : element.value
    );
  }

  let allCorrect = true;
  puzzle.blanks.forEach((blank, index) => {
    if (answers[index] !== blank.answer) allCorrect = false;
  });

  if (!allCorrect) {
    showMessage("Incorrect parameters/keywords. Try again!", "error");
    return;
  }

  try {
    const title = puzzle.title;

    let keyword = "";
    if (puzzle.blanks[0].type === "dropdown") {
      keyword = answers[0];
    } else {
      if (puzzle.code.includes("repeat")) keyword = "repeat";
      else if (puzzle.code.includes("if")) keyword = "if";
      else if (puzzle.code.includes("while")) keyword = "while";
    }

    if (keyword === "repeat") {
      const count =
        typeof answers[0] === "number" ? answers[0] : answers[1] || 3;

      for (let i = 0; i < count; i++) {
        game.move();
        if (puzzle.title.includes("Loop Count")) game.pickUp();
        game.updateDisplay();
        await game.delay(400);
      }
    } else if (keyword === "if") {
      if (game.gemAhead()) {
        await game.delay(200);
        game.move();
        game.updateDisplay();
        await game.delay(400);
        game.pickUp();
        game.updateDisplay();
        await game.delay(400);
      }
    } else if (keyword === "while") {
      while (game.variables.energy > 0 && game.robot.x < 4) {
        game.move();
        game.updateDisplay();
        await game.delay(300);
      }
      game.robot.direction = "north";
      while (game.variables.energy > 0 && game.robot.y > 0) {
        game.move();
        game.updateDisplay();
        await game.delay(300);
      }
    }

    checkGoal();
  } catch (error) {
    showMessage(error.message, "error");
    setTimeout(() => game.reset(), 1000);
  }
}

async function executeLevel3() {
  const challenge = level3Challenges[currentChallengeNum];
  const codeInput = document.getElementById("code-input").value;

  if (!codeInput.trim()) {
    showMessage("Write some code first!", "error");
    return;
  }

  const explicitMoveCount = (codeInput.match(/move\s*\(\s*\)/g) || []).length;

  if (
    currentChallengeNum === 0 &&
    !codeInput.includes("repeat") &&
    explicitMoveCount > 2
  ) {
    showMessage(
      "Please use repeat() instead of typing move() many times.",
      "error"
    );
    setTimeout(() => resetChallenge(), 2000);
    return;
  }

  if (currentChallengeNum === 2 && !codeInput.includes("while")) {
    if (explicitMoveCount > 2) {
      showMessage(
        "I see you trying to cheat! 😉 Please use a while() loop... (Move forward as long as path is clear)",
        "error"
      );
    } else {
      showMessage(
        "❌ Task failed: You must use a 'while()' loop to solve this level.",
        "error"
      );
    }
    setTimeout(() => resetChallenge(), 2000);
    return;
  }

  if (currentChallengeNum === 1 && !codeInput.includes("if(gemAhead")) {
    showMessage(
      "❌ Task failed: You must use logic 'if(gemAhead())' to solve this!",
      "error"
    );
    return;
  }

  game.reset();

  try {
    let code = codeInput.replace(/\n/g, " ").trim();

    while (code.length > 0) {
      code = code.trim();
      let matchFound = false;

      let match = code.match(/^repeat\s*\(\s*(\d+)\s*\)\s*\{/);
      if (match) {
        const count = parseInt(match[1]);
        const blockEnd = findClosingBrace(code, match[0].length);
        if (blockEnd === -1) throw new Error("Missing closing brace }");

        const body = code.substring(match[0].length, blockEnd);
        for (let i = 0; i < count; i++) {
          await executeBlock(body);
        }
        code = code.substring(blockEnd + 1);
        matchFound = true;
        continue;
      }

      match = code.match(/^if\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{/);
      if (match) {
        const condition = match[1];
        const blockEnd = findClosingBrace(code, match[0].length);
        if (blockEnd === -1) throw new Error("Missing closing brace }");

        const body = code.substring(match[0].length, blockEnd);
        let conditionMet = false;
        if (condition === "gemAhead" && game.gemAhead()) conditionMet = true;
        if (condition === "pathClear" && game.pathClear()) conditionMet = true;

        if (conditionMet) await executeBlock(body);

        code = code.substring(blockEnd + 1);
        matchFound = true;
        continue;
      }

      match = code.match(/^while\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{/);
      if (match) {
        const condition = match[1];
        const blockEnd = findClosingBrace(code, match[0].length);
        if (blockEnd === -1) throw new Error("Missing closing brace }");

        const body = code.substring(match[0].length, blockEnd);
        let loops = 0;
        while (loops < 20) {
          let conditionMet = false;
          if (condition === "pathClear" && game.pathClear())
            conditionMet = true;
          if (condition === "gemAhead" && game.gemAhead()) conditionMet = true;
          if (!conditionMet) break;

          await executeBlock(body);
          loops++;
        }
        code = code.substring(blockEnd + 1);
        matchFound = true;
        continue;
      }

      match = code.match(/^(move|pickUp|turnLeft|turnRight)\s*\(\s*\);?/);
      if (match) {
        const action = match[1];
        await performAction(action);
        code = code.substring(match[0].length);
        matchFound = true;
        continue;
      }

      if (!matchFound) {
        code = code.substring(1);
      }
    }

    if (
      challenge.requiresGemCollection &&
      game.variables.gems_collected === 0
    ) {
      showMessage("❌ Task failed: You forgot to pickUp() the gem!", "error");
      setTimeout(() => game.reset(), 1000);
    } else {
      checkGoal();
    }
  } catch (error) {
    showMessage("Error: " + error.message, "error");
    setTimeout(() => {
      game.reset();
      game.updateDisplay();
    }, 1000);
  }
}

function findClosingBrace(str, startIndex) {
  let depth = 1;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === "{") depth++;
    if (str[i] === "}") depth--;
    if (depth === 0) return i;
  }
  return -1;
}

async function executeBlock(bodyString) {
  const commandRegex = /(move|pickUp|turnLeft|turnRight)\s*\(\s*\)/g;
  let match;
  while ((match = commandRegex.exec(bodyString)) !== null) {
    await performAction(match[1]);
  }
}

async function performAction(action) {
  if (action === "move") game.move();
  if (action === "pickUp") game.pickUp();
  if (action === "turnLeft") game.robot.direction = "west";
  if (action === "turnRight") game.robot.direction = "east";

  game.updateDisplay();
  await game.delay(300);
}

function toggleHint() {
  document.getElementById("hint-box").classList.toggle("show");
}

function checkGoal() {
  if (game.checkGoal()) {
    showMessage("🎉 Success! Goal achieved!", "success");
    setTimeout(nextChallenge, 2000);
  }
}

function nextChallenge() {
  if (currentLevelNum === 1) {
    if (currentChallengeNum < level1Challenges.length - 1) {
      currentChallengeNum++;
      loadLevel1();
    } else {
      showMessage("Level 1 Complete! Moving to Level 2...", "success");
      setTimeout(() => loadLevel(2), 1500);
    }
  } else if (currentLevelNum === 2) {
    if (currentChallengeNum < level2Puzzles.length - 1) {
      currentChallengeNum++;
      loadLevel2();
    } else {
      showMessage("Level 2 Complete! Moving to Level 3...", "success");
      setTimeout(() => loadLevel(3), 1500);
    }
  } else if (currentLevelNum === 3) {
    if (currentChallengeNum < level3Challenges.length - 1) {
      currentChallengeNum++;
      loadLevel3();
    } else {
      showCompletionOverlay();
    }
  }
}

function showMessage(text, type) {
  const div = document.getElementById("message");
  div.className = `message ${type}`;
  div.textContent = text;
}

function showCompletionOverlay() {
  document.getElementById("completion-overlay").classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const completionOverlay = document.getElementById("completion-overlay");

  document.getElementById("start-game-btn").addEventListener("click", () => {
    introOverlay.classList.remove("active");
    loadLevel(1);
  });

  document.getElementById("restart-game-btn").addEventListener("click", () => {
    completionOverlay.classList.remove("active");
    loadLevel(1);
  });

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => loadLevel(parseInt(btn.dataset.level)));
  });

  document.addEventListener("keydown", (e) => {
    if (currentLevelNum === 1) {
      const challengeType = game.currentChallenge
        ? game.currentChallenge.type
        : "";

      let dir = "";
      if (e.key === "ArrowUp") dir = "up";
      else if (e.key === "ArrowDown") dir = "down";
      else if (e.key === "ArrowLeft") dir = "left";
      else if (e.key === "ArrowRight") dir = "right";

      if (dir) {
        e.preventDefault();
        if (challengeType === "variable") moveRobot(dir);
        if (challengeType === "if") moveWithSafety(dir);
        if (challengeType === "function") addToSequence(dir);
      }
    }
  });

  if (introOverlay) introOverlay.classList.add("active");
});

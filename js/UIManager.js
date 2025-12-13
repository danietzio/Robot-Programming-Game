export class UIManager {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.gridContainer = document.getElementById("grid-container");
    this.energyVal = document.getElementById("energy-value");
    this.gemsVal = document.getElementById("gems-value");
    this.messageDiv = document.getElementById("message");
    this.container = document.getElementById("game-container");
  }

  updateDisplay() {
    if (this.energyVal) this.energyVal.textContent = this.game.variables.energy;
    if (this.gemsVal)
      this.gemsVal.textContent = this.game.variables.gems_collected;
    this.renderGrid();
  }

  renderGrid() {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = "";

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        const cell = this.game.grid[y][x];

        if (cell.isSafe && !cell.isDanger) tile.classList.add("safe");
        else if (cell.isDanger) tile.classList.add("danger");
        else if (cell.isWall) tile.classList.add("wall");

        let content = "";
        if (this.game.robot.x === x && this.game.robot.y === y) {
          content += `<span class="robot ${this.game.robot.direction}">🤖</span>`;
        } else if (cell.hasGem) {
          content += '<span class="gem">💎</span>';
        }
        if (cell.hasFlag) {
          content += '<span class="flag">🚩</span>';
        }

        tile.innerHTML = content || "&nbsp;";
        this.gridContainer.appendChild(tile);
      }
    }
  }

  showMessage(text, type) {
    if (!this.messageDiv) return;
    this.messageDiv.className = `message ${type}`;
    this.messageDiv.textContent = text;
  }

  loadLevelUI(levelNum, challenge, currentChallengeNum) {
    this.container.innerHTML = "";
    let htmlContent = "";

    if (levelNum === 1) {
      let resetButtonHTML = `<button class="btn btn-secondary" onclick="resetChallenge()">Reset</button>`;
      if (challenge.type === "loop") resetButtonHTML = "";

      htmlContent = `
                <div class="game-grid" id="grid-container"></div>
                <div class="controls-panel">
                    <div class="challenge-title">${challenge.title}</div>
                    <div class="challenge-description">${
                      challenge.description
                    }</div>
                    ${this.renderLevel1Controls(challenge.type)}
                    <div class="action-buttons">${resetButtonHTML}</div>
                    <div id="message"></div>
                </div>`;
    } else if (levelNum === 2) {
      let resetButtonHTML = `<button class="btn btn-secondary" onclick="resetChallenge()">Reset</button>`;
      if (currentChallengeNum === 0 || currentChallengeNum === 1)
        resetButtonHTML = "";

      htmlContent = `
                <div class="game-grid" id="grid-container"></div>
                <div class="controls-panel">
                    <div class="challenge-title">${challenge.title}</div>
                    <div class="challenge-description">${
                      challenge.description
                    }</div>
                    <div class="code-display" id="code-display">${this.renderCodeWithBlanks(
                      challenge
                    )}</div>
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="executeLevel2()">Run</button>
                        ${resetButtonHTML}
                    </div>
                    <div id="message"></div>
                </div>`;
    } else if (levelNum === 3) {
      htmlContent = `
                <div class="game-grid" id="grid-container"></div>
                <div class="controls-panel">
                    <div style="background: #5465ff; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #788bff;">
                        <div style="font-weight: 600; margin-bottom: 8px; color: #ffffff;">Available Commands:</div>
                        <div style="font-family: 'Courier New', monospace; font-size: 0.85em; color: #ffffff;">
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
                </div>`;
    }

    this.container.innerHTML = htmlContent;
    this.gridContainer = document.getElementById("grid-container");
    this.messageDiv = document.getElementById("message");
  }

  renderLevel1Controls(type) {
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
            </div>`;
    } else if (type === "loop") {
      return `
            <div class="control-group">
                <label>Repeat move+collect how many times?</label>
                <input type="number" id="loop-count" min="1" max="10" placeholder="Enter number" />
                <button class="btn btn-primary" onclick="executeLoop()" style="margin-top: 10px;">Run</button>
            </div>`;
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
            </div>`;
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
            </div>`;
    }
    return "";
  }

  renderCodeWithBlanks(puzzle) {
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

  updateSequenceDisplay(sequence) {
    const display = document.getElementById("sequence-display");
    if (!display) return;
    const icons = { up: "↑", down: "↓", left: "←", right: "→" };
    display.innerHTML = sequence
      .map((dir) => `<span class="sequence-item">${icons[dir]}</span>`)
      .join("");
  }
}

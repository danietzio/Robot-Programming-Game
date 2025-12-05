// Levels System
let currentLevelNum = 1
let currentChallengeNum = 0

// Level 1: Keywords (Understanding)
const level1Challenges = [
  {
    title: "Challenge 1: VARIABLE",
    description:
      "Move the robot to the flag before energy runs out! Each move decreases energy by 1.",
    config: {
      startPos: { x: 0, y: 0 },
      startDirection: "east",
      startEnergy: 10,
      elements: [{ type: "flag", x: 4, y: 4 }],
      goal: { type: "reachFlag" },
    },
    type: "variable",
  },
  {
    title: "Challenge 2: LOOP",
    description:
      "Collect all 5 gems! Type how many times to repeat the move+collect action.",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 20,
      elements: [
        { type: "gem", x: 0, y: 2 },
        { type: "gem", x: 1, y: 2 },
        { type: "gem", x: 2, y: 2 },
        { type: "gem", x: 3, y: 2 },
        { type: "gem", x: 4, y: 2 },
      ],
      goal: { type: "collectGems", count: 5 },
    },
    type: "loop",
  },
  {
    title: "Challenge 3: IF",
    description:
      "Reach the flag safely! Choose a direction, then decide whether to use IF. If tile is green, check IF. If tile is red, check IF to prevent moving. Make the right choice or you lose!",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 20,
      elements: [
        { type: "safe", x: 0, y: 2 },
        { type: "safe", x: 1, y: 2 },
        { type: "danger", x: 2, y: 2 },
        { type: "safe", x: 3, y: 2 },
        { type: "safe", x: 4, y: 2 },
        { type: "flag", x: 4, y: 2 },
      ],
      goal: { type: "reachFlagSafely" },
    },
    type: "if",
  },
  {
    title: "Challenge 4: FUNCTION",
    description:
      "Create a patrol function! Click arrows to build a sequence, then save it as a function.",
    config: {
      startPos: { x: 0, y: 0 },
      startDirection: "east",
      startEnergy: 20,
      elements: [{ type: "flag", x: 2, y: 2 }],
      goal: { type: "reachFlag" },
    },
    type: "function",
  },
]

// Level 2: Combination (Applying)
const level2Puzzles = [
  {
    title: "Puzzle 1: Loop Keyword",
    description: "Move robot 3 steps forward to reach flag",
    code: "_______(3) { move() }",
    blanks: [
      {
        type: "dropdown",
        options: ["if", "repeat", "while"],
        answer: "repeat",
        position: 0,
      },
    ],
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [{ type: "flag", x: 3, y: 2 }],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Puzzle 2: Loop Count",
    description: "Collect 4 gems in a row",
    code: "repeat(___) { move() pickUp() }",
    blanks: [{ type: "number", answer: 4, position: 0 }],
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 20,
      elements: [
        { type: "gem", x: 0, y: 2 },
        { type: "gem", x: 1, y: 2 },
        { type: "gem", x: 2, y: 2 },
        { type: "gem", x: 3, y: 2 },
      ],
      goal: { type: "collectGems", count: 4 },
    },
  },
  {
    title: "Puzzle 3: IF Keyword",
    description: "Pick up gem only if one is ahead",
    code: "_______(gemAhead()) { pickUp() }",
    blanks: [
      {
        type: "dropdown",
        options: ["if", "repeat", "while"],
        answer: "if",
        position: 0,
      },
    ],
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [{ type: "gem", x: 1, y: 2 }],
      goal: { type: "collectGems", count: 1 },
    },
  },
  {
    title: "Puzzle 4: WHILE Keyword",
    description: "Move right, then move up until you reach the flag",
    code: "energy = 10 _______(energy > 0) { move() energy = energy - 1 }",
    blanks: [
      {
        type: "dropdown",
        options: ["if", "repeat", "while"],
        answer: "while",
        position: 0,
      },
    ],
    config: {
      startPos: { x: 0, y: 4 },
      startDirection: "east",
      startEnergy: 10,
      elements: [{ type: "flag", x: 4, y: 0 }],
      goal: { type: "reachFlag" },
    },
  },
]

// Level 3: Supplementation (Creating)
const level3Challenges = [
  {
    title: "Challenge 1: Write a Loop",
    description: "Move robot 5 steps forward to flag",
    hint: "Use repeat(number) { action }",
    expected: "repeat(5) { move() }",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [{ type: "flag", x: 4, y: 2 }],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Challenge 2: Write a Conditional",
    description: "Pick up gem only if one exists ahead, then reach the flag",
    hint: "Use if(condition) { action }, then use repeat(){move()}",
    expected: "if(gemAhead()) { pickUp() }\nmove()\nmove()",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [
        { type: "gem", x: 1, y: 2 },
        { type: "flag", x: 3, y: 2 },
      ],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Challenge 3: Write a While Loop",
    description: "Move forward until hitting a wall, then reach the flag",
    hint: "Use while(condition) { action }, pathClear() can be useful here.",
    expected: "while(pathClear()) { move() }",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 20,
      elements: [
        { type: "wall", x: 4, y: 2 },
        { type: "flag", x: 3, y: 2 },
      ],
      goal: { type: "reachFlag" },
    },
  },
]

// UI Rendering Functions
function loadLevel(levelNum) {
  currentLevelNum = levelNum
  currentChallengeNum = 0

  // Update active button
  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (parseInt(btn.dataset.level) === levelNum) {
      btn.classList.add("active")
    }
  })

  const container = document.getElementById("game-container")
  container.innerHTML = ""

  if (levelNum === 1) {
    loadLevel1()
  } else if (levelNum === 2) {
    loadLevel2()
  } else if (levelNum === 3) {
    loadLevel3()
  }
}

function loadLevel1() {
  const container = document.getElementById("game-container")
  const challenge = level1Challenges[currentChallengeNum]

  game.setLevelConfig(challenge.config)
  game.currentChallenge = challenge
  // Reset sequence for function builder
  if (challenge.type === "function") {
    game.sequence = []
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
    `

  game.updateDisplay()

  // Reset direction selection for IF challenge
  if (challenge.type === "if") {
    selectedDirectionForIf = null
  }
}

function renderLevel1Controls(type) {
  if (type === "variable") {
    return `
            <div class="control-group">
                <label>Use arrow buttons to move:</label>
                <div class="arrow-buttons" style="display: flex; grid-template-columns: none; grid-template-rows: none; flex-direction: row; justify-content: center; gap: 5px;">
                    <button class="arrow-btn" style="width: 60px; height: 60px;" onclick="moveRobot('up')">↑</button>
                    <button class="arrow-btn" style="width: 60px; height: 60px;" onclick="moveRobot('left')">←</button>
                    <button class="arrow-btn" style="width: 60px; height: 60px;" onclick="moveRobot('down')">↓</button>
                    <button class="arrow-btn" style="width: 60px; height: 60px;" onclick="moveRobot('right')">→</button>
                </div>
            </div>
        `
  } else if (type === "loop") {
    return `
            <div class="control-group">
                <label>Repeat move+collect how many times?</label>
                <input type="number" id="loop-count" min="1" max="10" placeholder="Enter number" />
                <button class="btn btn-primary" onclick="executeLoop()" style="margin-top: 10px;">Run</button>
            </div>
        `
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
        `
  } else if (type === "function") {
    return `
            <div class="function-builder">
                <label>Build your sequence:</label>
                <div class="arrow-buttons">
                    <button class="arrow-btn" onclick="addToSequence('up')">↑</button>
                    <button class="arrow-btn" onclick="addToSequence('left')">←</button>
                    <button class="arrow-btn" onclick="addToSequence('down')">↓</button>
                    <button class="arrow-btn" onclick="addToSequence('right')">→</button>
                </div>
                <div class="sequence-display" id="sequence-display"></div>
                <button class="btn function-btn" onclick="saveFunction()">Save as patrol()</button>
                <div id="function-buttons"></div>
            </div>
        `
  }
  return ""
}

function loadLevel2() {
  const container = document.getElementById("game-container")
  const puzzle = level2Puzzles[currentChallengeNum]

  game.setLevelConfig(puzzle.config)
  game.currentChallenge = puzzle

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
    `

  game.updateDisplay()
}

function renderCodeWithBlanks(puzzle) {
  let code = puzzle.code
  puzzle.blanks.forEach((blank, index) => {
    const placeholder = blank.type === "dropdown" ? "_______" : "___"
    if (blank.type === "dropdown") {
      code = code.replace(
        placeholder,
        `<select id="blank-${index}" class="dropdown-blank">
                <option value="" selected disabled>Select</option>
                ${blank.options
                  .map((opt) => `<option value="${opt}">${opt}</option>`)
                  .join("")}
            </select>`
      )
    } else {
      code = code.replace(
        placeholder,
        `<input type="number" id="blank-${index}" class="dropdown-blank" min="1" max="10" placeholder="Enter number" />`
      )
    }
  })
  return code
}

function loadLevel3() {
  const container = document.getElementById("game-container")
  const challenge = level3Challenges[currentChallengeNum]

  game.setLevelConfig(challenge.config)
  game.currentChallenge = challenge

  container.innerHTML = `
        <div class="game-grid" id="grid-container"></div>
        <div class="controls-panel">
            <div style="background: #e8f5e9; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #4caf50;">
                <div style="font-weight: 600; margin-bottom: 8px; color: #2e7d32;">Available Functions:</div>
                <div style="font-family: 'Courier New', monospace; font-size: 0.9em; color: #1b5e20;">
                    <strong>Actions:</strong> move(), pickUp(), turnLeft(), turnRight()<br>
                    <strong>Conditions:</strong> gemAhead(), pathClear(), tileIsSafe()
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
    `

  game.updateDisplay()
}

// Level 1 Functions
function resetChallenge() {
  game.reset()
  game.updateDisplay()

  // Reset sequence for function challenge
  if (game.currentChallenge && game.currentChallenge.type === "function") {
    game.sequence = []
    const sequenceDisplay = document.getElementById("sequence-display")
    if (sequenceDisplay) {
      sequenceDisplay.innerHTML = ""
    }
    const funcButtons = document.getElementById("function-buttons")
    if (funcButtons) {
      funcButtons.innerHTML = ""
    }
  }

  // Update preview for IF challenge
  if (game.currentChallenge && game.currentChallenge.type === "if") {
    updateNextTilePreview()
  }
}

function moveRobot(direction) {
  try {
    if (direction === "up") {
      game.robot.direction = "north"
      game.move()
    } else if (direction === "down") {
      game.robot.direction = "south"
      game.move()
    } else if (direction === "left") {
      game.robot.direction = "west"
      game.move()
    } else if (direction === "right") {
      game.robot.direction = "east"
      game.move()
    }
    game.updateDisplay()
    checkGoal()
  } catch (error) {
    showMessage(error.message, "error")
  }
}

async function executeLoop() {
  const countInput = document.getElementById("loop-count").value
  if (!countInput || countInput === "") {
    showMessage("Please enter a number!", "error")
    return
  }
  const count = parseInt(countInput)
  if (isNaN(count) || count < 1) {
    showMessage("Please enter a valid number (1-10)!", "error")
    return
  }

  game.reset()

  try {
    for (let i = 0; i < count; i++) {
      // Pick up gem at current position first (important for starting position)
      game.pickUp()
      // Then move to next position (which auto-collects gem there if present)
      game.move()
      // Update display and add delay for smooth animation
      game.updateDisplay()
      await game.delay(400)
    }
    checkGoal()
  } catch (error) {
    showMessage(error.message, "error")
  }
}

// Store selected direction for IF challenge
let selectedDirectionForIf = null

function selectDirectionForIf(direction) {
  selectedDirectionForIf = direction

  // Update button styles to show selection
  ;["up", "down", "left", "right"].forEach((dir) => {
    const btn = document.getElementById(`dir-${dir}`)
    if (btn) {
      btn.style.opacity = dir === direction ? "1" : "0.5"
      btn.style.transform = dir === direction ? "scale(1.1)" : "scale(1)"
    }
  })

  // Show preview of tile in that direction
  updateTilePreviewForDirection(direction)
}

function updateTilePreviewForDirection(direction) {
  const previewDiv = document.getElementById("next-tile-preview")
  const statusText = document.getElementById("tile-status-text")

  if (!previewDiv || !statusText) {
    return
  }

  // Calculate tile position based on direction
  let checkX = game.robot.x
  let checkY = game.robot.y
  let dirName = ""

  switch (direction) {
    case "up":
      checkY--
      dirName = "North (↑)"
      break
    case "down":
      checkY++
      dirName = "South (↓)"
      break
    case "left":
      checkX--
      dirName = "West (←)"
      break
    case "right":
      checkX++
      dirName = "East (→)"
      break
  }

  // Check bounds
  if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
    statusText.innerHTML = `<span style="color: #666;">Cannot move ${dirName} - out of bounds!</span>`
    previewDiv.style.background = "#f5f5f5"
    previewDiv.style.border = "2px solid #ccc"
    return
  }

  const nextTile = game.grid[checkY][checkX]
  const isSafe = nextTile && nextTile.isSafe

  if (isSafe) {
    statusText.innerHTML = `<span style="color: #4caf50; font-weight: 600;">✓ Tile ${dirName} is GREEN (safe)</span>`
    previewDiv.style.background = "#c8e6c9"
    previewDiv.style.border = "2px solid #4caf50"
  } else {
    statusText.innerHTML = `<span style="color: #f44336; font-weight: 600;">✗ Tile ${dirName} is RED (danger)</span>`
    previewDiv.style.background = "#ffcdd2"
    previewDiv.style.border = "2px solid #f44336"
  }
}

function moveRobotWithDirectionAndIf() {
  // Check if direction is selected
  if (!selectedDirectionForIf) {
    showMessage("Please select a direction first!", "error")
    return
  }

  const checkbox = document.getElementById("if-checkbox")
  if (!checkbox) {
    showMessage("Error: IF checkbox not found", "error")
    return
  }

  const ifEnabled = checkbox.checked
  const direction = selectedDirectionForIf

  // Set robot direction
  switch (direction) {
    case "up":
      game.robot.direction = "north"
      break
    case "down":
      game.robot.direction = "south"
      break
    case "left":
      game.robot.direction = "west"
      break
    case "right":
      game.robot.direction = "east"
      break
  }

  // Calculate next tile position
  let checkX = game.robot.x
  let checkY = game.robot.y

  switch (direction) {
    case "up":
      checkY--
      break
    case "down":
      checkY++
      break
    case "left":
      checkX--
      break
    case "right":
      checkX++
      break
  }

  // Check bounds
  if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
    showMessage("❌ Challenge Failed! Cannot move out of bounds.", "error")
    return
  }

  const nextTile = game.grid[checkY][checkX]
  if (!nextTile) {
    showMessage("Error: Invalid tile position!", "error")
    return
  }

  const isSafe = nextTile.isSafe

  // Check if user made the correct choice
  let choiceIsCorrect = false

  if (isSafe) {
    // Tile is green (safe)
    if (ifEnabled) {
      // User checked IF - CORRECT! IF allows moving to safe tiles
      choiceIsCorrect = true
    } else {
      // User unchecked IF - WRONG! Should use IF for safe tiles
      choiceIsCorrect = false
    }
  } else {
    // Tile is red (danger)
    if (ifEnabled) {
      // User checked IF - CORRECT! IF prevents moving to danger tiles
      choiceIsCorrect = true
    } else {
      // User unchecked IF - WRONG! Should use IF to prevent danger
      choiceIsCorrect = false
    }
  }

  // Execute based on correctness
  if (!choiceIsCorrect) {
    if (isSafe) {
      showMessage(
        "❌ Challenge Failed! Wrong choice. When tile is GREEN, you should CHECK IF. Try again!",
        "error"
      )
    } else {
      // Try to move into danger to show the consequence
      try {
        game.move()
        showMessage(
          "❌ Challenge Failed! Wrong choice. When tile is RED, you should CHECK IF to prevent moving into danger. Robot stepped on danger tile!",
          "error"
        )
      } catch (error) {
        showMessage(
          "❌ Challenge Failed! Wrong choice. When tile is RED, you should CHECK IF to prevent moving into danger.",
          "error"
        )
      }
    }
    game.updateDisplay()
    return
  }

  // Choice is correct - execute movement
  try {
    if (isSafe) {
      // Safe tile - move
      game.move()
      showMessage(
        "✓ Correct! IF condition passed. Robot moved safely.",
        "success"
      )
    } else {
      // Danger tile - IF prevents movement (this is correct)
      showMessage(
        "✓ Correct! IF condition prevented moving into danger. Robot is safe.",
        "success"
      )
      // Don't move - this is the correct behavior
    }

    game.updateDisplay()
    // Clear selection and update preview
    selectedDirectionForIf = null
    ;["up", "down", "left", "right"].forEach((dir) => {
      const btn = document.getElementById(`dir-${dir}`)
      if (btn) {
        btn.style.opacity = "1"
        btn.style.transform = "scale(1)"
      }
    })
    document.getElementById("tile-status-text").innerHTML =
      "Choose a direction to see tile preview..."
    checkGoal()
  } catch (error) {
    showMessage("Error: " + error.message, "error")
  }
}

function addToSequence(direction) {
  game.sequence.push(direction)
  updateSequenceDisplay()
}

function updateSequenceDisplay() {
  const display = document.getElementById("sequence-display")
  display.innerHTML = game.sequence
    .map((dir) => {
      const icons = { up: "↑", down: "↓", left: "←", right: "→" }
      return `<span class="sequence-item">${icons[dir]}</span>`
    })
    .join("")
}

function saveFunction() {
  if (game.sequence.length === 0) {
    showMessage("Please create a sequence first!", "error")
    return
  }

  game.functions.patrol = [...game.sequence]
  const funcButtons = document.getElementById("function-buttons")
  funcButtons.innerHTML =
    '<button class="btn function-btn" onclick="executePatrol()">Execute patrol()</button>'
  showMessage("Function saved! Click patrol() to execute it.", "success")
}

function executePatrol() {
  if (!game.functions.patrol || !Array.isArray(game.functions.patrol)) {
    showMessage(
      "No patrol function saved. Please create a sequence first!",
      "error"
    )
    return
  }

  game.reset()

  try {
    for (const dir of game.functions.patrol) {
      if (dir === "up") {
        game.robot.direction = "north"
      } else if (dir === "down") {
        game.robot.direction = "south"
      } else if (dir === "left") {
        game.robot.direction = "west"
      } else if (dir === "right") {
        game.robot.direction = "east"
      }
      game.move()
    }
    game.updateDisplay()
    checkGoal()
  } catch (error) {
    showMessage(error.message, "error")
  }
}

// Level 2 Functions
async function executeLevel2() {
  const puzzle = level2Puzzles[currentChallengeNum]
  game.reset()

  // Get answers from blanks
  const answers = []
  for (let index = 0; index < puzzle.blanks.length; index++) {
    const blank = puzzle.blanks[index]
    const element = document.getElementById(`blank-${index}`)
    if (blank.type === "dropdown") {
      const value = element.value
      if (!value || value === "") {
        showMessage("Please select an option from the dropdown!", "error")
        return
      }
      answers.push(value)
    } else {
      const value = element.value
      if (!value || value === "") {
        showMessage("Please enter a number!", "error")
        return
      }
      answers.push(parseInt(value))
    }
  }

  // Check answers
  let allCorrect = true
  puzzle.blanks.forEach((blank, index) => {
    if (blank.type === "dropdown" && answers[index] !== blank.answer) {
      allCorrect = false
    } else if (blank.type === "number" && answers[index] !== blank.answer) {
      allCorrect = false
    }
  })

  if (!allCorrect) {
    showMessage("Incorrect answer! Try again.", "error")
    return
  }

  // Execute code with correct answers
  try {
    let code = puzzle.code
    puzzle.blanks.forEach((blank, index) => {
      const placeholder = blank.type === "dropdown" ? "_______" : "___"
      code = code.replace(placeholder, answers[index])
    })

    // Execute the code
    if (code.includes("repeat")) {
      const match = code.match(/repeat\s*\(\s*(\d+)\s*\)\s*\{\s*(.+?)\s*\}/)
      if (match) {
        const count = parseInt(match[1])
        const actions = match[2].split(/\s+/).filter((a) => a)
        for (let i = 0; i < count; i++) {
          // Execute pickUp first (important for starting position with gem)
          for (const action of actions) {
            if (action === "pickUp()") {
              game.pickUp()
              game.updateDisplay()
              await game.delay(200)
            }
          }
          // Then execute move (which auto-collects gem at new position)
          for (const action of actions) {
            if (action === "move()") {
              game.move()
              game.updateDisplay()
              await game.delay(400)
            }
          }
        }
      }
    } else if (code.includes("if")) {
      const match = code.match(
        /if\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/
      )
      if (match) {
        const condition = match[1]
        const action = match[2].trim()
        if (condition === "gemAhead" && game.gemAhead()) {
          // If gem is ahead, move forward first (which auto-collects the gem)
          // Then pickUp() will work on the current position if needed
          game.move() // Move to the gem (auto-collects it)
          if (action === "pickUp()") {
            // pickUp() at new position (in case there's another gem or to ensure collection)
            game.pickUp()
          }
        }
      }
    } else if (code.includes("while")) {
      // While loop execution - move right first, then up until reaching flag or energy runs out
      game.variables.energy = 10
      game.robot.direction = "east"

      // First phase: Move right until reaching the rightmost column (x = 4)
      while (game.variables.energy > 0 && game.robot.x < 4) {
        game.move()
      }

      // Second phase: Change direction to north and move up until reaching flag or energy runs out
      if (game.variables.energy > 0) {
        game.robot.direction = "north"
        while (game.variables.energy > 0 && game.robot.y > 0) {
          game.move()
          // Check if we reached the flag
          if (game.checkGoal()) {
            break
          }
        }
      }
    }

    game.updateDisplay()
    checkGoal()
  } catch (error) {
    showMessage(error.message, "error")
  }
}

// Level 3 Functions
async function executeLevel3() {
  const challenge = level3Challenges[currentChallengeNum]
  const codeInput = document.getElementById("code-input").value.trim()

  if (!codeInput) {
    showMessage("Please write some code!", "error")
    return
  }

  game.reset()

  try {
    // Simple code execution
    const lines = codeInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l)

    for (const line of lines) {
      await executeCodeLine(line)
    }

    game.updateDisplay()
    checkGoal()
  } catch (error) {
    showMessage("Error: " + error.message, "error")
  }
}

async function executeCodeLine(line) {
  // Parse repeat(n) { action }
  const repeatMatch = line.match(/repeat\s*\(\s*(\d+)\s*\)\s*\{\s*(.+?)\s*\}/)
  if (repeatMatch) {
    const count = parseInt(repeatMatch[1])
    const actions = repeatMatch[2].trim()
    for (let i = 0; i < count; i++) {
      // Handle multiple actions separated by spaces
      const actionList = actions.split(/\s+/).filter((a) => a)
      for (const action of actionList) {
        if (action === "move()" || action === "move") game.move()
        if (action === "pickUp()" || action === "pickUp") game.pickUp()
        game.updateDisplay()
        await game.delay(300)
      }
    }
    return
  }

  // Parse if(condition) { action }
  const ifMatch = line.match(/if\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/)
  if (ifMatch) {
    const condition = ifMatch[1]
    const action = ifMatch[2].trim()
    if (condition === "gemAhead" && game.gemAhead()) {
      // If gem is ahead, move forward first (which auto-collects the gem)
      game.move()
      game.updateDisplay()
      await game.delay(300)
      // Then execute pickUp() if specified (redundant but keeps code structure)
      if (action === "pickUp()" || action === "pickUp") {
        game.pickUp()
      }
    }
    game.updateDisplay()
    await game.delay(300)
    return
  }

  // Parse while(condition) { action }
  const whileMatch = line.match(
    /while\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/
  )
  if (whileMatch) {
    const condition = whileMatch[1]
    const action = whileMatch[2].trim()

    // Check condition and execute loop
    if (condition === "pathClear") {
      while (game.pathClear()) {
        if (action.includes("move()") || action.includes("move")) {
          game.move()
          game.updateDisplay()
          await game.delay(300)
        } else {
          // If no move action, break to avoid infinite loop
          break
        }
      }
    }
    return
  }

  // Handle standalone function calls
  if (line.trim() === "move()" || line.trim() === "move") {
    game.move()
    game.updateDisplay()
    await game.delay(300)
    return
  }
  if (line.trim() === "pickUp()" || line.trim() === "pickUp") {
    game.pickUp()
    game.updateDisplay()
    await game.delay(300)
    return
  }
}

function toggleHint() {
  const hintBox = document.getElementById("hint-box")
  hintBox.classList.toggle("show")
}

function checkGoal() {
  if (game.checkGoal()) {
    showMessage("🎉 Success! Goal achieved!", "success")
    setTimeout(() => {
      nextChallenge()
    }, 2000)
  }
}

function nextChallenge() {
  if (
    currentLevelNum === 1 &&
    currentChallengeNum < level1Challenges.length - 1
  ) {
    currentChallengeNum++
    loadLevel1()
  } else if (
    currentLevelNum === 2 &&
    currentChallengeNum < level2Puzzles.length - 1
  ) {
    currentChallengeNum++
    loadLevel2()
  } else if (
    currentLevelNum === 3 &&
    currentChallengeNum < level3Challenges.length - 1
  ) {
    currentChallengeNum++
    loadLevel3()
  } else {
    showMessage("🎊 Congratulations! You completed all challenges!", "success")
  }
}

function showMessage(text, type) {
  const messageDiv = document.getElementById("message")
  messageDiv.className = `message ${type}`
  messageDiv.textContent = text
  setTimeout(() => {
    messageDiv.textContent = ""
    messageDiv.className = "message"
  }, 5000)
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Level selector buttons
  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      loadLevel(parseInt(btn.dataset.level))
    })
  })

  // Load Level 1 by default
  loadLevel(1)
})

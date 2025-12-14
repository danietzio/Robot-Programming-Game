import { RobotGame } from "./GameLogic.js";
import { UIManager } from "./UIManager.js";
import { level1Challenges } from "./levels/level1.js";
import { level2Puzzles } from "./levels/level2.js";
import { level3Challenges } from "./levels/level3.js";
import { SoundManager } from "./SoundManager.js";
import { conceptExplanations, errorMessages } from "./concepts.js";

const game = new RobotGame();
const ui = new UIManager(game);
const sound = new SoundManager();

let currentLevelNum = 1;
let currentChallengeNum = 0;

function getCurrentChallengeObject() {
  if (currentLevelNum === 1) return level1Challenges[currentChallengeNum];
  if (currentLevelNum === 2) return level2Puzzles[currentChallengeNum];
  if (currentLevelNum === 3) return level3Challenges[currentChallengeNum];
  return null;
}

function checkGoal() {
  if (game.checkGoal()) {
    // Show energy efficiency feedback
    const efficiency = game.getEnergyEfficiency();
    let efficiencyMsg = "";
    if (efficiency.isOptimal) {
      efficiencyMsg = `<div class="energy-feedback efficient">✨ Perfect! You used exactly ${efficiency.energyUsed} energy (optimal solution!)</div>`;
    } else if (efficiency.efficiency >= 80) {
      efficiencyMsg = `<div class="energy-feedback efficient">Great job! You used ${efficiency.energyUsed} energy (${efficiency.efficiency}% efficient)</div>`;
    } else {
      efficiencyMsg = `<div class="energy-feedback inefficient">💡 You used ${efficiency.energyUsed} energy. Optimal solution uses ${efficiency.optimalEnergy}. Try to be more efficient!</div>`;
    }
    
    // Show "Why This Matters" section
    const challenge = getCurrentChallengeObject();
    let conceptKey = "";
    if (challenge.type) conceptKey = challenge.type;
    else if (challenge.code?.includes("repeat")) conceptKey = "repeat";
    else if (challenge.code?.includes("while")) conceptKey = "while";
    else if (challenge.code?.includes("if")) conceptKey = "if";
    
    const concept = conceptExplanations[conceptKey];
    let whyMattersHTML = "";
    if (concept && concept.whyItMatters) {
      whyMattersHTML = `
        <div class="why-matters-box">
          <div class="why-matters-title">💡 Why This Matters:</div>
          <div class="why-matters-content">${concept.whyItMatters}</div>
        </div>
      `;
    }
    
    ui.showMessage("🎉 Success! Goal achieved!", "success");
    
    // Add efficiency and why matters to message div
    setTimeout(() => {
      if (ui.messageDiv) {
        ui.messageDiv.innerHTML += efficiencyMsg + whyMattersHTML;
      }
    }, 100);
    
    // Check if this is the last challenge of a level
    const isLevel1Complete = currentLevelNum === 1 && currentChallengeNum >= level1Challenges.length - 1;
    const isLevel2Complete = currentLevelNum === 2 && currentChallengeNum >= level2Puzzles.length - 1;
    const isLevel3Complete = currentLevelNum === 3 && currentChallengeNum >= level3Challenges.length - 1;
    
    if (isLevel1Complete || isLevel2Complete || isLevel3Complete) {
      setTimeout(showSuccessPopup, 2000);
    } else {
      // Just proceed to next challenge automatically
      setTimeout(nextChallenge, 3000);
    }
  }
}

function showSuccessPopup() {
  const overlay = document.getElementById("level-success-overlay");
  const titleEl = document.getElementById("success-title");
  const messageEl = document.getElementById("success-message");
  const nextBtn = document.getElementById("next-level-btn");
  
  if (currentLevelNum === 1 && currentChallengeNum >= level1Challenges.length - 1) {
    titleEl.textContent = "Level 1 Complete! 🎉";
    messageEl.textContent = "You've mastered the basics! Ready for more complex challenges?";
    nextBtn.textContent = "Continue to Level 2";
    overlay.classList.add("active");
  } else if (currentLevelNum === 2 && currentChallengeNum >= level2Puzzles.length - 1) {
    titleEl.textContent = "Level 2 Complete! 🎉";
    messageEl.textContent = "Great job with code combinations! Time to write your own code!";
    nextBtn.textContent = "Continue to Level 3";
    overlay.classList.add("active");
  } else if (currentLevelNum === 3 && currentChallengeNum >= level3Challenges.length - 1) {
    // Show the game completion overlay instead
    document.getElementById("completion-overlay").classList.add("active");
  }
}

function nextChallenge() {
  if (currentLevelNum === 1) {
    if (currentChallengeNum < level1Challenges.length - 1) {
      currentChallengeNum++;
      window.loadLevel(1);
    } else {
      ui.showMessage("Level 1 Complete! Moving to Level 2...", "success");
      currentChallengeNum = 0;
      setTimeout(() => window.loadLevel(2), 1500);
    }
  } else if (currentLevelNum === 2) {
    if (currentChallengeNum < level2Puzzles.length - 1) {
      currentChallengeNum++;
      window.loadLevel(2);
    } else {
      ui.showMessage("Level 2 Complete! Moving to Level 3...", "success");
      currentChallengeNum = 0;
      setTimeout(() => window.loadLevel(3), 1500);
    }
  } else if (currentLevelNum === 3) {
    if (currentChallengeNum < level3Challenges.length - 1) {
      currentChallengeNum++;
      window.loadLevel(3);
    } else {
      document.getElementById("completion-overlay").classList.add("active");
    }
  }
}

window.loadLevel = (levelNum) => {
  currentLevelNum = levelNum;

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.level) === levelNum) btn.classList.add("active");
  });

  const challenge = getCurrentChallengeObject();
  if (!challenge) return;

  game.setLevelConfig(challenge.config);
  game.currentChallenge = challenge;
  if (challenge.type === "function") game.sequence = [];

  ui.loadLevelUI(levelNum, challenge, currentChallengeNum);
  ui.updateDisplay();
};

window.resetChallenge = () => {
  game.reset();
  ui.updateDisplay();

  if (game.currentChallenge && game.currentChallenge.type === "function") {
    game.sequence = [];
    ui.updateSequenceDisplay(game.sequence);
    const funcButtons = document.getElementById("function-buttons");
    if (funcButtons) funcButtons.innerHTML = "";
  }
  const codeInput = document.getElementById("code-input");
  if (codeInput) codeInput.value = "";
};

window.toggleHint = () => {
  document.getElementById("hint-box").classList.toggle("show");
};

function parseError(errorMessage) {
  const parts = errorMessage.split("|");
  return {
    message: parts[0] || errorMessage,
    explanation: parts[1] || null,
    tip: parts[2] || null
  };
}

window.moveRobot = (direction) => {
  try {
    if (direction === "up") game.robot.direction = "north";
    if (direction === "down") game.robot.direction = "south";
    if (direction === "left") game.robot.direction = "west";
    if (direction === "right") game.robot.direction = "east";

    game.move();
    sound.playMove();
    ui.updateDisplay();
    checkGoal();
  } catch (error) {
    const errorInfo = parseError(error.message);
    ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
    setTimeout(() => {
      window.resetChallenge();
    }, 2000);
  }
};

window.moveWithSafety = (direction) => {
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
    ui.showMessage("Cannot move there (Wall/Boundary)", "error");
    setTimeout(() => window.resetChallenge(), 1000);
    return;
  }

  const nextTile = game.grid[checkY][checkX];

  if (isSafetyOn) {
    if (nextTile.isDanger) {
      ui.showMessage(
        "⚠️ Safety System Active: Danger detected! Robot refused to move.",
        "success"
      );
      ui.updateDisplay();
      return;
    } else {
      try {
        game.move();
        sound.playMove();
        ui.showMessage("Safety System Active: Path clear. Moving.", "success");
      } catch (e) {
        const errorInfo = parseError(e.message);
        ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
        setTimeout(window.resetChallenge, 2000);
      }
    }
  } else {
    if (nextTile.isDanger) {
      try {
        game.move();
        sound.playMove();
        ui.updateDisplay();
        ui.showMessage(
          "❌ CRITICAL: Safety was OFF! Robot stepped on danger.",
          "error",
          "When Safety Mode is OFF, the robot doesn't check for danger before moving. Always use Safety Mode (IF checks) to avoid crashes!",
          "💡 Tip: Turn ON Safety Mode to use conditional logic and prevent accidents!"
        );
        setTimeout(() => window.resetChallenge(), 2000);
      } catch (e) {
        const errorInfo = parseError(e.message);
        ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
        setTimeout(window.resetChallenge, 2000);
      }
    } else {
      try {
        game.move();
        sound.playMove();
      } catch (e) {
        const errorInfo = parseError(e.message);
        ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
        setTimeout(window.resetChallenge, 2000);
      }
    }
  }
  ui.updateDisplay();
  checkGoal();
};

window.executeLoop = async () => {
  const countInput = document.getElementById("loop-count").value;
  if (!countInput) {
    ui.showMessage("Enter a number!", "error");
    return;
  }

  const count = parseInt(countInput);
  game.reset();

  try {
    for (let i = 0; i < count; i++) {
      game.pickUp();
      game.move();
      sound.playMove();
      ui.updateDisplay();
      await game.delay(400);
    }
    checkGoal();
  } catch (error) {
    ui.showMessage(error.message, "error");
    setTimeout(window.resetChallenge, 1000);
  }
};

window.addToSequence = (direction) => {
  game.sequence.push(direction);
  ui.updateSequenceDisplay(game.sequence);
};

window.saveFunction = () => {
  if (game.sequence.length === 0) {
    ui.showMessage("Sequence is empty!", "error");
    return;
  }
  game.functions.patrol = [...game.sequence];
  const funcButtons = document.getElementById("function-buttons");
  funcButtons.innerHTML =
    '<button class="btn function-btn" onclick="executePatrol()">Execute patrol()</button>';
  ui.showMessage("Function saved!", "success");
};

window.executePatrol = async () => {
  if (!game.functions.patrol) return;
  game.reset();
  try {
    for (const dir of game.functions.patrol) {
      if (dir === "up") game.robot.direction = "north";
      else if (dir === "down") game.robot.direction = "south";
      else if (dir === "left") game.robot.direction = "west";
      else if (dir === "right") game.robot.direction = "east";

      game.move();
      sound.playMove();
      ui.updateDisplay();
      await game.delay(400);
    }
    checkGoal();
  } catch (error) {
    ui.showMessage(error.message, "error");
    setTimeout(window.resetChallenge, 1000);
  }
};

window.executeLevel2 = async () => {
  const puzzle = level2Puzzles[currentChallengeNum];
  game.reset();

  const answers = [];
  for (let index = 0; index < puzzle.blanks.length; index++) {
    const element = document.getElementById(`blank-${index}`);
    if (!element.value) {
      ui.showMessage("Please fill in all blanks.", "error");
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
    const error = errorMessages.wrongAnswer;
    ui.showMessage(error.message, "error", error.explanation, error.tip);
    return;
  }

  try {
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
        sound.playMove();
        if (puzzle.title.includes("Loop Count")) game.pickUp();
        ui.updateDisplay();
        await game.delay(400);
      }
    } else if (keyword === "if") {
      if (game.gemAhead()) {
        await game.delay(200);
        game.move();
        sound.playMove();
        ui.updateDisplay();
        await game.delay(400);
        game.pickUp();
        ui.updateDisplay();
        await game.delay(400);
      }
    } else if (keyword === "while") {
      while (game.variables.energy > 0 && game.robot.x < 4) {
        game.move();
        sound.playMove();
        ui.updateDisplay();
        await game.delay(300);
      }
      game.robot.direction = "north";
      while (game.variables.energy > 0 && game.robot.y > 0) {
        game.move();
        sound.playMove();
        ui.updateDisplay();
        await game.delay(300);
      }
    }
    checkGoal();
  } catch (error) {
    const errorInfo = parseError(error.message);
    ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
    setTimeout(() => game.reset(), 2000);
  }
};

async function performAction(action) {
  if (action === "move") {
    game.move();
    sound.playMove();
  }
  if (action === "pickUp") game.pickUp();
  if (action === "turnLeft") game.robot.direction = "west";
  if (action === "turnRight") game.robot.direction = "east";
  ui.updateDisplay();
  await game.delay(300);
}

async function executeBlock(bodyString) {
  const commandRegex = /(move|pickUp|turnLeft|turnRight)\s*\(\s*\)/g;
  let match;
  while ((match = commandRegex.exec(bodyString)) !== null) {
    await performAction(match[1]);
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

window.executeLevel3 = async () => {
  const challenge = level3Challenges[currentChallengeNum];
  const codeInput = document.getElementById("code-input").value;

  if (!codeInput.trim()) {
    ui.showMessage("Write some code first!", "error");
    return;
  }

  const explicitMoveCount = (codeInput.match(/move\s*\(\s*\)/g) || []).length;

  if (
    currentChallengeNum === 0 &&
    !codeInput.includes("repeat") &&
    explicitMoveCount > 2
  ) {
    ui.showMessage(
      "Please use repeat() instead of typing move() many times.",
      "error"
    );
    setTimeout(() => window.resetChallenge(), 2000);
    return;
  }

  if (currentChallengeNum === 2 && !codeInput.includes("while")) {
    if (explicitMoveCount > 2) {
      ui.showMessage(
        "I see you trying to cheat! 😉 Please use a while() loop... (Move forward as long as path is clear)",
        "error"
      );
    } else {
      ui.showMessage(
        "❌ Task failed: You must use a 'while()' loop to solve this level.",
        "error"
      );
    }
    setTimeout(() => window.resetChallenge(), 2000);
    return;
  }

  if (currentChallengeNum === 1 && !codeInput.includes("if(gemAhead")) {
    ui.showMessage(
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

      if (!matchFound) code = code.substring(1);
    }

    if (
      challenge.requiresGemCollection &&
      game.variables.gems_collected === 0
    ) {
      ui.showMessage(
        "❌ Task failed: You forgot to pickUp() the gem!",
        "error"
      );
      setTimeout(() => game.reset(), 1000);
    } else {
      checkGoal();
    }
  } catch (error) {
    const errorInfo = parseError(error.message);
    if (errorInfo.message.includes("Missing closing brace")) {
      const syntaxError = errorMessages.missingSyntax;
      ui.showMessage(syntaxError.message, "error", syntaxError.explanation, syntaxError.tip);
    } else {
      ui.showMessage(errorInfo.message, "error", errorInfo.explanation, errorInfo.tip);
    }
    setTimeout(() => {
      game.reset();
      ui.updateDisplay();
    }, 2000);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const completionOverlay = document.getElementById("completion-overlay");
  const levelSuccessOverlay = document.getElementById("level-success-overlay");

  document.getElementById("start-game-btn").addEventListener("click", () => {
    introOverlay.classList.remove("active");
    currentChallengeNum = 0;
    window.loadLevel(1);
    sound.playTheme();
  });

  document.getElementById("restart-game-btn").addEventListener("click", () => {
    completionOverlay.classList.remove("active");
    currentChallengeNum = 0;
    window.loadLevel(1);
    sound.playTheme();
  });

  document.getElementById("next-level-btn").addEventListener("click", () => {
    levelSuccessOverlay.classList.remove("active");
    nextChallenge();
  });

  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentChallengeNum = 0;
      window.loadLevel(parseInt(btn.dataset.level));
    });
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
        if (challengeType === "variable") window.moveRobot(dir);
        if (challengeType === "if") window.moveWithSafety(dir);
        if (challengeType === "function") window.addToSequence(dir);
      }
    }
  });

  if (introOverlay) introOverlay.classList.add("active");
});

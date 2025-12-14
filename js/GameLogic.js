import { errorMessages } from "./concepts.js";

export class RobotGame {
  constructor() {
    this.grid = [];
    this.robot = { x: 0, y: 0, direction: "east" };
    this.variables = {
      energy: 10,
      gems_collected: 0,
    };
    this.levelConfig = null;
    this.functions = {};
    this.sequence = [];
    this.initialEnergy = 10;
    this.movesUsed = 0;
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
    this.initialEnergy = config.startEnergy || 10;
    this.variables.gems_collected = 0;
    this.movesUsed = 0;
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
      const error = errorMessages.noEnergy;
      throw new Error(`${error.message}|${error.explanation}|${error.tip}`);
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
      const error = errorMessages.hitBoundary;
      throw new Error(`${error.message}|${error.explanation}|${error.tip}`);
    }

    if (this.grid[newY][newX].isWall) {
      const error = errorMessages.hitWall;
      throw new Error(`${error.message}|${error.explanation}|${error.tip}`);
    }

    this.robot.x = newX;
    this.robot.y = newY;
    this.variables.energy--;
    this.movesUsed++;

    return true;
  }

  getEnergyEfficiency() {
    const energyUsed = this.initialEnergy - this.variables.energy;
    const optimalEnergy = this.levelConfig?.optimalEnergy || energyUsed;
    const efficiency = optimalEnergy > 0 ? (optimalEnergy / energyUsed) * 100 : 100;
    return {
      energyUsed,
      optimalEnergy,
      efficiency: Math.min(100, Math.round(efficiency)),
      isOptimal: energyUsed <= optimalEnergy
    };
  }

  pickUp() {
    // 1. Check Current Tile
    if (this.grid[this.robot.y][this.robot.x].hasGem) {
      this.grid[this.robot.y][this.robot.x].hasGem = false;
      this.variables.gems_collected++;
      return true;
    }

    // 2. Check Ahead (Remote Pick)
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

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  reset() {
    const savedFunctions = { ...this.functions };
    const savedSequence = [...this.sequence];
    this.setLevelConfig(this.levelConfig);
    this.functions = savedFunctions;
    this.sequence = savedSequence;
    this.movesUsed = 0;
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
      if (currentTile.isDanger) return false;
      return (
        this.grid[this.robot.y][this.robot.x].hasFlag &&
        this.variables.energy > 0
      );
    }
    return false;
  }
}

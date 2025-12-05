// Core Game Engine
class RobotGame {
    constructor() {
        this.grid = [];
        this.robot = { x: 0, y: 0, direction: 'east' }; // north, east, south, west
        this.variables = {
            energy: 10,
            gems_collected: 0
        };
        this.levelConfig = null;
        this.currentLevel = null;
        this.currentChallenge = null;
        this.animationQueue = [];
        this.isRunning = false;
        this.functions = {}; // Store custom functions
        this.sequence = []; // For function building
    }

    initGrid(size = 5) {
        this.grid = [];
        for (let y = 0; y < size; y++) {
            this.grid[y] = [];
            for (let x = 0; x < size; x++) {
                this.grid[y][x] = {
                    type: 'empty',
                    hasGem: false,
                    hasFlag: false,
                    isWall: false,
                    isSafe: true,
                    isDanger: false
                };
            }
        }
    }

    setLevelConfig(config) {
        this.levelConfig = config;
        this.initGrid(5);
        this.variables.energy = config.startEnergy || 10;
        this.variables.gems_collected = 0;
        this.robot = { ...config.startPos, direction: config.startDirection || 'east' };
        this.functions = {};
        this.sequence = [];

        // Setup grid elements
        if (config.elements) {
            config.elements.forEach(elem => {
                if (elem.type === 'gem') {
                    this.grid[elem.y][elem.x].hasGem = true;
                } else if (elem.type === 'flag') {
                    this.grid[elem.y][elem.x].hasFlag = true;
                } else if (elem.type === 'wall') {
                    this.grid[elem.y][elem.x].isWall = true;
                } else if (elem.type === 'safe') {
                    this.grid[elem.y][elem.x].isSafe = true;
                    this.grid[elem.y][elem.x].isDanger = false;
                } else if (elem.type === 'danger') {
                    this.grid[elem.y][elem.x].isDanger = true;
                    this.grid[elem.y][elem.x].isSafe = false;
                }
            });
        }
    }

    // Robot Actions
    move() {
        if (this.variables.energy <= 0) {
            throw new Error('No energy left!');
        }

        let newX = this.robot.x;
        let newY = this.robot.y;

        switch (this.robot.direction) {
            case 'north': newY--; break;
            case 'east': newX++; break;
            case 'south': newY++; break;
            case 'west': newX--; break;
        }

        // Check bounds
        if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) {
            throw new Error('Robot hit the wall!');
        }

        // Check for wall
        if (this.grid[newY][newX].isWall) {
            throw new Error('Robot hit a wall!');
        }

        this.robot.x = newX;
        this.robot.y = newY;
        this.variables.energy--;

        // Auto-collect gem if present
        if (this.grid[this.robot.y][this.robot.x].hasGem) {
            this.pickUp();
        }

        return true;
    }

    turnLeft() {
        const directions = ['north', 'west', 'south', 'east'];
        const currentIndex = directions.indexOf(this.robot.direction);
        this.robot.direction = directions[(currentIndex + 1) % 4];
    }

    turnRight() {
        const directions = ['north', 'east', 'south', 'west'];
        const currentIndex = directions.indexOf(this.robot.direction);
        this.robot.direction = directions[(currentIndex + 1) % 4];
    }

    pickUp() {
        if (this.grid[this.robot.y][this.robot.x].hasGem) {
            this.grid[this.robot.y][this.robot.x].hasGem = false;
            this.variables.gems_collected++;
            return true;
        }
        return false;
    }

    // Conditions
    gemAhead() {
        let checkX = this.robot.x;
        let checkY = this.robot.y;

        switch (this.robot.direction) {
            case 'north': checkY--; break;
            case 'east': checkX++; break;
            case 'south': checkY++; break;
            case 'west': checkX--; break;
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
            case 'north': checkY--; break;
            case 'east': checkX++; break;
            case 'south': checkY++; break;
            case 'west': checkX--; break;
        }

        if (checkX < 0 || checkX >= 5 || checkY < 0 || checkY >= 5) {
            return false;
        }

        return !this.grid[checkY][checkX].isWall;
    }

    tileIsSafe() {
        return this.grid[this.robot.y][this.robot.x].isSafe;
    }

    // Control Structures
    repeat(count, callback) {
        for (let i = 0; i < count; i++) {
            callback();
        }
    }

    ifCondition(condition, callback) {
        if (condition()) {
            callback();
        }
    }

    whileLoop(condition, callback) {
        while (condition()) {
            callback();
        }
    }

    // Code Execution
    async executeCode(code) {
        this.isRunning = true;
        this.animationQueue = [];

        try {
            // Create a safe execution context
            const game = this;
            const robot = this.robot;
            const vars = this.variables;

            // Helper functions available in code
            const move = () => game.move();
            const turnLeft = () => game.turnLeft();
            const turnRight = () => game.turnRight();
            const pickUp = () => game.pickUp();
            const gemAhead = () => game.gemAhead();
            const pathClear = () => game.pathClear();
            const tileIsSafe = () => game.tileIsSafe();
            const repeat = (n, fn) => game.repeat(n, fn);
            const ifCondition = (cond, fn) => game.ifCondition(cond, fn);
            const whileLoop = (cond, fn) => game.whileLoop(cond, fn);

            // Execute code
            eval(code);

            this.isRunning = false;
            return { success: true };
        } catch (error) {
            this.isRunning = false;
            return { success: false, error: error.message };
        }
    }

    // Parse and execute simple code string
    async executeCodeString(codeString) {
        // Simple parser for our mini language
        const lines = codeString.split('\n').map(l => l.trim()).filter(l => l);

        for (const line of lines) {
            await this.executeLine(line);
        }
    }

    async executeLine(line) {
        // Parse repeat(n) { ... }
        const repeatMatch = line.match(/repeat\s*\(\s*(\d+)\s*\)\s*\{\s*(.+?)\s*\}/);
        if (repeatMatch) {
            const count = parseInt(repeatMatch[1]);
            const actions = repeatMatch[2].split(/\s+/).filter(a => a);
            for (let i = 0; i < count; i++) {
                for (const action of actions) {
                    await this.executeAction(action);
                    await this.delay(300);
                }
            }
            return;
        }

        // Parse if(condition) { ... }
        const ifMatch = line.match(/if\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/);
        if (ifMatch) {
            const condition = ifMatch[1];
            const action = ifMatch[2].trim();
            if (this.checkCondition(condition)) {
                await this.executeAction(action);
                await this.delay(300);
            }
            return;
        }

        // Parse while(condition) { ... }
        const whileMatch = line.match(/while\s*\(\s*(\w+)\s*\(\s*\)\s*\)\s*\{\s*(.+?)\s*\}/);
        if (whileMatch) {
            const condition = whileMatch[1];
            const action = whileMatch[2].trim();
            while (this.checkCondition(condition)) {
                await this.executeAction(action);
                await this.delay(300);
            }
            return;
        }

        // Simple action
        await this.executeAction(line.trim());
        await this.delay(300);
    }

    checkCondition(condition) {
        switch (condition) {
            case 'gemAhead': return this.gemAhead();
            case 'pathClear': return this.pathClear();
            case 'tileIsSafe': return this.tileIsSafe();
            case 'energy > 0': return this.variables.energy > 0;
            default: return false;
        }
    }

    async executeAction(action) {
        switch (action) {
            case 'move()': case 'move':
                this.move();
                break;
            case 'turnLeft()': case 'turnLeft':
                this.turnLeft();
                break;
            case 'turnRight()': case 'turnRight':
                this.turnRight();
                break;
            case 'pickUp()': case 'pickUp':
                this.pickUp();
                break;
        }
        this.updateDisplay();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    reset() {
        // Save functions and sequence before reset
        const savedFunctions = { ...this.functions };
        const savedSequence = [...this.sequence];

        this.setLevelConfig(this.levelConfig);

        // Restore functions and sequence after reset
        this.functions = savedFunctions;
        this.sequence = savedSequence;

        this.updateDisplay();
    }

    checkGoal() {
        if (!this.levelConfig || !this.levelConfig.goal) return false;

        const goal = this.levelConfig.goal;

        if (goal.type === 'reachFlag') {
            return this.grid[this.robot.y][this.robot.x].hasFlag;
        }

        if (goal.type === 'collectGems') {
            return this.variables.gems_collected >= goal.count;
        }

        if (goal.type === 'reachFlagSafely') {
            // Check if robot is on a danger tile - if so, challenge failed
            const currentTile = this.grid[this.robot.y][this.robot.x];
            if (currentTile.isDanger) {
                return false; // Challenge failed - stepped on danger
            }
            return this.grid[this.robot.y][this.robot.x].hasFlag &&
                   this.variables.energy > 0;
        }

        if (goal.type === 'custom' && goal.check) {
            return goal.check();
        }

        return false;
    }

    updateDisplay() {
        // Update variables display
        document.getElementById('energy-value').textContent = this.variables.energy;
        document.getElementById('gems-value').textContent = this.variables.gems_collected;

        // Update grid display
        this.renderGrid();
    }

    renderGrid() {
        const container = document.getElementById('grid-container');
        if (!container) return;

        container.innerHTML = '';

        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';

                const cell = this.grid[y][x];

                if (cell.isSafe && !cell.isDanger) {
                    tile.classList.add('safe');
                } else if (cell.isDanger) {
                    tile.classList.add('danger');
                } else if (cell.isWall) {
                    tile.classList.add('wall');
                }

                let content = '';

                // Add robot
                if (this.robot.x === x && this.robot.y === y) {
                    content += `<span class="robot ${this.robot.direction}">🤖</span>`;
                }

                // Add gem
                if (cell.hasGem) {
                    content += '<span class="gem">💎</span>';
                }

                // Add flag
                if (cell.hasFlag) {
                    content += '<span class="flag">🚩</span>';
                }

                tile.innerHTML = content || '&nbsp;';
                container.appendChild(tile);
            }
        }
    }
}

// Global game instance
const game = new RobotGame();


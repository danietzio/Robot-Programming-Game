# RoboCode — Interactive Grid Programming Game

RoboCode is a fully interactive, browser-based **serious game** designed to teach programming fundamentals through puzzles, visual feedback, and real code execution. It includes multiple levels, a custom mini-programming language, and an animated grid world where players control a robot.

---

## 🎮 Overview

RoboCode helps learners practice and understand:

* Basic commands
* Conditional logic (`if`)
* Loops (`repeat`, `while`)
* Variables
* Function-like sequences (patrol recording)
* Problem solving and debugging

All through a fun, game-based approach.

---

## ✨ Features

### ✔️ **Interactive Grid World**

* Robot movement + rotation
* Walls, gems, flags, colored tiles
* Energy management and resource collection

### ✔️ **Three Complete Levels**

#### **Level 1 — Keywords**

4 small interactive challenges:

* Move to flag
* Looping with UI controls
* Conditionals based on tile color
* Recording a sequence (patrol)

#### **Level 2 — Combination (Fill-in-the-Blank)**

4 code-completion puzzles:

* Missing keywords
* Logic validation
* Auto-runs the correct solution after answering

#### **Level 3 — Creating (Code Editor)**

Type your own code using the mini DSL:

* `move()`
* `pickUp()`
* `turnLeft()` / `turnRight()`
* `repeat(n) { ... }`
* `if(condition) { ... }`
* `while(condition) { ... }`
* `patrol()` (custom user-made function)

Includes:

* Live robot execution
* Basic parser → AST → executor
* Safeguards (infinite loop detection, malformed state prevention)

---

## 🛠️ Technologies

This entire game is implemented using:

* **HTML5** (structure)
* **CSS3** (visual design, dark theme, grid styling)
* **Vanilla JavaScript** (game engine, interpreter, level system)

No external libraries.

---

## 🚀 Getting Started

### **Run Locally**

Clone and open the file:

```bash
git clone https://github.com/danietzio/Robot-Programming-Game.git
cd Robot-Programming-Game
open RoboCode_Game.html   # or double-click
```

### **Optional: Serve with Local Server**

```bash
npx serve
```

Then visit the URL shown.

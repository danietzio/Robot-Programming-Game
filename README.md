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
git clone https://github.com/yourname/robocode-grid.git
cd robocode-grid
open RoboCode_Game.html   # or double-click
```

### **Optional: Serve with Local Server**

```bash
npx serve
```

Then visit the URL shown.

---

## 🧪 Testing & Stability

RoboCode’s code includes defensive programming:

* Ensures `state.walls`, `state.gems`, etc. are always arrays
* Ensures robot and flag are valid before drawing
* Prevents interpreter crashes from malformed code
* Detects infinite loops and stops safely

If you want automated test suites (e.g., Jest), I can generate them.

---

## 🔧 Extending the Project

RoboCode is ideal for enhancements such as:

* More levels / mechanics
* Audio feedback
* Map editor
* Leaderboards / scoring
* React or Svelte rewrite
* Mobile-friendly UI
* Syntax highlighting in code editor

If you want any upgrades, just ask.

---

## 🤝 Contributing

PRs are welcome! You can:

* Add levels
* Improve visuals
* Expand the interpreter
* Fix bugs
* Add accessibility improvements

---

## 📄 License

MIT License. Free for personal, educational, and commercial use.

---

## ❤️ Acknowledgments

This project was created as a **serious educational game** aimed at making coding concepts approachable through interactive problem-solving.

If you use this in a classroom, workshop, or research, feel free to share your story—it helps guide future improvements!

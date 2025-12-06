// Levels System
let currentLevelNum = 1;
let currentChallengeNum = 0;

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
      "Collect 4 gems! Type how many times to repeat the move + collect action.",
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
      goal: { type: "collectGems", count: 4 }, // FIXED: Goal is now 4
    },
    type: "loop",
  },
  {
    title: "Challenge 3: IF",
    description:
      "Reach the flag safely! Choose a direction, then decide whether to use IF. If tile is green, check IF. If tile is red, check IF to prevent moving.",
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
];

// Level 2: Combination (Applying)
const level2Puzzles = [
  {
    title: "Puzzle 1: Loop Keyword",
    description: "Move robot 3 steps forward to reach flag",
    code: "_______(3) {\n  move()\n}",
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
    code: "repeat(___) {\n  move()\n  pickUp()\n}",
    blanks: [{ type: "number", answer: 4, position: 0 }],
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 20,
      elements: [
        { type: "gem", x: 1, y: 2 },
        { type: "gem", x: 2, y: 2 },
        { type: "gem", x: 3, y: 2 },
        { type: "gem", x: 4, y: 2 },
      ],
      goal: { type: "collectGems", count: 4 },
    },
  },
  {
    title: "Puzzle 3: IF Keyword",
    description: "Pick up gem only if one is ahead",
    code: "_______(gemAhead()) {\n  pickUp()\n}",
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
    code: "energy = 10\n_______(energy > 0) {\n  move()\n  energy = energy - 1\n}",
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
];

// Level 3: Supplementation (Creating)
const level3Challenges = [
  {
    title: "Challenge 1: Write a Loop",
    description: "Move robot 4 steps forward to flag",
    hint: "Use repeat(number) { action }",
    expected: "repeat(4) { move() }",
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
    hint: "Use if(condition) { action }, then move to reach flag",
    expected: "if(gemAhead()) { pickUp() }\nrepeat(3) { move() }",
    requiresGemCollection: true,
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [
        { type: "gem", x: 1, y: 2 },
        { type: "flag", x: 4, y: 2 },
      ],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Challenge 3: Write a While Loop",
    description: "Move forward while path is clear to reach the flag",
    hint: "Use while(pathClear()) { action }",
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
];

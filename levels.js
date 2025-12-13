let currentLevelNum = 1;
let currentChallengeNum = 0;

const level1Challenges = [
  {
    title: "Challenge 1: VARIABLE (Movement)",
    description:
      "Use the **Arrow Keys** or buttons to move the robot to the flag.",
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
      "Collect 4 gems! Tell the robot how many times to repeat 'move + pickUp'.",
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
      goal: { type: "collectGems", count: 4 },
    },
    type: "loop",
  },
  {
    title: "Challenge 3: IF (Logic)",
    description:
      "Turn on **Safety Mode**. If Safe: Robot moves. If Danger: Robot waits. (Safety OFF = CRASH).",
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
      "Build a sequence of moves using the arrows, then Save it as a function.",
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

const level2Puzzles = [
  {
    title: "Puzzle 1: Loop Keyword",
    description: "Move robot 3 steps forward to reach flag.",
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
    description: "Collect 4 gems in a row.",
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
    description: "Pick up gem only if one is ahead.",
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
    description: "Move while energy is high.",
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

const level3Challenges = [
  {
    title: "Challenge 1: Write a Loop",
    description: "Write a loop to reach the flag. (Hint: repeat 4 times)",
    hint: "repeat(4) { move() }",
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
    title: "Challenge 2: Logic Check",
    description:
      "Gem ahead! You MUST use 'if(gemAhead())' to pick it up, then reach the flag.",
    hint: "if(gemAhead()) { pickUp() }\nmove()",
    requiresGemCollection: true,
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 10,
      elements: [
        { type: "gem", x: 1, y: 2 },
        { type: "flag", x: 2, y: 2 },
      ],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Challenge 3: Write a While Loop",
    description:
      "Move forward as long as the path is clear to reach the flag. (pathClear() is good condition)",
    hint: "while(pathClear()) { move() }",
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

export const level2Puzzles = [
  {
    title: "Puzzle 1: Loop Keyword",
    description: "Move robot 3 steps forward to reach flag. Choose the right keyword!",
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
      startEnergy: 3, // Exactly 3 moves needed
      optimalEnergy: 3,
      elements: [{ type: "flag", x: 3, y: 2 }],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Puzzle 2: Loop Count",
    description: "Collect 4 gems in a row. Enter the exact number needed!",
    code: "repeat(___) {\n  move()\n  pickUp()\n}",
    blanks: [{ type: "number", answer: 4, position: 0 }],
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 4, // Exactly 4 moves needed
      optimalEnergy: 4,
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
    description: "Pick up gem only if one is ahead. No energy to waste!",
    code: "_______(gemAhead()) {\n  move()\n  pickUp()\n}",
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
      startEnergy: 1, // Only 1 move needed
      optimalEnergy: 1,
      elements: [{ type: "gem", x: 1, y: 2 }],
      goal: { type: "collectGems", count: 1 },
    },
  },
  {
    title: "Puzzle 4: WHILE Keyword",
    description: "Move while energy lasts to reach the flag!",
    code: "energy = 8\n_______(energy > 0) {\n  move()\n  energy = energy - 1\n}",
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
      startEnergy: 8, // Need 4 right + 4 up = 8 moves
      optimalEnergy: 8,
      elements: [{ type: "flag", x: 4, y: 0 }],
      goal: { type: "reachFlag" },
    },
  },
];

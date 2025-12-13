export const level3Challenges = [
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

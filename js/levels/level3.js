export const level3Challenges = [
  {
    title: "Challenge 1: Write a Loop",
    description: "Write a loop to reach the flag. Energy is tight - find the exact count!",
    hint: "repeat(4) { move() }",
    expected: "repeat(4) { move() }",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 4, // Exactly 4 moves needed
      optimalEnergy: 4,
      elements: [{ type: "flag", x: 4, y: 2 }],
      goal: { type: "reachFlag" },
    },
  },
  {
    title: "Challenge 2: Logic Check",
    description:
      "Gem ahead! You MUST use 'if(gemAhead())' to pick it up, then reach the flag. Only 2 energy!",
    hint: "if(gemAhead()) { pickUp() }\nmove()\nmove()",
    requiresGemCollection: true,
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 2, // Need 2 moves to reach flag
      optimalEnergy: 2,
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
      "Move forward as long as the path is clear to reach the flag. Use your energy efficiently!",
    hint: "while(pathClear()) { move() }",
    expected: "while(pathClear()) { move() }",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 3, // Exactly 3 moves to reach flag before wall
      optimalEnergy: 3,
      elements: [
        { type: "wall", x: 4, y: 2 },
        { type: "flag", x: 3, y: 2 },
      ],
      goal: { type: "reachFlag" },
    },
  },
];

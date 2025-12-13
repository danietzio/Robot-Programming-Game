export const level1Challenges = [
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

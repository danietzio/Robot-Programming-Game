export const level1Challenges = [
  {
    title: "Challenge 1: VARIABLE (Movement)",
    description:
      "Use the **Arrow Keys** or buttons to move the robot to the flag. Watch your energy!",
    config: {
      startPos: { x: 0, y: 0 },
      startDirection: "east",
      startEnergy: 8, // Optimal path is 8 moves (4 right + 4 down)
      elements: [{ type: "flag", x: 4, y: 4 }],
      goal: { type: "reachFlag" },
    },
    type: "variable",
  },
  {
    title: "Challenge 2: LOOP",
    description:
      "Collect 4 gems! Tell the robot how many times to repeat 'move + pickUp'. Use energy wisely!",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 4, // Exactly 4 moves needed
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
      "Turn on **Safety Mode**. If Safe: Robot moves. If Danger: Robot waits. Limited energy - no mistakes!",
    config: {
      startPos: { x: 0, y: 2 },
      startDirection: "east",
      startEnergy: 5, // Need to skip danger tile, so 4 moves + 1 buffer
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
      "Build a sequence of moves using the arrows, then Save it as a function. Find the shortest path!",
    config: {
      startPos: { x: 0, y: 0 },
      startDirection: "east",
      startEnergy: 4, // Optimal: 2 right + 2 down = 4 moves
      elements: [{ type: "flag", x: 2, y: 2 }],
      goal: { type: "reachFlag" },
    },
    type: "function",
  },
];

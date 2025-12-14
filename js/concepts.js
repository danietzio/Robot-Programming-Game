// Concept explanations and educational content
export const conceptExplanations = {
  variable: {
    title: "📚 Learning: Variables & Movement",
    explanation: "Variables store information that can change. Here, 'energy' is a variable that decreases each time the robot moves. In real programming, variables help you track data like scores, user input, or game states.",
    whyItMatters: "Variables are the foundation of programming! They let programs remember and update information, making them dynamic and interactive."
  },
  loop: {
    title: "📚 Learning: Loops",
    explanation: "Loops let you repeat actions without typing them many times! Instead of writing 'move()' 10 times, you can use 'repeat(10) { move() }'. This saves time and makes code easier to read and maintain.",
    whyItMatters: "In real programming, loops process lists of data, repeat game actions, and automate repetitive tasks. They're essential for efficient code!"
  },
  if: {
    title: "📚 Learning: Conditional Logic (IF statements)",
    explanation: "IF statements let your program make decisions! 'If the path is safe, then move. If dangerous, then stop.' This is how programs respond to different situations and make smart choices.",
    whyItMatters: "Conditionals power everything from game logic ('if player has enough coins, buy item') to web apps ('if user is logged in, show dashboard'). They make programs intelligent!"
  },
  function: {
    title: "📚 Learning: Functions",
    explanation: "Functions are reusable blocks of code! Instead of repeating the same sequence of moves, you can save it as a function (like 'patrol()') and call it whenever needed. Functions help organize code and avoid repetition.",
    whyItMatters: "Functions are everywhere in programming! They help you write cleaner code, avoid repetition, and build complex programs from simple, reusable pieces."
  },
  repeat: {
    title: "📚 Learning: REPEAT Loops",
    explanation: "REPEAT loops execute code a specific number of times. Use 'repeat(n)' when you know exactly how many times to do something. Perfect for collecting items or moving a fixed distance!",
    whyItMatters: "REPEAT loops are used when processing arrays, running animations frame-by-frame, or performing calculations a set number of times."
  },
  while: {
    title: "📚 Learning: WHILE Loops",
    explanation: "WHILE loops keep running as long as a condition is true! Use 'while(pathClear())' to move until you hit a wall. Unlike REPEAT, you don't need to know the exact number of iterations.",
    whyItMatters: "WHILE loops are perfect for game loops, reading files until the end, or waiting for user input. They handle situations where you don't know how many times to repeat!"
  }
};

export const errorMessages = {
  noEnergy: {
    message: "⚡ You ran out of energy!",
    explanation: "Each move uses 1 energy. Try using a loop to be more efficient! Instead of typing move() many times, use repeat(n) { move() } to save energy.",
    tip: "💡 Tip: Plan your path before moving. Count how many moves you need and use loops!"
  },
  hitWall: {
    message: "🚧 Robot hit a wall!",
    explanation: "The robot can't move through walls. Check your path before moving, or use pathClear() to check if the way is safe before moving.",
    tip: "💡 Tip: Use conditional checks like 'if(pathClear())' to avoid walls!"
  },
  hitBoundary: {
    message: "⚠️ Robot hit the boundary!",
    explanation: "The robot can't move outside the grid. Make sure your moves stay within the 5x5 grid boundaries.",
    tip: "💡 Tip: Check the robot's position before moving. The grid goes from (0,0) to (4,4)."
  },
  wrongAnswer: {
    message: "❌ Incorrect answer!",
    explanation: "Think about what the code needs to do. Read the description carefully and consider what keyword or number would make the code work correctly.",
    tip: "💡 Tip: Trace through the code mentally. What should happen step by step?"
  },
  missingSyntax: {
    message: "🔧 Syntax Error!",
    explanation: "Your code has a syntax mistake. Check for missing braces {}, parentheses (), or typos. Make sure loops and conditionals are properly formatted.",
    tip: "💡 Tip: Every opening brace { needs a closing brace }. Check your code structure!"
  }
};


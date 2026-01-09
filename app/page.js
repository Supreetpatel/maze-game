"use client";

import { useEffect, useState, useCallback } from "react";

// Maze size - Larger for harder difficulty
const ROWS = 25;
const COLS = 25;

// Question bank for checkpoints
const QUESTIONS = [
  {
    question:
      "Which data structure is best suited for implementing a LRU cache?",
    options: [
      "Stack",
      "Queue",
      "HashMap + Doubly Linked List",
      "Binary Search Tree",
    ],
    correct: 2,
  },
  {
    question:
      "What is the primary purpose of virtual memory in an operating system?",
    options: [
      "Increase CPU speed",
      "Store temporary files",
      "Allow programs to use more memory than physically available",
      "Improve network performance",
    ],
    correct: 2,
  },
  {
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PATCH", "PUT", "CONNECT"],
    correct: 2,
  },
  {
    question:
      "Which layer of the OSI model is responsible for encryption and compression?",
    options: ["Transport", "Session", "Presentation", "Application"],
    correct: 2,
  },
  {
    question:
      "In SQL, which command is used to remove all rows from a table but keep the table structure?",
    options: ["DROP", "DELETE", "REMOVE", "TRUNCATE"],
    correct: 3,
  },
  {
    question:
      "What is the time complexity of searching an element in a balanced binary search tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
  },
  {
    question: "Which of the following is not a NoSQL database?",
    options: ["MongoDB", "Cassandra", "Redis", "PostgreSQL"],
    correct: 3,
  },
  {
    question: "What does DNS primarily do?",
    options: [
      "Encrypt data",
      "Route packets",
      "Translate domain names to IP addresses",
      "Authenticate users",
    ],
    correct: 2,
  },
  {
    question:
      "In Git, which command is used to combine multiple commits into one?",
    options: ["git merge", "git rebase", "git stash", "git reset"],
    correct: 1,
  },
  {
    question: "Which programming paradigm does React.js primarily follow?",
    options: [
      "Procedural",
      "Object-Oriented",
      "Declarative",
      "Functional only",
    ],
    correct: 2,
  },
  {
    question: "What is a deadlock in an operating system?",
    options: [
      "When CPU is idle",
      "When two processes wait indefinitely for each other",
      "When a process finishes execution",
      "When memory is full",
    ],
    correct: 1,
  },
  {
    question: "Which of the following is used to style web pages?",
    options: ["HTML", "JavaScript", "CSS", "PHP"],
    correct: 2,
  },
  {
    question: "What is the default port number for HTTPS?",
    options: ["21", "80", "443", "8080"],
    correct: 2,
  },
  {
    question:
      "Which algorithm is commonly used for shortest path in graphs with non-negative weights?",
    options: ["DFS", "BFS", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correct: 2,
  },
  {
    question: "What is the purpose of Docker?",
    options: [
      "Code compilation",
      "Virtualization at hardware level",
      "Containerization of applications",
      "Database management",
    ],
    correct: 2,
  },
  {
    question: "Which type of memory is non-volatile?",
    options: ["RAM", "Cache", "Register", "ROM"],
    correct: 3,
  },
  {
    question: "What does API stand for?",
    options: [
      "Advanced Programming Interface",
      "Application Programming Interface",
      "Automated Program Interaction",
      "Application Process Integration",
    ],
    correct: 1,
  },
  {
    question: "Which of the following best describes Cloud Computing?",
    options: [
      "Running applications only on local machines",
      "Sharing hardware without internet",
      "On-demand delivery of computing resources over the internet",
      "Offline storage system",
    ],
    correct: 2,
  },
  {
    question:
      "Which of the following is a synchronous programming language feature?",
    options: ["Callback", "Promise", "Blocking I/O", "Event Listener"],
    correct: 2,
  },
  {
    question: "What is the main purpose of indexing in databases?",
    options: [
      "Increase storage size",
      "Reduce query execution time",
      "Improve security",
      "Normalize data",
    ],
    correct: 1,
  },
];

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate checkpoints in the maze
function generateCheckpoints(maze, count = 4) {
  const checkpoints = [];
  const paths = [];

  // Find all path cells (not walls, not start, not exit)
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (
        maze[r][c] === 0 &&
        !(r === 1 && c === 1) &&
        !(r === ROWS - 2 && c === COLS - 2)
      ) {
        paths.push({ r, c });
      }
    }
  }

  // Randomly select checkpoint positions
  for (let i = 0; i < Math.min(count, paths.length); i++) {
    const randomIndex = Math.floor(Math.random() * paths.length);
    checkpoints.push(paths[randomIndex]);
    paths.splice(randomIndex, 1);
  }

  return checkpoints;
}

// Generate a random maze using DFS (paths are NOT shown)
function generateMaze(rows, cols) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1)); // 1 = wall, 0 = path
  const directions = [
    [0, 2],
    [0, -2],
    [2, 0],
    [-2, 0],
  ];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(r, c) {
    maze[r][c] = 0;
    shuffle(directions).forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nc > 0 && nr < rows - 1 && nc < cols - 1) {
        if (maze[nr][nc] === 1) {
          maze[r + dr / 2][c + dc / 2] = 0;
          carve(nr, nc);
        }
      }
    });
  }

  carve(1, 1);
  maze[rows - 2][cols - 2] = 0; // exit
  return maze;
}

export default function MazeGame() {
  const [maze, setMaze] = useState(() => generateMaze(ROWS, COLS));
  const [checkpoints, setCheckpoints] = useState(() =>
    generateCheckpoints(generateMaze(ROWS, COLS))
  );
  const [collectedCheckpoints, setCollectedCheckpoints] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState(() =>
    shuffleArray(QUESTIONS)
  );
  const [player, setPlayer] = useState({ r: 1, c: 1 });
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const ADMIN_PASSWORD = "Ko$123#ksac";
  const VIEWPORT_RANGE = 1; // How far the player can see in each direction

  // Initialize checkpoints when maze changes
  useEffect(() => {
    setCheckpoints(generateCheckpoints(maze));
  }, [maze]);

  // Prevent page reload during gameplay
  useEffect(() => {
    if (gameStarted && !showModal) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your progress will be lost!";
        return "Are you sure you want to leave? Your progress will be lost!";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [gameStarted, showModal]);

  // Update elapsed time every second
  useEffect(() => {
    if (!startTime || showModal || showQuestion) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, showModal, showQuestion]);

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetGame = () => {
    if (!isAdmin) {
      alert("Incorrect password!");
      return;
    }
    const newMaze = generateMaze(ROWS, COLS);
    setMaze(newMaze);
    setCheckpoints(generateCheckpoints(newMaze));
    setCollectedCheckpoints([]);
    setShuffledQuestions(shuffleArray(QUESTIONS)); // Shuffle questions for new game
    setPlayer({ r: 1, c: 1 });
    setMessage("");
    setStartTime(null);
    setElapsedTime(0);
    setShowModal(false);
    setPasswordInput("");
    setIsAdmin(false);
    setGameStarted(false);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Incorrect password!");
      setPasswordInput("");
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer!");
      return;
    }

    if (selectedAnswer === currentQuestion.correct) {
      // Correct answer
      setShowQuestion(false);
      setCurrentQuestion(null);
      setSelectedAnswer(null);
    } else {
      // Wrong answer - game over or penalty
      alert("Wrong answer! Try again.");
      setSelectedAnswer(null);
    }
  };

  const move = useCallback(
    (dr, dc) => {
      if (!maze.length || showModal || !gameStarted || showQuestion) return;

      const nr = player.r + dr;
      const nc = player.c + dc;

      if (maze[nr] && maze[nr][nc] === 0) {
        // Check if trying to reach endpoint without all checkpoints
        if (nr === ROWS - 2 && nc === COLS - 2) {
          if (collectedCheckpoints.length < checkpoints.length) {
            alert(
              `🔒 Exit locked! Collect all ${checkpoints.length} checkpoints first. (${collectedCheckpoints.length}/${checkpoints.length} completed)`
            );
            return;
          } else {
            setMessage("🎉 You escaped the maze!");
            setShowModal(true);
            setPlayer({ r: nr, c: nc });
            return;
          }
        }

        setPlayer({ r: nr, c: nc });

        // Check if player reached a checkpoint
        const checkpointIndex = checkpoints.findIndex(
          (cp) => cp.r === nr && cp.c === nc
        );

        if (
          checkpointIndex !== -1 &&
          !collectedCheckpoints.includes(checkpointIndex)
        ) {
          // Player reached a new checkpoint - use shuffled questions
          setCollectedCheckpoints([...collectedCheckpoints, checkpointIndex]);
          const questionIndex =
            collectedCheckpoints.length % shuffledQuestions.length;
          setCurrentQuestion(shuffledQuestions[questionIndex]);
          setShowQuestion(true);
          return;
        }
      }
    },
    [
      maze,
      player,
      showModal,
      gameStarted,
      showQuestion,
      checkpoints,
      collectedCheckpoints,
      shuffledQuestions,
    ]
  );

  useEffect(() => {
    function handleKey(e) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp") move(-1, 0);
      if (e.key === "ArrowDown") move(1, 0);
      if (e.key === "ArrowLeft") move(0, -1);
      if (e.key === "ArrowRight") move(0, 1);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move, shuffledQuestions]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">Pac-Maze Game</h1>
      <p className="text-sm mb-2 text-gray-400">
        Navigate through the maze like Pac-Man!
      </p>

      {/* Start Screen */}
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center gap-6 mt-12">
          <button
            onClick={startGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-2xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            🎮 START GAME
          </button>
          <p className="text-gray-500 text-sm mt-4">Use arrow keys to move</p>
        </div>
      ) : (
        <>
          {/* Timer and Checkpoint Progress Display */}
          <div className="mb-4 flex gap-6 items-center">
            <div className="text-2xl font-bold text-yellow-400">
              ⏱️ Time: {formatTime(elapsedTime)}
            </div>
            <div className="text-xl font-bold text-cyan-400">
              🎯 Checkpoints: {collectedCheckpoints.length}/{checkpoints.length}
            </div>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 15px)`,
              gridTemplateRows: `repeat(${ROWS}, 15px)`,
            }}
          >
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = r === player.r && c === player.c;
                const isExit = r === ROWS - 2 && c === COLS - 2;
                const isWall = cell === 1;
                const allCheckpointsCollected =
                  collectedCheckpoints.length === checkpoints.length;

                // Check if cell is within viewport range of player
                const isVisible =
                  Math.abs(r - player.r) <= VIEWPORT_RANGE &&
                  Math.abs(c - player.c) <= VIEWPORT_RANGE;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={
                      "w-4 h-4 border border-gray-800 flex items-center justify-center text-xs " +
                      (isVisible
                        ? isPlayer
                          ? "bg-yellow-400"
                          : isExit && allCheckpointsCollected
                          ? "bg-red-500"
                          : isWall
                          ? "bg-blue-900"
                          : "bg-black"
                        : "bg-gray-900")
                    }
                  >
                    {isPlayer && "●"}
                    {isExit && isVisible && allCheckpointsCollected && "★"}
                  </div>
                );
              })
            )}
          </div>

          {message && (
            <p className="mt-6 text-2xl text-yellow-400 font-bold">{message}</p>
          )}

          <p className="mt-4 text-xs text-gray-500">
            {collectedCheckpoints.length < checkpoints.length
              ? `Find all ${checkpoints.length} hidden checkpoints to unlock the exit!`
              : "Exit unlocked! Find the red star to escape!"}
          </p>
        </>
      )}

      {/* Completion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 text-center max-w-sm">
            <h2 className="text-3xl font-bold text-green-400 mb-6">
              Maze Completed!
            </h2>
            <p className="text-xl mb-4 text-gray-300">
              Time Taken:{" "}
              <span className="text-blue-400 font-bold">
                {formatTime(elapsedTime)}
              </span>
            </p>
            <p className="text-sm mb-4 text-yellow-400">
              Checkpoints Collected: {collectedCheckpoints.length}/
              {checkpoints.length}
            </p>

            {!isAdmin ? (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">
                  Enter admin password to reset:
                </p>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handlePasswordSubmit()
                  }
                  placeholder="Enter password"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white mb-3"
                />
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3"
                >
                  Submit Password
                </button>
              </div>
            ) : (
              <button
                onClick={resetGame}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg cursor-pointer"
              >
                Reset Game
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Modal for Checkpoints */}
      {showQuestion && currentQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              🎯 Checkpoint Challenge!
            </h2>
            <p className="text-lg mb-6 text-white">
              {currentQuestion.question}
            </p>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full py-3 px-4 rounded text-left transition-all ${
                    selectedAnswer === index
                      ? "bg-yellow-600 text-black font-bold"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleAnswerSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const findBoardSize = (
  difficultyLevel: "beginner" | "intermediate" | "expert"
): { boardSize: number; numberOfMines: number } => {
  switch (difficultyLevel) {
    case "beginner":
      return { boardSize: 8, numberOfMines: 10 };

    case "intermediate":
      return { boardSize: 10, numberOfMines: 25 };

    case "expert":
      return { boardSize: 12, numberOfMines: 40 };
  }
};
export { findBoardSize };

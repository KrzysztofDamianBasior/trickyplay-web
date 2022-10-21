const findBoardSize = (
  difficultyLevel: "beginner" | "intermediate" | "expert"
): { boardSize: number; numberOfMines: number } => {
  switch (difficultyLevel) {
    case "beginner":
      return { boardSize: 8, numberOfMines: 10 };

    case "intermediate":
      return { boardSize: 12, numberOfMines: 40 };

    case "expert":
      return { boardSize: 16, numberOfMines: 70 };
  }
};
export { findBoardSize };

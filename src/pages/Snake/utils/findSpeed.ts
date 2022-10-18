export const findSpeed = (
  difficultyLevel: "easy" | "medium" | "hard"
): number => {
  switch (difficultyLevel) {
    case "easy":
      return 400;
    case "medium":
      return 300;
    case "hard":
      return 200;
  }
};

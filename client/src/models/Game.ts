export interface Game {
  id: string;
  maskedWord: string;
  guesses: string[];
  isCorrect: boolean;
  isComplete: boolean;
  isWinner: boolean;
  solution: string;
  guessesRemaining: number;
}

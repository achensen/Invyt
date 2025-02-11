import { Schema, model, type Document } from 'mongoose';

interface IGame extends Document {
  wordId: Schema.Types.ObjectId;
  maskedWord: string;
  solution: string;
  guesses: string[];
  numBadGuesses: number;
  isComplete: boolean;
  isWinner: boolean;
}

// Define the schema for the Game document
const gameSchema = new Schema<IGame>(
  {
    wordId: {
      type: Schema.Types.ObjectId,
      ref: 'Word',
      required: true
    },
    maskedWord: {
      type: String,
      required: true
    },
    solution: {
      type: String,
      required: true
    },
    guesses: {
      type: [String],
      default: []
    },
    numBadGuesses: {
      type: Number,
      default: 0
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    isWinner: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Game = model<IGame>('Game', gameSchema);

export { type IGame, Game };

import { Word, Game } from '../models/index.js';

const cleanDB = async (): Promise<void> => {
  try {
    await Game.deleteMany({});
    console.log('Game collection cleaned.');

    await Word.deleteMany({});
    console.log('Word collection cleaned.');

  } catch (err) {
    console.error('Error cleaning collections:', err);
    process.exit(1);
  }
};

export default cleanDB;

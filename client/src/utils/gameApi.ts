import type { Game } from '../models/Game.js';

export const getInitialGameState = async (): Promise<Game> => {
  try {
    const response = await fetch('/api/game/start', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error('Check the Network tab.');
    }
    const data: Game = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch game start:', error);
    throw error;
  }
};

export const checkLetter = async (gameId: string, guessData: { letter: string }): Promise<Game> => {
  try {
    const response = await fetch(`/api/game/${gameId}/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guessData)
    });
    if (!response.ok) {
      throw new Error('Check the Network tab.');
    }
    const data: Game = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch check letter:', error);
    throw error;
  }
};

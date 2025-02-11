import { mockState } from '../support/utils/helpers';
import { Responses } from '../support/types';

describe('Word Guess Game Cycle', () => {
  context('Game Setup', () => {
    beforeEach(() => {
      // Stub the API request for starting the game
      cy.intercept('GET', '/api/game/start', {
        statusCode: 200,
        body: mockState, // Using the mocked guess data
      }).as('getRandomWord');

      // Visit the game page
      cy.visit('/');
    });

    it('should GET a random word with masked letters on page load and render the masked word to the page', () => {
      // Wait for the API call to complete
      cy.wait('@getRandomWord').its('response.statusCode').should('eq', 200);

      // Check if the masked word is rendered on the page
      cy.get('[data-cy="masked-word"]').should('contain', mockState.maskedWord);
    });
  });

  context('User Guessing', () => {
    beforeEach(() => {
      // Stub the API request for starting the game
      cy.intercept('GET', '/api/game/start', {
        statusCode: 200,
        body: mockState, // Using the mocked guess data
      }).as('getRandomWord');

      // Mapping object to handle responses based on guessed letters
      const responses: Responses = {
        t: {
          maskedWord: 'T__t',
          isComplete: false,
          isCorrect: true,
          isWinner: false,
          solution: mockState.solution,
          guessesRemaining: 9,
        },
        e: {
          maskedWord: 'Te_t',
          isComplete: false,
          isCorrect: true,
          isWinner: false,
          solution: mockState.solution,
          guessesRemaining: 9,
        },
        s: {
          maskedWord: 'Test',
          isComplete: true,
          isCorrect: true,
          isWinner: true,
          solution: mockState.solution,
          guessesRemaining: 9,
        },
        a: {
          maskedWord: 'Test',
          isComplete: true,
          isCorrect: false,
          isWinner: false,
          solution: mockState.solution,
          guessesRemaining: 0,
        },
      };

      // Stub the API request for guessing a letter
      cy.intercept('POST', `/api/game/${mockState.id}/guess`, (req) => {
        const letter: string = req.body.letter.toLowerCase();
        const response = responses[letter];

        req.reply({
          statusCode: 200,
          body: response,
        });
      }).as('guessLetter');

      // Visit the game page
      cy.visit('/');
    });

    it('should update the masked word correctly for each guessed letter, the amount of guesses remaining should not change, and complete the game on correct guesses showing the win screen', () => {
      // Wait for the API call to complete
      cy.wait('@getRandomWord').its('response.statusCode').should('eq', 200);

      cy.get('[data-cy="masked-word"]').as('maskedWord');
      cy.get('[data-cy="countdown"]').as('guessesRemaining');

      cy.get('@maskedWord').should('contain', '____');
      cy.get('@guessesRemaining').should('contain', '9');

      // Guess the letter 't'
      cy.get('[data-cy=t]').should('exist').and('have.value', 't').click();
      cy.wait('@guessLetter').its('response.statusCode').should('eq', 200);
      cy.get('@maskedWord').should('contain', 'T__t');

      cy.get('@guessesRemaining').should('contain', '9');

      // Guess the letter 'e'
      cy.get('[data-cy=e]').should('exist').and('have.value', 'e').click();
      cy.wait('@guessLetter').its('response.statusCode').should('eq', 200);
      cy.get('@maskedWord').should('contain', 'Te_t');
      cy.get('@guessesRemaining').should('contain', '9');

      // Guess the letter 's'
      cy.get('[data-cy=s]').should('exist').and('have.value', 's').click();
      cy.wait('@guessLetter').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body)
          .to.have.property('isComplete')
          .and.to.eq(true);
        expect(interception.response.body)
          .to.have.property('isWinner')
          .and.to.eq(true);
        expect(interception.response.body)
          .to.have.property('guessesRemaining')
          .and.to.eq(9);
      });

      // Check if the winning message is displayed
      cy.contains('You won!').should('be.visible');
    });

    it('should show a loss message when the game is complete but the word contains underscores', () => {
        // Wait for the API call to complete
      cy.wait('@getRandomWord').its('response.statusCode').should('eq', 200);

      // Simulate final incorrect guess
      cy.get('[data-cy=a]').click();
      cy.wait('@guessLetter').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body)
          .to.have.property('isComplete')
          .and.to.eq(true);
        expect(interception.response.body)
          .to.have.property('isWinner')
          .and.to.eq(false);
        expect(interception.response.body)
          .to.have.property('guessesRemaining')
          .and.to.eq(0);
      });

      // Check if the winning message is displayed
      cy.contains('You lost!').should('be.visible');
    });
  });

  context('Game Restart', () => {
    beforeEach(() => {
      // Stub the API request for starting the game
      cy.intercept('GET', '/api/game/start', {
        statusCode: 200,
        body: mockState, // Using the mocked guess data
      }).as('getRandomWord');

      // Stub the API request for guessing a letter
      cy.intercept('POST', `/api/game/${mockState.id}/guess`, {
        statusCode: 200,
        body: {
          maskedWord: 'Test',
          isComplete: true,
          isCorrect: true,
          isWinner: true,
          solution: mockState.solution,
          guessesRemaining: 6,
        },
      }).as('guessLetter');

      // Visit the game page
      cy.visit('/');
    });

    it('should reload the game when the user clicks the "Play Again" button', () => {
      // Wait for the API call to complete
      cy.wait('@getRandomWord').its('response.statusCode').should('eq', 200);

      // Simulate final correct guess
      cy.get('[data-cy=s]').click();
      cy.wait('@guessLetter');

      // Check if the winning message is displayed
      cy.contains('You won!').should('be.visible');

      // Click the "Play Again" button
      cy.get('[data-cy=reload-button]').click();

      // Check if the game area is visible
      cy.get('[data-cy=game-area]').should('be.visible');
    });
  });
});

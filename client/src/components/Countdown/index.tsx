interface CountdownProps {
  guesses?: number;
  isCorrect?: boolean;
  hasGuessed: boolean;
}

const Countdown = ({ guesses, isCorrect, hasGuessed }: CountdownProps) => {
  console.log('isCorrect', isCorrect)
  return (
    <div className="countdown flex-row justify-space-evenly">
      <h3 data-cy="countdown">Guesses Remaining: <span id="guesses-remaining">{guesses}</span></h3>
      {hasGuessed && (
        <h3 data-cy="toast">
          {isCorrect ? <span className="toast-success">Correct!</span> : <span className="toast-fail">Incorrect!</span>}
        </h3>
      )}
    </div>
  );
}

export default Countdown;

interface KeyboardProps {
  handleGuess: (event: React.MouseEvent<HTMLButtonElement>) => void;
  guesses: string[];
  KEYS: string[];
}

const Keyboard = ({handleGuess, guesses, KEYS}: KeyboardProps) => {

  return (
    <div data-cy="keyboard" className="button-grid">
      {KEYS.map(key => {
        const isGuessed = guesses.includes(key)
        return (
          <button className="btn btn-default mx-1 my-1 custom-btn"
            type="button"
            onClick={handleGuess}
            data-cy={key}
            key={key}
            value={key}
            disabled={isGuessed}
            style={isGuessed ? { opacity: 0 } : undefined}
          >{key.toUpperCase()}</button>
        )
      })}
    </div>

  )
}

export default Keyboard;

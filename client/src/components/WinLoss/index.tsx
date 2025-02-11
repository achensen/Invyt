interface WinLossProps {
  isWinner: boolean;
  solution?: string;
}

const WinLoss = ({ isWinner, solution }: WinLossProps) => {
  return (
    <div className="flex-column justify-center mb-3 p-3">
      {isWinner ? <h2 data-cy="win-loss-heading" className="text-center" style={{color: 'green'}}>You won!</h2> : <h2 data-cy="win-loss-heading" className="text-center" style={{color: 'red'}}>You lost!</h2>}
      <h3 data-cy="win-loss-solution" className="text-center">The solution was: {solution}</h3>
      <button data-cy="reload-button" className="btn btn-primary mt-5" type="button" onClick={() => window.location.reload()}>Play Again</button>
    </div>
  )
}

export default WinLoss;

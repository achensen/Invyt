interface WordProps {
  word: string;
}
const Word = ({ word }: WordProps) => {

  return (
    <div>
      <h1 data-cy="masked-word" className="text-center" style={{fontSize: "7.5rem", letterSpacing: "10px"}}>{word}</h1>
    </div>
  );
};

export default Word;

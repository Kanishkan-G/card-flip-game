import { useState } from "react";
import "./App.css";
import cardData from "./cardData";

const shuffleCards = (cards) => {
  return [...cards].sort(() => Math.random() - 0.5);
};

function App() {
  const [cards, setCards] = useState(shuffleCards(cardData));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  const TOTAL_PAIRS = cardData.length / 2;

  const handleCardClick = (card) => {
    if (
      selectedCards.length === 2 ||
      selectedCards.includes(card) ||
      matchedPairs.includes(card.pairId)
    ) return;

    const newSelection = [...selectedCards, card];
    setSelectedCards(newSelection);

    if (newSelection.length === 2) {
      setAttempts((prev) => prev + 1);

      if (newSelection[0].pairId === newSelection[1].pairId) {
        setMatchedPairs((prev) => [...prev, card.pairId]);
      }

      setTimeout(() => setSelectedCards([]), 700);
    }
  };

  const isVisible = (card) =>
    selectedCards.includes(card) || matchedPairs.includes(card.pairId);

  const calculateScore = () =>
    Math.max(0, Math.min(100, Math.round((TOTAL_PAIRS / attempts) * 100)));

  const gameCompleted = matchedPairs.length === TOTAL_PAIRS;

  if (gameCompleted && score === 0 && attempts > 0) {
    setScore(calculateScore());
  }

  const startNewGame = () => {
    setCards(shuffleCards(cardData));
    setSelectedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
  };

  return (
    <div className="app">
      <h1 className="game-title">🃏 Memory Match Game</h1>
      <div className="stats">
        Attempts: {attempts} | Score: {score}
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              matchedPairs.includes(card.pairId)
                ? "matched"
                : isVisible(card)
                ? ""
                : "hidden"
            }`}
            onClick={() => handleCardClick(card)}
          >
            {isVisible(card) ? card.text : "❓"}
          </div>
        ))}
      </div>

      {gameCompleted && (
        <div className="result">
          <h2>🎉 You Win!</h2>
          <p>Total Attempts: <b>{attempts}</b></p>
          <p>Final Score: <b>{score} / 100</b></p>

          <button className="restart-btn" onClick={startNewGame}>
            🔄 Start New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import "./App.css";
import cardData from "./cardData";
import Hyperspeed from "./components/Hyperspeed/Hyperspeed";

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
  const gameCompleted = matchedPairs.length === TOTAL_PAIRS;

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

  useEffect(() => {
    if (gameCompleted && attempts > 0) {
      setScore(calculateScore());
    }
  }, [gameCompleted, attempts]);

  const startNewGame = () => {
    setCards(shuffleCards(cardData));
    setSelectedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
  };

  return (
    <div className="app-wrapper">

      {/* 👤 Credit Card */}
      <div className="creator-card">
        🎮 Game created by <span>Kanishkan G</span>
      </div>

      {/* 🌌 Hyperspeed Background */}
      <div className="background-layer">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0xffffff,
              brokenLines: 0xffffff,
              leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
              rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
              sticks: 0x03b3c3
            }
          }}
        />
      </div>

      {/* 🎮 Game UI */}
      <div className="app">
        <h1 className="game-title">Memory Match Game</h1>

        <div className="stats">
          Attempts: {attempts} | Score: {score}
        </div>

        <div className="grid">
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
    </div>
  );
}

export default App;
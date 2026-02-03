import { useState, useEffect } from "react";
import "./App.css";
import cardData from "./cardData";

// ✅ API Gateway URL
const API_URL =
  "https://p6rv5j3f4j.execute-api.ap-northeast-1.amazonaws.com/prod/leaderboard";

const shuffleCards = (cards) => {
  return [...cards].sort(() => Math.random() - 0.5);
};

function App() {
  const [cards, setCards] = useState(shuffleCards(cardData));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);

  const TOTAL_PAIRS = cardData.length / 2;
  const gameCompleted = matchedPairs.length === TOTAL_PAIRS;

  // 🔄 Fetch leaderboard
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch(() => {});
  }, []);

  const handleCardClick = (card) => {
    if (!gameStarted) return;

    if (
      selectedCards.length === 2 ||
      selectedCards.includes(card) ||
      matchedPairs.includes(card.pairId)
    )
      return;

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
    if (gameCompleted && attempts > 0 && playerName) {
      const finalScore = calculateScore();
      setScore(finalScore);

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName, score: finalScore, attempts })
      })
        .then(() => fetch(API_URL))
        .then((res) => res.json())
        .then((data) => setLeaderboard(data))
        .catch(() => {});
    }
  }, [gameCompleted]);

  const startGame = () => {
    if (!playerName.trim()) return;
    setGameStarted(true);
  };

  const startNewGame = () => {
    setCards(shuffleCards(cardData));
    setSelectedCards([]);
    setMatchedPairs([]);
    setAttempts(0);
    setScore(0);
    setGameStarted(false);
  };

  return (
    <div className="app-wrapper">
      <div className="creator-card">
        🎮 Game created by <span>Kanishkan G</span>
      </div>

      <div className="app">
        <h1 className="game-title">🃏 Memory Match Game</h1>

        {!gameStarted && (
          <div className="start-overlay">
            <div className="start-box">
              <input
                className="player-input"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button className="start-btn" onClick={startGame}>
                ▶ START GAME
              </button>
            </div>
          </div>
        )}

        {gameStarted && (
          <>
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
          </>
        )}

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

        <div className="leaderboard">
          <h3>🏆 Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <p className="empty">No scores yet</p>
          ) : (
            <ul>
              {leaderboard.map((entry, index) => (
                <li key={index}>
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{entry.playerName}</span>
                  <span className="score">{entry.score}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
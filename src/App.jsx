// App.jsx
import { useState } from "react";
import PreGameScreen from "./components/PreGameScreen";
import ScoreTable from "./components/ScoreTable";
import EndGameSummary from "./components/EndGameSummary";
import PlayerReorderModal from "./components/PlayerReorderModal";

function App() {
  const [players, setPlayers] = useState([]);
  const [maxPoints, setMaxPoints] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [nextDealerId, setNextDealerId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [tempReorder, setTempReorder] = useState([]);
  const [diezMenosRecords, setDiezMenosRecords] = useState({});

  const resolveActualDealer = (players, nextDealerId) => {
    const jugador = players.find((p) => p.id === nextDealerId);
    if (jugador && !jugador.isOut && !jugador.disabled) return jugador.id;

    const activos = players.filter((p) => !p.isOut && !p.disabled);
    if (activos.length === 0) return null;

    const index = players.findIndex((p) => p.id === nextDealerId);
    for (let i = 1; i < players.length; i++) {
      const siguiente = players[(index + i) % players.length];
      if (!siguiente.isOut && !siguiente.disabled) return siguiente.id;
    }

    return null;
  };

  const checkForWinner = (jugadores) => {
    const activos = jugadores.filter((p) => !p.isOut && !p.disabled);
    if (activos.length === 1) {
      setWinner(activos[0]);
    }
  };

  const handleAddPlayer = (name) => {
    const nuevoJugador = {
      id: Date.now(),
      name,
      scores: [],
      total: 0,
      isOut: gameStarted,
      enganches: 0,
      disabled: false,
    };
    setPlayers((prev) => [...prev, nuevoJugador]);
  };

  const handleEditPlayer = (id, newName) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleDeletePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStartGame = (limit, dealerId) => {
    setMaxPoints(limit);
    setGameStarted(true);
    setNextDealerId(dealerId || players[0]?.id || null);
  };

  const handleNewRound = (points) => {
    const updatedPlayers = players.map((p) => {
      if (p.disabled) return p;
      const score = points[p.id] ?? 0;
      const newTotal = p.total + score;

      return {
        ...p,
        total: newTotal,
        isOut: newTotal >= maxPoints,
        scores: [...(p.scores ?? []), score],
      };
    });

    setPlayers(updatedPlayers);
    setRounds((prev) => [...prev, points]);
    setDiezMenosRecords((prev) => ({ ...prev, [rounds.length]: [] }));
    checkForWinner(updatedPlayers);

    const dealerIndex = players.findIndex((p) => p.id === nextDealerId);
    for (let i = 1; i <= players.length; i++) {
      const siguiente = players[(dealerIndex + i) % players.length];
      if (!siguiente.isOut && !siguiente.disabled) {
        setNextDealerId(siguiente.id);
        break;
      }
    }
  };

  const handleResetGame = () => {
    const resetPlayers = players.map((p) => ({
      ...p,
      scores: [],
      total: 0,
      isOut: false,
      enganches: 0,
      disabled: false,
    }));

    setPlayers(resetPlayers);
    setRounds([]);
    setGameStarted(false);
    setNextDealerId(null);
    setWinner(null);
    setDiezMenosRecords({});
  };

  const handleForceEnd = () => {
    const jugadoresActivos = players.filter((p) => !p.isOut && !p.disabled);
    if (jugadoresActivos.length === 0) {
      alert("No hay jugadores activos para finalizar la partida.");
      return;
    }

    const menor = jugadoresActivos.reduce((min, p) =>
      p.total < min.total ? p : min
    );

    setWinner(menor);
  };

  const handleEnganchar = (id) => {
    const maxScore = Math.max(
      ...players
        .filter((p) => p.id !== id && !p.disabled && !p.isOut)
        .map((p) => p.total)
    );

    const updatedPlayers = players.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          total: maxScore,
          isOut: false,
          enganches: (p.enganches || 0) + 1,
        };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    checkForWinner(updatedPlayers);
  };

  const handleAddNewPlayerDuringGame = (name) => {
    if (!name) return;

    const maxScore = Math.max(
      ...players.filter((p) => !p.disabled).map((p) => p.total)
    );

    const newPlayer = {
      id: Date.now(),
      name,
      scores: [],
      total: maxScore,
      isOut: false,
      enganches: 1,
      disabled: false,
    };

    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleToggleDisable = (id) => {
    const updatedPlayers = players.map((p) =>
      p.id === id ? { ...p, disabled: !p.disabled } : p
    );
    setPlayers(updatedPlayers);
    checkForWinner(updatedPlayers);
  };

  const openReorderModal = () => {
    setTempReorder(players);
    setShowReorderModal(true);
  };

  const confirmReorder = () => {
    setPlayers(tempReorder);
    setShowReorderModal(false);
  };

  const cancelReorder = () => {
    setTempReorder([]);
    setShowReorderModal(false);
  };

  const handleApplyDiezMenos = (playerId) => {
    const currentRoundIndex = rounds.length;
    if (diezMenosRecords[currentRoundIndex]?.includes(playerId)) return;

    const updatedPlayers = players.map((p) =>
      p.id === playerId ? { ...p, total: p.total - 10 } : p
    );
    setPlayers(updatedPlayers);

    setDiezMenosRecords((prev) => {
      const updated = { ...prev };
      if (!updated[currentRoundIndex]) {
        updated[currentRoundIndex] = [];
      }
      updated[currentRoundIndex].push(playerId);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <h1 className="text-3xl font-bold text-center mb-6">Anotador Loba</h1>

      {!gameStarted ? (
        <PreGameScreen
          players={players}
          onAddPlayer={handleAddPlayer}
          onStartGame={handleStartGame}
          onEditPlayer={handleEditPlayer}
          onDeletePlayer={handleDeletePlayer}
        />
      ) : (
        <>
          <ScoreTable
            players={players}
            rounds={rounds}
            dealerId={resolveActualDealer(players, nextDealerId)}
            onSubmitRound={handleNewRound}
            onEnganchar={handleEnganchar}
            onForceEnd={handleForceEnd}
            onAddNewPlayer={handleAddNewPlayerDuringGame}
            onReorderClick={openReorderModal}
            onToggleDisable={handleToggleDisable}
            onApplyDiezMenos={handleApplyDiezMenos}
            lastRoundDiezMenos={diezMenosRecords}
          />

          {winner && (
            <EndGameSummary
              players={players}
              winner={winner}
              rounds={rounds}
              onReset={handleResetGame}
            />
          )}

          {showReorderModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 z-0"
                onClick={cancelReorder}
              ></div>
              <div className="bg-white p-4 rounded shadow-lg w-full max-w-md z-10 relative">
                <h2 className="text-lg font-semibold mb-2 text-center">
                  Reordenar jugadores
                </h2>

                <PlayerReorderModal
                  players={tempReorder}
                  onReorder={setTempReorder}
                  onCancel={cancelReorder}
                  onConfirm={confirmReorder}
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-50 pointer-events-none select-none">
        Hecho por Maxi
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import RoundInput from "./RoundInput";
import ScoreTable from "./ScoreTable";

function GameScreen({
  players,
  rounds,
  dealerId,
  onSubmitRound,
  onEnganchar,
  onAddPlayer,
  winner,
  onReset,
}) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName("");
      setShowAddPlayer(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Rondas</h2>

      <ScoreTable players={players} rounds={rounds} dealerId={dealerId} />

      <div className="my-6">
        <RoundInput
          players={players.filter((p) => !p.isOut)}
          onSubmit={onSubmitRound}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Totales</h3>
        <ul className="grid gap-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border-b pb-1"
            >
              <span>
                {p.name}
                {p.enganches > 0 && (
                  <span className="ml-2 text-xs text-yellow-600">
                    (Enganche x{p.enganches})
                  </span>
                )}
                {p.id === dealerId && (
                  <span className="ml-2 text-sm text-blue-600">🔄 reparte</span>
                )}
                {p.isOut && (
                  <span className="ml-2 text-red-500 text-sm">🛑 fuera</span>
                )}
              </span>

              {p.isOut && (
                <button
                  onClick={() => onEnganchar(p.id)}
                  className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Enganchar
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        {showAddPlayer ? (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Nuevo jugador"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <button
              onClick={handleAddPlayer}
              className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
            >
              Añadir
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddPlayer(true)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Agregar jugador
          </button>
        )}
      </div>

      {winner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm text-center">
            <h2 className="text-xl font-bold mb-2">
              🎉 {winner.name} ha ganado 🎉
            </h2>
            <button
              onClick={onReset}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Jugar otra partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameScreen;

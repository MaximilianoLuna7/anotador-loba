import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function PreGameScreen({
  players,
  onAddPlayer,
  onStartGame,
  onEditPlayer,
  onDeletePlayer,
}) {
  const [playerName, setPlayerName] = useState("");
  const [limit, setLimit] = useState(100);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealerId, setDealerId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName("");
    }
  };

  const handleStart = () => {
    const limitValue = limit;
    const selectedDealerId = dealerId || players[0]?.id;
    onStartGame(limitValue, selectedDealerId);
  };

  const handleEditConfirm = (id) => {
    if (editingName.trim()) {
      onEditPlayer(id, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleDeleteHistory = () => {
    localStorage.removeItem("historialLoba");
    setShowHistory(false);
    setShowDeleteConfirm(false);
  };

  const historial = JSON.parse(localStorage.getItem("historialLoba") || "[]");

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Configuración de partida
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Nombre del jugador"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Añadir
        </button>
      </form>

      <ul className="mb-4 space-y-2">
        {players.map((player, index) => (
          <li
            key={player.id}
            className="flex items-center justify-between border-b pb-1"
          >
            {editingId === player.id ? (
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() => handleEditConfirm(player.id)}
                  className="text-green-600 text-sm font-semibold"
                >
                  ✔️
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName("");
                  }}
                  className="text-gray-500 text-sm font-semibold"
                >
                  ✖️
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1">
                  {index + 1}. {player.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(player.id);
                      setEditingName(player.name);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeletePlayer(player.id)}
                    className="text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">
          Límite de puntos:
        </label>
        <input
          type="number"
          min={1}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {players.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            ¿Quién reparte primero?
          </label>
          <select
            value={dealerId || ""}
            onChange={(e) => setDealerId(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="" disabled>
              Seleccionar jugador
            </option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={players.length < 2}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        Iniciar partida
      </button>

      <div className="text-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-700 underline mb-2"
        >
          {showHistory ? "Ocultar historial" : "Ver historial de partidas"}
        </button>

        {showHistory && (
          <div className="mt-2 text-sm bg-gray-100 p-3 rounded max-h-64 overflow-y-auto">
            {historial.length === 0 ? (
              <p>No hay partidas registradas.</p>
            ) : (
              <ul className="space-y-2">
                {historial.map((h, i) => (
                  <li key={i} className="border-b pb-1">
                    <div className="flex justify-between items-start">
                      <span>
                        <strong>
                          {formatDistanceToNow(parseISO(h.fecha), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </strong>
                        {" — Ganó "}
                        <span className="font-semibold">{h.ganador}</span>
                        {` con ${h.puntajeGanador} puntos. Rondas: ${h.rondasJugadas}`}
                      </span>
                      {h.detalle && (
                        <button
                          onClick={() => setSelectedDetail(h.detalle)}
                          className="text-xs text-blue-600 underline ml-2"
                        >
                          Ver detalles
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-3 text-xs text-red-600 underline"
            >
              Borrar historial
            </button>
          </div>
        )}

        {selectedDetail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow max-w-md w-full text-sm">
              <h3 className="text-lg font-semibold text-center mb-3">
                Detalles de la partida
              </h3>
              <pre className="text-left whitespace-pre-wrap mb-4">
                {selectedDetail}
              </pre>
              <div className="text-center">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow max-w-sm w-full text-sm text-center">
              <p className="mb-4">
                ¿Estás seguro de que deseas borrar el historial de partidas?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteHistory}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreGameScreen;

import { useState } from "react";
import { UserPlus, ListOrdered, SquareX, Save } from "lucide-react";

function ScoreTable({
  players,
  rounds,
  dealerId,
  onSubmitRound,
  onEnganchar,
  onForceEnd,
  onAddNewPlayer,
  onReorderClick,
  onToggleDisable,
}) {
  const [inputs, setInputs] = useState(
    players.reduce((acc, p) => ({ ...acc, [p.id]: "" }), {})
  );

  const [newPlayerName, setNewPlayerName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (id, value) => {
    const intVal = parseInt(value);
    setInputs((prev) => ({
      ...prev,
      [id]: isNaN(intVal) ? "" : intVal,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const activePlayers = players.filter((p) => !p.isOut && !p.disabled);
    const zeros = activePlayers.filter((p) => parseInt(inputs[p.id]) === 0);

    if (zeros.length !== 1) {
      setError("Debe haber un solo jugador con 0 puntos.");
      return;
    }

    onSubmitRound(inputs);
    setInputs(players.reduce((acc, p) => ({ ...acc, [p.id]: "" }), {}));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Solo la tabla se desplaza horizontalmente */}
        <div className="overflow-x-auto">
          <table className="table-auto border text-xs sm:text-sm text-center bg-white shadow-md rounded min-w-max">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-1 sm:px-2 py-2 sticky left-0 bg-gray-200 z-20">
                  Ronda
                </th>
                {players.map((p) => (
                  <th
                    key={p.id}
                    className={`px-1 sm:px-2 py-2 whitespace-nowrap ${
                      p.disabled ? "bg-gray-300 text-gray-500" : "bg-gray-200"
                    }`}
                  >
                    {p.name}
                    {p.id === dealerId && (
                      <span className="ml-1 text-blue-600">🔄</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rounds.map((round, i) => (
                <tr key={i} className="border-t">
                  <td className="px-1 sm:px-2 py-1 font-semibold sticky left-0 bg-white z-10">
                    {i + 1}
                  </td>
                  {players.map((p) => (
                    <td key={p.id} className="px-1 sm:px-2 py-1">
                      {round[p.id] === 0 ? "Loba" : round[p.id] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-t bg-yellow-50">
                <td className="px-1 sm:px-2 py-1 font-semibold sticky left-0 bg-yellow-50 z-10">
                  Nueva
                </td>
                {players.map((p) => (
                  <td key={p.id} className="px-1 py-1">
                    {!p.isOut && !p.disabled ? (
                      <input
                        type="number"
                        min={0}
                        value={inputs[p.id]}
                        onChange={(e) => handleChange(p.id, e.target.value)}
                        className="w-full border rounded px-1 py-0.5 text-xs sm:text-sm"
                        required
                      />
                    ) : p.isOut ? (
                      <button
                        type="button"
                        onClick={() => onEnganchar(p.id)}
                        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Enganchar
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Inactivo
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr className="border-t bg-gray-100 font-bold">
                <td className="px-2 py-2 sticky left-0 bg-gray-100 z-10">
                  Total
                </td>
                {players.map((p) => (
                  <td key={p.id} className="px-2 py-2 text-center space-y-1">
                    <div>
                      {p.total}
                      {p.enganches > 0 && (
                        <span className="text-yellow-500 ml-1 text-xs">
                          🟡 x{p.enganches}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleDisable(p.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        p.disabled
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {p.disabled ? "Volver al juego" : "Salir del juego"}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-3 text-red-600 text-sm bg-red-100 border border-red-300 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* Botón de guardar ronda */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-lg font-semibold"
          >
            <Save size={18} /> Guardar ronda
          </button>
        </div>

        {/* Botones adicionales */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <UserPlus size={18} /> Agregar jugador
          </button>

          <button
            type="button"
            onClick={onReorderClick}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <ListOrdered size={18} /> Reordenar
          </button>

          <button
            type="button"
            onClick={onForceEnd}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <SquareX size={18} /> Finalizar partida
          </button>
        </div>

        {/* Modal para agregar jugador */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-3 text-center">
                Agregar nuevo jugador
              </h2>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Nombre del jugador"
                className="w-full border px-3 py-2 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newPlayerName.trim()) {
                      onAddNewPlayer(newPlayerName.trim());
                      setNewPlayerName("");
                      setShowAddModal(false);
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default ScoreTable;

import { useEffect } from "react";

function EndGameSummary({ players, winner, rounds, onReset }) {
  const sortedForDisplay = [...players].sort((a, b) => b.total - a.total);

  useEffect(() => {
    const historialPrevio = JSON.parse(
      localStorage.getItem("historialLoba") || "[]"
    );

    const sortedForHistory = [...players].sort((a, b) => b.total - a.total);

    const detalle = sortedForHistory
      .map(
        (p, i) =>
          `${i + 1}. ${p.name}${p.id === winner.id ? " 🏆" : ""} - ${
            p.total
          } pts, ${p.scores.length} rondas, ${
            p.enganches > 0 ? `enganches x${p.enganches}` : "sin enganches"
          }`
      )
      .join("\n");

    const nuevoRegistro = {
      ganador: winner.name,
      puntajeGanador: winner.total,
      rondasJugadas: rounds.length,
      fecha: new Date().toISOString(),
      detalle,
    };

    const yaExiste = historialPrevio.some(
      (h) =>
        h.ganador === nuevoRegistro.ganador &&
        h.puntajeGanador === nuevoRegistro.puntajeGanador &&
        h.rondasJugadas === nuevoRegistro.rondasJugadas
    );

    if (!yaExiste) {
      const nuevoHistorial = [nuevoRegistro, ...historialPrevio].slice(0, 20);
      localStorage.setItem("historialLoba", JSON.stringify(nuevoHistorial));
    }
  }, [winner, rounds, players]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          🎉 Ganó {winner.name} 🎉
        </h2>

        <table className="w-full text-sm mb-4 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1 text-left">Jugador</th>
              <th className="px-2 py-1">Total</th>
              <th className="px-2 py-1">Rondas</th>
              <th className="px-2 py-1">Enganches</th>
            </tr>
          </thead>
          <tbody>
            {sortedForDisplay.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-2 py-1 text-left">
                  {p.name}
                  {p.id === winner.id && (
                    <span className="ml-1 text-green-600">🏆</span>
                  )}
                </td>
                <td className="px-2 py-1">{p.total}</td>
                <td className="px-2 py-1">{p.scores?.length ?? "-"}</td>
                <td className="px-2 py-1">
                  {p.enganches > 0 ? `🟡 x${p.enganches}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={onReset}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Jugar otra partida
        </button>
      </div>
    </div>
  );
}

export default EndGameSummary;

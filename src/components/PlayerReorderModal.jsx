// components/PlayerReorderModal.jsx
import { ArrowUp, ArrowDown } from "lucide-react";

function PlayerReorderModal({ players, onReorder, onCancel, onConfirm }) {
  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...players];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];
    onReorder(newOrder);
  };

  const moveDown = (index) => {
    if (index === players.length - 1) return;
    const newOrder = [...players];
    [newOrder[index + 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index + 1],
    ];
    onReorder(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="absolute inset-0 z-0" onClick={onCancel}></div>
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md z-10 relative">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Reordenar jugadores
        </h2>
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={player.id}
              className="bg-gray-50 px-3 py-2 rounded shadow flex items-center justify-between"
            >
              <span>
                {index + 1}. {player.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => moveUp(index)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirmar orden
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerReorderModal;

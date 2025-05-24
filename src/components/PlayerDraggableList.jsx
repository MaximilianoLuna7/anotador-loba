import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

function SortableItem({ player, index }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white px-3 py-2 rounded shadow mb-2 flex items-center justify-between cursor-move"
    >
      <span>
        {index + 1}. {player.name}
      </span>
    </li>
  );
}

function PlayerDraggableList({ players, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [localOrder, setLocalOrder] = useState(players.map((p) => p.id));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = localOrder.indexOf(active.id);
      const newIndex = localOrder.indexOf(over.id);
      const newOrder = arrayMove(localOrder, oldIndex, newIndex);
      setLocalOrder(newOrder);

      // Informar al componente padre el nuevo orden
      const reorderedPlayers = newOrder.map((id) =>
        players.find((p) => p.id === id)
      );
      onReorder(reorderedPlayers);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Reordenar jugadores</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localOrder}
          strategy={verticalListSortingStrategy}
        >
          <ul>
            {localOrder.map((id, index) => {
              const player = players.find((p) => p.id === id);
              return <SortableItem key={id} player={player} index={index} />;
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default PlayerDraggableList;

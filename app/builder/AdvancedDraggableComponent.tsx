import React from "react";

type AdvancedDraggableComponentProps = {
  component: {
    id: number;
    x: number;
    y: number;
    // add other fields if needed
  };
  onDrag: (id: number, x: number, y: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>; // ✅ allow null
};

const AdvancedDraggableComponent: React.FC<AdvancedDraggableComponentProps> = ({
  component,
  onDrag,
  onSelect,
  isSelected,
  canvasRef,
}) => {
  return (
    <div
      className={`absolute border ${isSelected ? "border-blue-500" : "border-gray-300"}`}
      style={{ left: component.x, top: component.y }}
      onClick={() => onSelect(component.id)}
      draggable
      onDragEnd={(e) =>
        onDrag(component.id, e.clientX, e.clientY)
      }
      ref={canvasRef}
    >
      Component {component.id}
    </div>
  );
};

export default AdvancedDraggableComponent;

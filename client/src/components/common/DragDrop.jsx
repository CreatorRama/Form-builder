import { useDrag, useDrop } from 'react-dnd';

export const ItemTypes = {
  OPTION: 'option'
};

// Draggable component for items that can be dragged
export const DraggableItem = ({ item, children, onDragEnd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.OPTION,
    item: { id: item.id },
    end: (item, monitor) => {
      if (monitor.didDrop() && onDragEnd) {
        onDragEnd(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-white border rounded cursor-move flex justify-between items-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
};

// Drop zone component where draggable items can be dropped
export const DropZone = ({ onDrop, children, isOverClassName = 'bg-blue-100', className = '' }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.OPTION,
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`p-3 rounded-lg mb-4 min-h-20 ${isOver ? isOverClassName : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// Sortable list component for reordering items
export const SortableList = ({ items, onReorder, renderItem }) => {
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    onReorder(newItems);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <SortableItem
          key={item.id}
          index={index}
          item={item}
          moveItem={moveItem}
          renderItem={renderItem}
        />
      ))}
    </div>
  );
};

// Individual sortable item within a SortableList
const SortableItem = ({ index, item, moveItem, renderItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.OPTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.OPTION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {renderItem(item, index)}
    </div>
  );
};
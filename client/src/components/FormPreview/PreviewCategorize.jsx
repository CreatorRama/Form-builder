import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  OPTION: 'option'
};

const DraggableItem = ({ item, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.OPTION,
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-white border rounded cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {item.text}
    </div>
  );
};

const CategoryDropZone = ({ category, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.OPTION,
    drop: (item) => onDrop(item.id, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`p-3 rounded-lg mb-4 min-h-20 ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}
    >
      <h5 className="font-semibold mb-2">{category}</h5>
      {items
        .filter(item => item.belongsTo === category)
        .map(item => (
          <div key={item.id} className="p-2 mb-1 bg-white rounded border">
            {item.text}
          </div>
        ))}
    </div>
  );
};

const PreviewCategorize = ({ question, response, onResponseChange }) => {
  const uncategorizedItems = question.options.filter(
    opt => !question.items.some(item => item.id === opt.id)
  );

  const handleItemDrop = (itemId, category) => {
    const existingItem = question.items.find(item => item.id === itemId);
    const option = question.options.find(opt => opt.id === itemId);
    
    let newItems;
    if (existingItem) {
      newItems = question.items.map(item => 
        item.id === itemId ? { ...item, belongsTo: category } : item
      );
    } else if (option) {
      newItems = [
        ...question.items,
        {
          id: itemId,
          text: option.text,
          belongsTo: category
        }
      ];
    } else {
      return;
    }
    
    onResponseChange({ categorizedItems: newItems });
  };

  return (
    <div>
      <p className="font-medium mb-4">{question.questionText}</p>
      {question.image && (
        <img src={question.image} alt="Question" className="mb-4 max-w-full h-auto rounded" />
      )}

      <div className="mb-6">
        <h4 className="font-medium mb-2">Items to Categorize</h4>
        <div className="p-4 bg-gray-50 rounded">
          {uncategorizedItems.length > 0 ? (
            uncategorizedItems.map(item => (
              <DraggableItem key={item.id} item={item} onDrop={handleItemDrop} />
            ))
          ) : (
            <p className="text-gray-500">All items categorized</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {question.categories.map(category => (
          <CategoryDropZone
            key={category}
            category={category}
            items={response?.categorizedItems || []}
            onDrop={handleItemDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewCategorize;
import { useState } from 'react';
import { DraggableItem, DropZone } from '../common/DragDrop';
import ImageUpload from '../common/ImageUpload';

const CategorizeQuestion = ({ question, updateQuestion, deleteQuestion }) => {
  const [newOption, setNewOption] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const newOptionObj = {
      id: Date.now().toString(),
      text: newOption.trim()
    };
    updateQuestion(question.id, {
      options: [...question.options, newOptionObj]
    });
    setNewOption('');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    updateQuestion(question.id, {
      categories: [...question.categories, newCategory.trim()]
    });
    setNewCategory('');
  };

  const handleOptionDelete = (id) => {
    updateQuestion(question.id, {
      options: question.options.filter(opt => opt.id !== id),
      items: question.items.filter(item => item.id !== id)
    });
  };

  const handleOptionTextChange = (id, text) => {
    updateQuestion(question.id, {
      options: question.options.map(opt => 
        opt.id === id ? { ...opt, text } : opt
      )
    });
  };

  const handleCategoryDelete = (category) => {
    updateQuestion(question.id, {
      categories: question.categories.filter(cat => cat !== category),
      items: question.items.filter(item => item.belongsTo !== category)
    });
  };

  const handleCategoryTextChange = (oldCat, newCat) => {
    if (question.categories.includes(newCat)) return;
    
    updateQuestion(question.id, {
      categories: question.categories.map(cat => 
        cat === oldCat ? newCat : cat
      ),
      items: question.items.map(item => 
        item.belongsTo === oldCat ? { ...item, belongsTo: newCat } : item
      )
    });
  };

  const handleItemDrop = (itemId, category) => {
    const existingItem = question.items.find(item => item.id === itemId);
    const option = question.options.find(opt => opt.id === itemId);
    
    if (existingItem) {
      updateQuestion(question.id, {
        items: question.items.map(item => 
          item.id === itemId ? { ...item, belongsTo: category } : item
        )
      });
    } else if (option) {
      updateQuestion(question.id, {
        items: [...question.items, {
          id: itemId,
          text: option.text,
          belongsTo: category
        }]
      });
    }
  };

  const uncategorizedItems = question.options.filter(
    opt => !question.items.some(item => item.id === opt.id)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Categorize Question</h3>
        <button
          onClick={() => deleteQuestion(question.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete Question
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={question.questionText}
          onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
          placeholder="Question text"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <ImageUpload
          label="Question Image"
          currentImage={question.image}
          onImageUpload={(url) => updateQuestion(question.id, { image: url })}
        />
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {question.categories.map(category => (
            <DropZone
              key={category}
              onDrop={(itemId) => handleItemDrop(itemId, category)}
              className="bg-gray-100"
              isOverClassName="bg-blue-100"
            >
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleCategoryTextChange(category, e.target.value)}
                  className="font-semibold p-1 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                  placeholder="Category name"
                />
                <button
                  onClick={() => handleCategoryDelete(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              {question.items
                .filter(item => item.belongsTo === category)
                .map(item => (
                  <div key={item.id} className="p-2 mb-1 bg-white rounded border">
                    {item.text}
                  </div>
                ))}
            </DropZone>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Items to Categorize</h4>
        <div className="mb-4">
          {uncategorizedItems.map(item => (
            <DraggableItem key={item.id} item={item}>
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleOptionTextChange(item.id, e.target.value)}
                className="flex-1 p-1 border-none focus:outline-none"
                placeholder="Option text"
              />
              <button
                onClick={() => handleOptionDelete(item.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </DraggableItem>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="New item"
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={handleAddOption}
            className="px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <p className="font-medium mb-2">{question.questionText || "Question text"}</p>
          {question.image && (
            <img src={question.image} alt="Question" className="mb-4 max-w-full h-auto rounded" />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {question.categories.map(category => (
              <div key={category} className="p-3 bg-gray-100 rounded-lg">
                <h5 className="font-semibold mb-2">{category}</h5>
                {question.items
                  .filter(item => item.belongsTo === category)
                  .map(item => (
                    <div key={item.id} className="p-2 mb-1 bg-white rounded border">
                      {item.text}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
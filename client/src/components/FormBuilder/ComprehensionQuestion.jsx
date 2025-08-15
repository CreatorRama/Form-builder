import { useState } from 'react';
import ImageUpload from '../common/ImageUpload';

const ComprehensionQuestion = ({ question, updateQuestion, deleteQuestion }) => {
  const [newMcqQuestion, setNewMcqQuestion] = useState('');
  const [newOption, setNewOption] = useState('');

  const handleAddMcq = () => {
    if (!newMcqQuestion.trim()) return;
    const newMcq = {
      id: Date.now().toString(),
      question: newMcqQuestion.trim(),
      options: [],
      correctOption: null
    };
    updateQuestion(question.id, {
      mcqs: [...question.mcqs, newMcq]
    });
    setNewMcqQuestion('');
  };

  const handleDeleteMcq = (id) => {
    updateQuestion(question.id, {
      mcqs: question.mcqs.filter(mcq => mcq.id !== id)
    });
  };

  const handleMcqTextChange = (id, text) => {
    updateQuestion(question.id, {
      mcqs: question.mcqs.map(mcq => 
        mcq.id === id ? { ...mcq, question: text } : mcq
      )
    });
  };

  const handleAddOption = (mcqId) => {
    if (!newOption.trim()) return;
    updateQuestion(question.id, {
      mcqs: question.mcqs.map(mcq => 
        mcq.id === mcqId 
          ? { ...mcq, options: [...mcq.options, newOption.trim()] } 
          : mcq
      )
    });
    setNewOption('');
  };

  const handleDeleteOption = (mcqId, optionIndex) => {
    updateQuestion(question.id, {
      mcqs: question.mcqs.map(mcq => 
        mcq.id === mcqId 
          ? { 
              ...mcq, 
              options: mcq.options.filter((_, idx) => idx !== optionIndex),
              correctOption: mcq.correctOption === optionIndex 
                ? null 
                : mcq.correctOption > optionIndex 
                  ? mcq.correctOption - 1 
                  : mcq.correctOption
            } 
          : mcq
      )
    });
  };

  const handleOptionTextChange = (mcqId, optionIndex, text) => {
    updateQuestion(question.id, {
      mcqs: question.mcqs.map(mcq => 
        mcq.id === mcqId 
          ? { 
              ...mcq, 
              options: mcq.options.map((opt, idx) => 
                idx === optionIndex ? text : opt
              )
            } 
          : mcq
      )
    });
  };

  const handleCorrectOptionChange = (mcqId, optionIndex) => {
    updateQuestion(question.id, {
      mcqs: question.mcqs.map(mcq => 
        mcq.id === mcqId 
          ? { ...mcq, correctOption: optionIndex } 
          : mcq
      )
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comprehension Question</h3>
        <button
          onClick={() => deleteQuestion(question.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete Question
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Paragraph</label>
        <textarea
          value={question.paragraph}
          onChange={(e) => updateQuestion(question.id, { paragraph: e.target.value })}
          placeholder="Enter the comprehension paragraph"
          className="w-full p-2 border border-gray-300 rounded min-h-32"
        />
        <ImageUpload
          label="Paragraph Image"
          currentImage={question.image}
          onImageUpload={(url) => updateQuestion(question.id, { image: url })}
        />
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">MCQ Questions</h4>
        {question.mcqs.map(mcq => (
          <div key={mcq.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <input
                type="text"
                value={mcq.question}
                onChange={(e) => handleMcqTextChange(mcq.id, e.target.value)}
                placeholder="MCQ question"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => handleDeleteMcq(mcq.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium mb-2">Options</h5>
              {mcq.options.map((option, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`correct-${mcq.id}`}
                    checked={mcq.correctOption === idx}
                    onChange={() => handleCorrectOptionChange(mcq.id, idx)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionTextChange(mcq.id, idx, e.target.value)}
                    className="flex-1 p-1 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleDeleteOption(mcq.id, idx)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="New option"
                  className="flex-1 p-2 border border-gray-300 rounded-l"
                />
                <button
                  onClick={() => handleAddOption(mcq.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex">
          <input
            type="text"
            value={newMcqQuestion}
            onChange={(e) => setNewMcqQuestion(e.target.value)}
            placeholder="New MCQ question"
            className="flex-1 p-2 border border-gray-300 rounded-l"
          />
          <button
            onClick={handleAddMcq}
            className="px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600"
          >
            Add MCQ
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Preview</h4>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          {question.paragraph && (
            <div className="mb-6">
              <pre className="whitespace-pre-wrap break-words font-sans text-gray-800">
              {question.paragraph}
            </pre>
              {question.image && (
                <img src={question.image} alt="Paragraph" className="mt-2 max-w-full h-auto rounded" />
              )}
            </div>
          )}

          {question.mcqs.map((mcq, idx) => (
            <div key={mcq.id} className="mb-6">
              <p className="font-medium mb-2">{idx + 1}. {mcq.question}</p>
              <div className="space-y-2">
                {mcq.options.map((option, optIdx) => (
                  <div key={optIdx} className="flex items-center">
                    <input
                      type="radio"
                      name={`preview-${mcq.id}`}
                      className="mr-2"
                      disabled
                    />
                    <label>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComprehensionQuestion;
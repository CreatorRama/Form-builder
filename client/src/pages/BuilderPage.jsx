import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../components/common/ImageUpload';
import CategorizeQuestion from '../components/FormBuilder/CategorizeQuestion';
import ClozeQuestion from '../components/FormBuilder/ClozeQuestion';
import ComprehensionQuestion from '../components/FormBuilder/ComprehensionQuestion';
const apiUrl = import.meta.env.VITE_API_URL;
const BuilderPage = () => {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    headerImage: '',
    questions: []
  });
  const [activeQuestionType, setActiveQuestionType] = useState(null);
  const navigate = useNavigate();

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      questionText: '',
      image: '',
      categories: [],
      options: [],
      items: [],
      blanks: [],
      paragraph: '',
      mcqs: []
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestionType(type);
  };

  const updateQuestion = (id, updatedData) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updatedData } : q
      )
    }));
  };

  const deleteQuestion = (id) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
    if (form.questions.length === 1) {
      setActiveQuestionType(null);
    }
  };

  const saveForm = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/forms`, form);
      navigate(`/preview/${response.data._id}`);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="text-2xl font-bold w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Form description"
            className="text-gray-600 w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <ImageUpload
            label="Header Image"
            currentImage={form.headerImage}
            onImageUpload={(url) => setForm({ ...form, headerImage: url })}
          />
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => addQuestion('categorize')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Categorize
          </button>
          <button
            onClick={() => addQuestion('cloze')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Cloze
          </button>
          <button
            onClick={() => addQuestion('comprehension')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Add Comprehension
          </button>
        </div>

        {form.questions.map((question) => (
          <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            {question.type === 'categorize' && (
              <CategorizeQuestion
                question={question}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
              />
            )}
            {question.type === 'cloze' && (
              <ClozeQuestion
                question={question}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
              />
            )}
            {question.type === 'comprehension' && (
              <ComprehensionQuestion
                question={question}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
              />
            )}
          </div>
        ))}

        <button
          onClick={saveForm}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save & Preview
        </button>
      </div>
    </div>
  );
};

export default BuilderPage;
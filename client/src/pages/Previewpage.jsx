import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PreviewCategorize from '../components/FormPreview/PreviewCategorize';
import PreviewCloze from '../components/FormPreview/PreviewCloze';
import PreviewComprehension from '../components/FormPreview/PreviewComprehension';

const PreviewPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`/api/forms/${formId}`);
        setForm(response.data);
        
        // Initialize responses
        const initialResponses = {};
        response.data.questions.forEach((question, index) => {
          initialResponses[question.id || `q-${index}`] = {
            type: question.type,
            answers: question.type === 'categorize' 
              ? { categorizedItems: [] }
              : question.type === 'cloze'
                ? { filledBlanks: {} }
                : { selectedOptions: {} }
          };
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };

    fetchForm();
  }, [formId]);

  const handleResponseChange = (questionId, answerData) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answers: {
          ...prev[questionId].answers,
          ...answerData
        }
      }
    }));
  };

  const handleSubmit = async () => {
    if (!form) return;
    
    try {
      setIsSubmitting(true);
      await axios.post('/api/responses', {
        formId: form._id,
        answers: Object.entries(responses).map(([questionId, response]) => ({
          questionId,
          type: response.type,
          answers: response.answers
        }))
      });
      alert('Response submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return <div className="p-6 text-center">Loading form...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          {form.headerImage && (
            <img 
              src={form.headerImage} 
              alt="Form header" 
              className="w-full h-48 object-cover rounded-t-lg mb-6"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 mb-6">{form.description}</p>
          )}

          <div className="space-y-8">
            {form.questions.map((question, index) => {
              // Create a stable unique key for each question
              const questionKey = question.id || `q-${index}`;
              return (
                <div key={questionKey} className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Question {index + 1}</h3>
                  
                  {question.type === 'categorize' && (
                    <PreviewCategorize
                      question={question}
                      response={responses[questionKey]?.answers}
                      onResponseChange={(answers) => handleResponseChange(questionKey, answers)}
                    />
                  )}
                  
                  {question.type === 'cloze' && (
                    <PreviewCloze
                      question={question}
                      response={responses[questionKey]?.answers}
                      onResponseChange={(answers) => handleResponseChange(questionKey, answers)}
                    />
                  )}
                  
                  {question.type === 'comprehension' && (
                    <PreviewComprehension
                      question={question}
                      response={responses[questionKey]?.answers}
                      onResponseChange={(answers) => handleResponseChange(questionKey, answers)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default PreviewPage;
const PreviewComprehension = ({ question, response, onResponseChange }) => {
  const handleOptionSelect = (mcqId, optionIndex) => {
    onResponseChange({
      selectedOptions: {
        ...(response?.selectedOptions || {}),
        [mcqId]: optionIndex
      }
    });
  };

  return (
    <div className="space-y-6">
      {question.paragraph && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="max-w-full overflow-x-auto">
            <pre className="whitespace-pre-wrap break-words font-sans text-gray-800">
              {question.paragraph}
            </pre>
          </div>
          {question.image && (
            <img 
              src={question.image} 
              alt="Paragraph" 
              className="mt-4 max-w-full h-auto rounded-lg mx-auto"
            />
          )}
        </div>
      )}

      <div className="space-y-6">
        {question.mcqs?.map((mcq, idx) => {
          // Generate stable unique IDs if not present
          const mcqId = mcq.id || `mcq-${idx}-${question.id}`;
          const questionText = mcq.question || `Question ${idx + 1}`;

          return (
            <div key={`q-${question.id}-m-${mcqId}`} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="font-medium mb-3 text-gray-800">{idx + 1}. {questionText}</p>
              <div className="space-y-3">
                {mcq.options?.map((option, optIdx) => {
                  const optionText = option.text || option || `Option ${optIdx + 1}`;
                  return (
                    <div key={`q-${question.id}-m-${mcqId}-o-${optIdx}`} className="flex items-center">
                      <input
                        type="radio"
                        name={`radio-group-${question.id}-${mcqId}`}
                        id={`radio-${question.id}-${mcqId}-${optIdx}`}
                        checked={response?.selectedOptions?.[mcqId] === optIdx}
                        onChange={() => handleOptionSelect(mcqId, optIdx)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label 
                        htmlFor={`radio-${question.id}-${mcqId}-${optIdx}`}
                        className="ml-3 block text-gray-700"
                      >
                        {optionText}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewComprehension;
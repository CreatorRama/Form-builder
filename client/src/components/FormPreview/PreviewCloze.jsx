const PreviewCloze = ({ question, response, onResponseChange }) => {
  const handleBlankChange = (blankId, value) => {
    onResponseChange({
      filledBlanks: {
        ...(response?.filledBlanks || {}),
        [blankId]: value
      }
    });
  };

  const renderSentence = () => {
    if (!question.questionText) return null;
    
    let elements = [];
    let lastPos = 0;
    
    const sortedBlanks = [...(question.blanks || [])].sort((a, b) => a.position - b.position);
    
    sortedBlanks.forEach((blank, index) => {
      // Verify blank position is valid
      if (blank.position < 0 || blank.position > question.questionText.length) {
        return;
      }
      
      // Add text before blank
      if (blank.position > lastPos) {
        elements.push(
          <span key={`text-${index}`}>
            {question.questionText.substring(lastPos, blank.position)}
          </span>
        );
      }
      
      // Add blank input
      elements.push(
        <span key={`blank-${blank.id}`} className="inline-block mx-1">
          <input
            type="text"
            value={response?.filledBlanks?.[blank.id] || ''}
            onChange={(e) => handleBlankChange(blank.id, e.target.value)}
            className="border-b-2 border-blue-500 w-24 px-1 text-center focus:outline-none focus:border-blue-700"
          />
        </span>
      );
      
      // Update position after this blank
      lastPos = blank.position + (blank.correctAnswer?.length || 0);
    });
    
    // Add remaining text only if there's text left
    if (lastPos < question.questionText.length) {
      elements.push(
        <span key="text-end">
          {question.questionText.substring(lastPos)}
        </span>
      );
    }
    
    return elements;
  };

  return (
    <div>
      <p className="mb-4 whitespace-pre-wrap">{renderSentence()}</p>
      {question.image && (
        <img src={question.image} alt="Question" className="max-w-full h-auto rounded" />
      )}
    </div>
  );
};

export default PreviewCloze;
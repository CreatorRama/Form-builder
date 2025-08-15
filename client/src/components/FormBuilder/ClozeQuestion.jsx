import { useState } from 'react';
import ImageUpload from '../common/ImageUpload';

const ClozeQuestion = ({ question, updateQuestion, deleteQuestion }) => {
    const [sentence, setSentence] = useState(question.questionText || '');
    const [newBlank, setNewBlank] = useState('');
    const blanks = question.blanks || [];

    const handleSentenceChange = (e) => {
        const text = e.target.value;
        setSentence(text);
        updateQuestion(question.id, { questionText: text });
    };

    const handleAddBlank = () => {
        if (!newBlank.trim()) return;

        // Calculate position by finding where the blank should be inserted
        const blankText = newBlank.trim();
        const insertPosition = sentence.length;

        updateQuestion(question.id, {
            questionText: `${sentence} ${blankText}`,
            blanks: [
                ...blanks,
                {
                    id: Date.now().toString(),
                    correctAnswer: blankText,
                    position: insertPosition + 1 // +1 for the space we're adding
                }
            ]
        });

        setSentence(prev => `${prev} ${blankText}`);
        setNewBlank('');
    };

    const handleBlankChange = (id, newAnswer) => {
        updateQuestion(question.id, {
            blanks: blanks.map(blank =>
                blank.id === id ? { ...blank, correctAnswer: newAnswer.trim() } : blank
            )
        });
    };

    const handleDeleteBlank = (id) => {
        updateQuestion(question.id, {
            blanks: blanks.filter(blank => blank.id !== id)
        });
    };

    const renderPreview = () => {
        if (!sentence) return null;

        let elements = [];
        let lastPos = 0;

        [...blanks].sort((a, b) => a.position - b.position).forEach((blank, index) => {
            // Add text before blank
            if (blank.position > lastPos) {
                elements.push(
                    <span key={`text-${index}`}>
                        {sentence.substring(lastPos, blank.position)}
                    </span>
                );
            }

            // Add blank
            elements.push(
                <span key={`blank-${blank.id}`} className="inline-block mx-1">
                    <input
                        type="text"
                        className="border-b-2 border-blue-500 w-24 px-1 text-center"
                        placeholder="______"
                        disabled
                    />
                </span>
            );

            lastPos = blank.position + blank.correctAnswer.length;
        });

        // Add remaining text (only if there's text left)
        if (lastPos < sentence.length) {
            elements.push(
                <span key="text-end">
                    {sentence.substring(lastPos)}
                </span>
            );
        }

        return elements;
    };

    return (
        <div className="p-4 border border-gray-200 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cloze Question</h3>
                <button
                    onClick={() => deleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    Delete Question
                </button>
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Sentence</label>
                <textarea
                    value={sentence}
                    onChange={handleSentenceChange}
                    className="w-full p-2 border border-gray-300 rounded min-h-12"
                    placeholder="Enter your sentence here"
                />
            </div>

            <div className="mb-4">
                <ImageUpload
                    label="Question Image"
                    currentImage={question.image}
                    onImageUpload={(url) => updateQuestion(question.id, { image: url })}
                />
            </div>

            <div className="mb-6">
                <h4 className="font-medium mb-2">Configure Blanks</h4>
                <div className="flex mb-4">
                    <input
                        type="text"
                        value={newBlank}
                        onChange={(e) => setNewBlank(e.target.value)}
                        placeholder="Enter word to blank out"
                        className="flex-1 p-2 border border-gray-300 rounded-l"
                    />
                    <button
                        onClick={handleAddBlank}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                    >
                        Add Blank
                    </button>
                </div>

                {blanks.length > 0 && (
                    <div className="space-y-2">
                        {blanks.map(blank => (
                            <div key={blank.id} className="flex items-center p-2 bg-gray-100 rounded">
                                <span className="mr-2">Blank for:</span>
                                <input
                                    type="text"
                                    value={blank.correctAnswer}
                                    onChange={(e) => handleBlankChange(blank.id, e.target.value)}
                                    className="flex-1 p-1 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={() => handleDeleteBlank(blank.id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="mb-4 whitespace-pre-wrap">{renderPreview()}</p>
                    {question.image && (
                        <img
                            src={question.image}
                            alt="Question"
                            className="max-w-full h-auto rounded"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClozeQuestion;
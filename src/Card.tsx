import React, { useState, useRef } from 'react';
import './Card.css';

interface CardProps {
  initialContent: string;
  onChange: (updatedContent: string) => void;
  onDelete: () => void;
}

export const Card: React.FC<CardProps> = ({ initialContent, onChange, onDelete }) => {
  const getHighestClozeNumber = (text: string): number => {
    // Regular expression to match all cloze numbers like {{c1::...}}, {{c2::...}}, etc.
    const clozeRegex = /{{c(\d+)::/g;
    let match;
    let highest = 0;

    // Use the regular expression to find all matches in the string
    while ((match = clozeRegex.exec(text)) !== null) {
      // The first capturing group is the cloze number (e.g., "1" from {{c1::...}})
      const clozeNumber = parseInt(match[1], 10);
      highest = Math.max(highest, clozeNumber);
    }

    return highest;
  };

  const [content, setContent] = useState<string>(initialContent);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [highestClozeNumber, setHighestClozeNumber] = useState<number>(getHighestClozeNumber(initialContent));
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref to the textarea

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    onChange(updatedContent); // Call the onChange prop with the updated content
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
      // Prevent blur logic if focus stays within the card
      return;
    }

    setIsFocused(false);
  }

  const wrapWithCloze = (num: number) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.slice(start, end);

      if (selectedText) {
        const clozeText = `{{c${num}::${selectedText}}}`;
        const newContent =
          content.slice(0, start) +
          clozeText +
          content.slice(end);
        setContent(newContent);
        onChange(newContent);

        // Update the cursor position
        textarea.setSelectionRange(start + clozeText.length, start + clozeText.length);
      }
    }
  };

  const addNewCloze = () => {
    wrapWithCloze(highestClozeNumber + 1);
    setHighestClozeNumber(prevHighestClozeNumber => prevHighestClozeNumber + 1);
  }

  const addSameCloze = () => {
    wrapWithCloze(highestClozeNumber);
  }

  return (
    <div
      className="card"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="card-input"

      />
      {isFocused && (
        <div className="button-row">
          <button onClick={addNewCloze} className="cloze">New Cloze</button>
          <button onClick={addSameCloze} className="cloze">Same Cloze</button>
          <button onClick={onDelete} className="delete">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { QueryParams, queryDatabase } from './api/qbReaderApi';
import { getOpenAIResponse } from './api/openaiApi';
import './Generator.css';
import * as Constants from './constants';
import { Card } from './Card';
import { KeyInput } from "./keyInput";

interface Tossup {
  question: string;
  answer: string;
  question_sanitized?: string;
  answer_sanitized?: string;
}

interface Bonus {
  leadin: string;
  parts: string;
  answers: string;
  leadin_sanitized?: string;
  parts_sanitized?: string;
  answers_sanitized?: string;
}

interface CardContent {
  id: number; // or number, depending on your `id` generation method (e.g., `uuidv4()` or incremented numbers)
  content: string;
}


export const Generator: React.FC = () => {
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedAlternateSubcategories, setSelectedAlternateSubcategories] = useState<string[]>([]);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [isDifficultyDropdownVisible, setIsDifficultyDropdownVisible] = useState(false);
  const [cards, setCards] = useState<CardContent[]>([]);
  const [highestID, setHighestID] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
  };


  // Update the content of a specific card
  const handleCardChange = (index: number, updatedContent: string) => {
    const updatedCards = [...cards];
    updatedCards[index].content = updatedContent;
    setCards(updatedCards); // Update the state with the modified card
  };

  // toggles if the category dropdown menu is visible
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownVisible((prev) => !prev);
  };

  // toggles if the difficulty dropdown menu is visible
  const toggleDifficultyDropdown = () => {
    setIsDifficultyDropdownVisible((prev) => !prev);
  };

  const handleCategoryCheckboxChange = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleSubcategoryCheckboxChange = (category: string) => {
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleAlternateSubcategoryCheckboxChange = (category: string) => {
    setSelectedAlternateSubcategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleDifficultyCheckboxChange = (difficulty: string) => {
    setSelectedDifficulties((prevSelected) =>
      prevSelected.includes(difficulty)
        ? prevSelected.filter((item) => item !== difficulty)
        : [...prevSelected, difficulty]
    );
  };

  const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const queryParams: QueryParams = {
        queryString: queryString,
        difficulties: selectedDifficulties,
        categories: selectedCategories
      };
      // query the database
      const results = await queryDatabase(queryParams);
      if (!results || results.length === 0) {
        throw new Error('No results found in the database.');
      }

      results.tossups.questionArray = results.tossups.questionArray.map((item: Tossup) => ({
        question: item.question_sanitized || item.question || '',
        answer: item.answer_sanitized || item.answer || ''
      }));

      results.bonuses.questionArray = results.bonuses.questionArray.map((item: Bonus) => ({
        leadin: item.leadin_sanitized || item.leadin || '',
        parts: item.parts_sanitized || item.parts || '',
        answer: item.answers_sanitized || item.answers || ''
      }));

      // pass database results and user prompt to OpenAI
      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: 'system', content: Constants.SYSTEM_PROMPT },
        { role: 'user', content: `The query is ${queryString} and the questions are: ${JSON.stringify(results, null, 2)}` }
      ];
      if (apiKey == null) {
        throw new Error("Please enter your API key.");
      }
      const openaiResponse = await getOpenAIResponse(messages, apiKey);
      const initialStrings = openaiResponse.split('\n').filter((str: string) => str.includes("{{c"));
      const initialCards = initialStrings.map(((card: string, index: number) => ({
        id: (highestID + index),
        content: card
      })));
      setHighestID(highestID + initialStrings.length);
      setCards(initialCards.concat(cards));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    setCards([]);
  };

  const exportAll = () => {
    if (cards.length === 0) {
      alert('No cards to export.');
      return;
    }

    // Generate TSV content
    const tsvContent = cards
      .map((card) => `${card.content}\t`) // Add content and a tab for each card
      .join('\n'); // Newline for each card

    // Create a Blob
    const blob = new Blob([tsvContent], { type: 'text/plain;charset=utf-8' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cloze_flashcards.txt'; // Anki importable file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredSubcategories = selectedCategories.flatMap((category) => Constants.SUBCATEGORIES[category] || []);
  const filteredAlternateSubcategories = selectedSubcategories.flatMap((subcategory) => Constants.ALTERNATE_SUBCATEGORIES[subcategory] || []);

  return (
    <div>
      <h1>Anki Card Generator</h1>

      <form onSubmit={handleSubmit}>
        <div className="row-container">
          {/* Input for Database Query */}
          <input
            type="text"
            placeholder="Enter query string for the database"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            className="query"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="submit"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="row-container">

        {/* Difficulty dropdown */}
        <div className="category-dropdown-container">
          <button
            type="button"
            onClick={toggleDifficultyDropdown}
            className={`button ${isDifficultyDropdownVisible ? 'active' : ''}`}
          >
            Difficulties
          </button>

          {isDifficultyDropdownVisible && (
            <div className="dropdown dropwrapper">
              {Constants.DIFFICULTIES.map((difficulty) => (
                <label
                  key={difficulty[0]}
                >
                  <input
                    type="checkbox"
                    value={difficulty[0]}
                    checked={selectedDifficulties.includes(difficulty[0])}
                    onChange={() => handleDifficultyCheckboxChange(difficulty[0])}
                    className="checkbox"
                  />
                  {difficulty[1]}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Category dropdown */}
        <div className="category-dropdown-container">
          <button
            type="button"
            onClick={toggleCategoryDropdown}
            className={`${isCategoryDropdownVisible ? 'active' : ''}`}
          >
            Categories
          </button>
          <div className="dropwrapper categories">
            {isCategoryDropdownVisible && (
              <div className="dropdown">
                {Constants.CATEGORIES.map((category) => (
                  <label
                    key={category}
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryCheckboxChange(category)}
                      className="checkbox"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}

            {isCategoryDropdownVisible && filteredSubcategories.length > 0 && (
              <div className="dropdown">
                {filteredSubcategories.map((category) => (
                  <label
                    key={category}
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedSubcategories.includes(category)}
                      onChange={() => handleSubcategoryCheckboxChange(category)}
                      className="checkbox"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}

            {isCategoryDropdownVisible && filteredAlternateSubcategories.length > 0 && (
              <div className="dropdown">
                {filteredAlternateSubcategories.map((category) => (
                  <label
                    key={category}
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedAlternateSubcategories.includes(category)}
                      onChange={() => handleAlternateSubcategoryCheckboxChange(category)}
                      className="checkbox"
                    />
                    {category}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <KeyInput onSave={handleApiKeySave} />
      </div>

      {/* Display Error or Response */}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}
      {cards.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Cards</h2>
          <div className="cards-editor">
            <div className="row-container">
              {/* Export Button */}
              <button
                type="button"
                className="submit"
                onClick={exportAll}
              >
                Export All
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDeleteAll}
              >
                Delete All
              </button>
            </div>
            {cards.map((cardContent, index) => (
              <Card
                key={cardContent.id}
                initialContent={cardContent.content}
                onChange={(updatedContent) => handleCardChange(index, updatedContent)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

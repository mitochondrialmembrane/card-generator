import React, { useState } from 'react';
import { QueryParams, queryDatabase } from './api/qbReaderApi';
import { getOpenAIResponse } from './api/openaiApi';
import * as Constants from './constants';
import { Card } from './Card';
import { KeyInput } from "./keyInput";
import { TextField, Button, Box, OutlinedInput, InputLabel, MenuItem, FormControl, ListItemText, Checkbox, Container, Typography, Chip, Stack, ButtonGroup } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Delete, LibraryAdd, FileDownload } from '@mui/icons-material';
import { red } from '@mui/material/colors';

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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: Constants.ITEM_HEIGHT * 4.5 + Constants.ITEM_PADDING_TOP,
      width: 200,
    },
  },
};


export const Generator: React.FC = () => {
  const [queryString, setQueryString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [cards, setCards] = useState<CardContent[]>([]);
  const [highestID, setHighestID] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string>("");
  const [generateClicked, setGenerateClicked] = useState(false);
  const [numGenerated, setNumGenerated] = useState<number | null>(null);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
  };


  // Update the content of a specific card
  const handleCardChange = (index: number, updatedContent: string) => {
    const updatedCards = [...cards];
    updatedCards[index].content = updatedContent;
    setCards(updatedCards); // Update the state with the modified card
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleDifficultyCheckboxChange = (e: SelectChangeEvent<typeof selectedDifficulties>) => {
    const {
      target: { value },
    } = e;
    setSelectedDifficulties(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addCard = () => {
    const updatedCards = [...cards];
    updatedCards.unshift({
      id: highestID,
      content: ""
    });
    setHighestID(highestID + 1);
    setCards(updatedCards);
  }

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
      const openaiResponse = await getOpenAIResponse(messages, apiKey);
      const initialStrings = openaiResponse.split('\n').filter((str: string) => str.includes("{{c"));
      const initialCards = initialStrings.map(((card: string, index: number) => ({
        id: (highestID + index),
        content: card
      })));
      setHighestID(highestID + initialStrings.length);
      setCards(initialCards.concat(cards));
      setGenerateClicked(true);
      setNumGenerated(initialStrings.length);

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

  return (
    <Container maxWidth="md">
      <KeyInput onSave={handleApiKeySave} />

      {!generateClicked && <Box sx={{
        marginTop: '100px'
      }}>
        <Typography variant="h4">
          Welcome!
        </Typography>
        <Typography variant="subtitle1">
          Enter a query to get started.
        </Typography>
      </Box>}

      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* Input for Difficulty Query */}
            <FormControl sx={{ maxWidth: 240, width: '100%' }}>
              <InputLabel id="difficulty-label">Difficulties</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty"
                multiple
                value={selectedDifficulties}
                onChange={handleDifficultyCheckboxChange}
                input={<OutlinedInput label="Difficulties" />}
                renderValue={(selectedDifficulties) => selectedDifficulties.join(', ')}
                MenuProps={MenuProps}
              >
                {Constants.DIFFICULTIES.map((difficulty) => (
                  <MenuItem key={difficulty[0]} value={difficulty[0]} sx={{ padding: '6px' }}>
                    <Checkbox
                      checked={selectedDifficulties.includes(difficulty[0])}
                    />
                    <ListItemText primary={difficulty[1]} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Input for Database Query */}
            <TextField
              id="outlined-basic"
              label="Query"
              variant="outlined"
              value={queryString}
              sx={{ maxWidth: 350, width: '100%' }}
              onChange={(e) => setQueryString(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              variant="contained"
              type="submit"
              disabled={loading || queryString === ""}
              size="large"
            >
              {loading ? 'Processing...' : 'Generate'}
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {Constants.CATEGORIES.map((category) => (
              <Chip label={category} variant={selectedCategories.includes(category) ? "filled" : "outlined"} onClick={() => handleCategoryChange(category)} />
            ))}
          </Stack>
        </Stack>
      </form>

      {/* Display Error or Response */}
      {error && <Typography variant="subtitle1" sx={{ color: red[500], marginTop: '20px' }}>Error: {error}</Typography>}
      {generateClicked && (
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: 'action.selected',
            marginTop: '20px',
            width: '100%'
          }}
          flexWrap="wrap"
        >
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            padding: 2
          }}>
            <Box>
              {numGenerated != null && <Typography variant="subtitle2">{numGenerated.toString()} Cards Generated</Typography>}
            </Box>
            {/* Button panel */}
            <ButtonGroup variant="outlined" aria-label="button group">
              <Button onClick={addCard} startIcon={<LibraryAdd />}>Add</Button>
              <Button onClick={handleDeleteAll} startIcon={<Delete />}>Clear</Button>
              <Button onClick={exportAll} startIcon={<FileDownload />}>Export</Button>
            </ButtonGroup>
          </Box>
          <Box
            sx={{
              columns: "2"
            }}
            flexWrap="wrap"
          >
            {cards.map((cardContent, index) => (
              <Card
                key={cardContent.id}
                initialContent={cardContent.content}
                onChange={(updatedContent) => handleCardChange(index, updatedContent)}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

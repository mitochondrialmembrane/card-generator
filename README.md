# Quizbowl Anki Card Generator

A web app to generate and edit quizbowl flashcards in Anki format, making it easy to convert questions from the [QBReader]([url](https://www.qbreader.org/database/)) database into structured study materials. Users can generate cloze-style flashcards from text and export them as .apkg files for Anki.

## Usage
1. Enter OpenAI API Key: Paste your API key into the input field to enable flashcard generation.
2. Configure options: Select the categories and difficulties that the questions pulled from.
3. Generate Cards: Enter your query in the textarea and use the "Generate Flashcards" button.
4. Edit Cards: Customize the generated cards in the editor. The right pop-up panel has buttons for adding clozes and deleting the cards.
5. Export Cards: Click the export button to save the flashcards in Anki's .apkg format.

## Installation
### Prerequisites
Ensure you have npm/yarn installed.
Create an OpenAI API key from the OpenAI platform.

### Steps
1. Clone the repository:
```
git clone https://github.com/mitochondrialmembrane/card-generator.git
cd card-generator
```
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm start
```
4. Open the app in your browser:
```
http://localhost:3000
```



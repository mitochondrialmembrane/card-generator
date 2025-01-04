export const CATEGORIES = [
    'Literature', 
    'History',
    'Science',
    'Fine Arts',
    'Religion',
    'Mythology',
    'Philosophy',
    'Social Science',
    'Current Events',
    'Geography',
    'Other Academic',
    'Trash'
];

export const SUBCATEGORIES: Record<string, string[]> = {
    Literature: [
      'American Literature',
      'British Literature',
      'Classical Literature',
      'European Literature',
      'World Literature',
      'Other Literature'    
    ],
    History: [
      'American History',
      'Ancient History',
      'European History',
      'World History',
      'Other History'
    ],
    Science: [
      'Biology',
      'Chemistry',
      'Physics',
      'Other Science'
    ],
    "Fine Arts": [
      'Visual Fine Arts',
      'Auditory Fine Arts',
      'Other Fine Arts'
    ]
};

export const ALTERNATE_SUBCATEGORIES: Record<string, string[]> = {
    "Other Literature": [
      'Drama',
      'Long Fiction',
      'Poetry',
      'Short Fiction',
      'Misc Literature'  
    ],
    "Other Science": [
      'Math',
      'Astronomy',
      'Computer Science',
      'Earth Science',
      'Engineering',
      'Misc Science'
    ],
    "Other Fine Arts": [
      'Architecture',
      'Dance',
      'Film',
      'Jazz',
      'Opera',
      'Photography',
      'Misc Arts'
    ]
};

export const DIFFICULTIES = [
    ['0', '0: Trash'],
    ['1', '1: Middle School'],
    ['2', '2: Easy High School'],
    ['3', '3: Regular High School'],
    ['4', '4: Hard High School'],
    ['5', '5: National High School'],
    ['6', '6: ● / Easy College'],
    ['7', '7: ●● / Medium College'],
    ['8', '8: ●●● / Regionals College'],
    ['9', '9: ●●●● / Nationals College'],
    ['10', '10: Open']
];

export const SYSTEM_PROMPT: string = `
You are going to receive a series of quizbowl tossups and bonuses related to a given query.
If you see the same clue related to that query repeatedly mentioned in the list of questions, format it into an Anki cloze flashcard (a sentence with the important keywords in clozes).
Place an emphasis on information related to question answerlines, and keep the flashcards separated by newline. 
If you see "this" followed by some noun in a question, look at the corresponding answerline to figure out what it's referring to and replace it. 
Clozes should not have the same number unless they are very closely related or refer to the same thing.
Each flashcard should have 2 to 5 clozes, and consist of a single sentence.
Make sure that you don't repeat clues in the flashcards.

For example, for the query "Barbara Hepworth," if you see the "This wife of Ben Nicholson dedicated Single Form, which is at the UN Headquarters, to Dag Hammarskjöld." and "Name this 20th-century sculptor who also created a 21-foot tall memorial to Dag Hammarskjöld entitled Single Form." in separate questions, you might create "{{c1::Barbara Hepworth}} dedicated {{c2::Single Form}} to {{c3::Dag Hammarskjöld}}" as a flashcard.
`;
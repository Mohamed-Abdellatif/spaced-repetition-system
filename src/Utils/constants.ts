export const QuestionTypes = [
  "complete",
  "true or false",
  "short response",
  "image",
  "MCQ",
];
export const QuestionObj = {
  question: "",
  difficulty: 1,
  answer: "",
  genre: "",
  questionType: "complete",
  choices: {
    choice1: "",
    choice2: "",
    choice3: "",
  },
};

export const ToEditQuestionObj = {
  question: "",
  difficulty: 0,
  answer: "",
  genre: "",
  questionType: "",
  choices: {
    choice1: "",
    choice2: "",
    choice3: "",
  },
};

export const ListObj = {
  listName: "",
  questions: [],
};

export const trueOrFalseRadios = [
  { name: "True", value: "1", bool: true },
  { name: "False", value: "2", bool: false },
];

import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { trueOrFalseRadios } from "../../Utils/constants";
import { shuffle } from "../../Utils/helperfunctions";
import { useMemo } from "react";
import type { IQuestion } from "../../vite-env";

interface QuestionQuizAnswerInput {
  questions:IQuestion[];
  currentIndex:number;
  currentAnswer:string;
  isFlipped:boolean;
  setCurrentAnswer:(text:string)=>void;
}

const QuestionQuizAnswerInput = ({
  questions,
  currentIndex,
  currentAnswer,
  isFlipped,
  setCurrentAnswer,
}:QuestionQuizAnswerInput) => {
  const shuffledChoices = useMemo(() => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return [];

    const allChoices = Object.values(currentQuestion.choices || {}).concat(
      currentQuestion.answer
    );

    return shuffle(allChoices);
  }, [questions, currentIndex]);

  if (questions[currentIndex]?.questionType === "MCQ") {
    return (
      <Form.Group>
        <ButtonGroup vertical>
          {shuffledChoices.map((choice:string, idx:number) => (
            <ToggleButton
              key={choice}
              id={choice}
              type="radio"
              variant={currentAnswer === choice ? "primary" : "secondary"}
              name="mcq-answer"
              value={choice}
              checked={currentAnswer === choice}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={isFlipped}
              className="mb-3  text-start"
            >
              <span className="text-light">
                {idx + 1}. {choice}
              </span>
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Form.Group>
    );
  }

  if (questions[currentIndex]?.questionType === "true or false") {
    return (
      <Form.Group>
        <ButtonGroup>
          {trueOrFalseRadios.map((radio, idx) => (
            <ToggleButton
              key={radio.name}
              id={`radio-${idx}`}
              type="radio"
              variant={
                currentAnswer === radio.bool.toString()
                  ? "primary"
                  : "secondary"
              }
              name="t/f-answer"
              value={radio.value}
              checked={currentAnswer === radio.name}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            >
              <span className="text-light">{radio.name}</span>
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Form.Group>
    );
  }

  return (
    <>
      <Form.Control
        type="text"
        className="answer-input"
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Type your answer..."
        disabled={isFlipped}
        autoFocus
      />
    </>
  );
};

export default QuestionQuizAnswerInput;

import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { trueOrFalseRadios } from "../../Utils/constants";

const QuestionQuizAnswerInput = ({
  questions,
  currentIndex,
  currentAnswer,
  isFlipped,
  setCurrentAnswer,
}) => {

  if (questions[currentIndex]?.questionType === "MCQ") {
    return (
      <Form.Group>
        <ButtonGroup vertical>
          {Object.values(questions[currentIndex]?.choices || {})
            .concat(questions[currentIndex]?.answer)
            .map((choice, idx) => (
              <ToggleButton
                key={choice}
                id={`mcq-${idx}`}
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
              value={radio.bool}
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

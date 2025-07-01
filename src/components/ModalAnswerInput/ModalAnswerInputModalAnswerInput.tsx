import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { trueOrFalseRadios } from "../../Utils/constants";
import type { IQuestion } from "../../vite-env";

interface ModalAnswerInputModalAnswerInput {
  questionObj:IQuestion;
  updateInput:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

const ModalAnswerInputModalAnswerInput = ({ questionObj, updateInput }:ModalAnswerInputModalAnswerInput) => {
  const { questionType, answer } = questionObj;
  return (
    <>
      {questionType !== "true or false" ? (
        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={answer}
            onChange={updateInput}
            name="answer"
            placeholder="Enter the answer"
          />
        </Form.Group>
      ) : (
        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <ButtonGroup>
            {trueOrFalseRadios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={`${
                  answer === radio.bool.toString() ? "primary" : "secondary"
                }`}
                name="answer"
                value={radio.value}
                checked={answer == radio.value}
                onChange={updateInput}
              >
                <span className="text-light">{radio.name}</span>
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Form.Group>
      )}
    </>
  );
};

export default ModalAnswerInputModalAnswerInput;

import { ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { trueOrFalseRadios } from "../../Utils/constants";

const ModalAnswerInputModalAnswerInput = ({questionObj,updateInput}) => {
    const {questionType,answer}= questionObj;
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
                value={radio.bool}
                checked={answer == radio.bool}
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

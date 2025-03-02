import "./editModal.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MCQInput from "../MCQInput/MCQInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faImage } from "@fortawesome/free-solid-svg-icons";

const EditModal = ({
  questionObj,
  updateInput,
  handleSubmit,
  setQuestionObj,
  handleImageChange,
  image,
  show,
  onHide
}) => {
  const { question, answer, difficulty, genre, questionType, choices } = questionObj;

  const handleQuestionTypeChange = (questionType) => {
    setQuestionObj({ ...questionObj, questionType: questionType });
  };

  const updateChoices = (e) => {
    setQuestionObj({
      ...questionObj,
      choices: { ...choices, [e.target.name]: e.target.value },
    });
  };

  const isFormValid = question && answer && difficulty && genre;

  return (
    <Modal 
      show={show}
      onHide={onHide}
      id="editModal" 
      size="lg" 
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faEdit} className="me-2" />
          Edit Question
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  value={genre}
                  onChange={updateInput}
                  name="genre"
                  type="text"
                  placeholder="Ex: Biology"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Difficulty Level</Form.Label>
                <Form.Control
                  value={difficulty}
                  onChange={updateInput}
                  name="difficulty"
                  type="number"
                  placeholder="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              value={question}
              onChange={updateInput}
              name="question"
              type="text"
              placeholder="How to spell my name?"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Question Type</Form.Label>
            <div>
              <DropdownButton
                id="dropdown"
                variant="outline-primary"
                title={questionType}
              >
                {questionType !== "Short Response" && (
                  <Dropdown.Item onClick={() => handleQuestionTypeChange("Short Response")}>
                    Short Response
                  </Dropdown.Item>
                )}
                {questionType !== "Complete" && (
                  <Dropdown.Item onClick={() => handleQuestionTypeChange("Complete")}>
                    Complete
                  </Dropdown.Item>
                )}
                {questionType !== "True or false" && (
                  <Dropdown.Item onClick={() => handleQuestionTypeChange("True or false")}>
                    True or false
                  </Dropdown.Item>
                )}
              </DropdownButton>
            </div>
          </Form.Group>

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
            {questionType === "MCQ" && (
              <MCQInput updateChoices={updateChoices} choices={choices} />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faImage} className="me-2" />
              Upload Image
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;

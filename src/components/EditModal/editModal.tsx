import "./editModal.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faImage } from "@fortawesome/free-solid-svg-icons";
import ModalAnswerInputModalAnswerInput from "../ModalAnswerInput/ModalAnswerInputModalAnswerInput";
import { QuestionTypes } from "../../Utils/constants";
import type { IQuestion } from "../../vite-env";

interface EditModal {
  questionObj:IQuestion;
  updateInput:(e: React.ChangeEvent<HTMLInputElement>)=>void;
  handleSubmit:()=>void;
  setQuestionObj:(question:IQuestion)=>void;
  handleImageChange:(event: React.ChangeEvent<HTMLInputElement>)=>void;
  show:boolean;
  onHide:()=>void;
}

const EditModal = ({
  questionObj,
  updateInput,
  handleSubmit,
  setQuestionObj,
  handleImageChange,
  show,
  onHide,
}:EditModal) => {
  const { question, answer, difficulty, genre, questionType, img } =
    questionObj;

  const handleQuestionTypeChange = (questionType:string) => {
    setQuestionObj({ ...questionObj, questionType: questionType });
  };

  const isFormValid = question && answer && difficulty && genre;

  return (
    <Modal show={show} onHide={onHide} id="editModal" size="lg" centered>
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
                variant="primary"
                title={questionType}
              >
                {QuestionTypes.filter(
                  (type) => type.toLowerCase() !== questionType.toLowerCase()
                ).map((type) => {
                  return (
                    <Dropdown.Item
                      key={type}
                      onClick={() => handleQuestionTypeChange(type)}
                      className="text-capitalize"
                    >
                      {type}
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
            </div>
          </Form.Group>

          <ModalAnswerInputModalAnswerInput
            questionObj={questionObj}
            updateInput={updateInput}
          />

          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faImage} className="me-2" />
              {img ? "Edit Image" : "Upload Image"}
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

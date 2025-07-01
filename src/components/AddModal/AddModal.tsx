import "./AddModal.css";
import CreatableSelect from "react-select/creatable";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faImage,
  faBrain,
  faQuestion,
  faList,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { QuestionObj, QuestionTypes } from "../../Utils/constants";
import ModalAnswerInputModalAnswerInput from "../ModalAnswerInput/ModalAnswerInputModalAnswerInput";
import type { IQuestion } from "../../vite-env";

interface AddModal {
  generateQuestionFromText: (text: string) => void;
  questionObj:IQuestion;
  updateInput: (e: any, selectedOption?: any) => void;
  handleSubmit: () => void;
  setQuestionObj: (question: IQuestion) => void;
  handleImageChange: (image: any) => void;
  handleQuestionAsImageChange: (image: any) => void;
  questionAsImage: any;
  show: boolean;
  onHide: () => void;
  image: any;
  genres: string[];
}

const AddModal = ({
  generateQuestionFromText,
  questionObj,
  updateInput,
  handleSubmit,
  setQuestionObj,
  handleImageChange,
  handleQuestionAsImageChange,
  questionAsImage,
  show,
  onHide,
  image,
  genres,
}:AddModal) => {
  const { question, answer, difficulty, genre, questionType } = questionObj;

  useEffect(() => {
    if (questionType == "true or false") {
      setQuestionObj({ ...questionObj, answer: "true" });
    }
  }, [questionType]);

  const handleQuestionTypeChange = (questionType:string) => {
    setQuestionObj({ ...questionObj, questionType: questionType });
  };

  const [text, setText] = useState("");

  const isFormValid = question && answer && difficulty && genre;

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setQuestionObj({ ...QuestionObj });
      }}
      size="lg"
      centered
      className="question-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
          Add New Question
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 ">
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FontAwesomeIcon icon={faBrain} className="me-2" />
                  Genre
                </Form.Label>
                <CreatableSelect
                  isClearable
                  options={genres.map((genre) => {
                    return {
                      value: genre,
                      label: genre,
                      color: "#00B8D9",
                      isFixed: true,
                    };
                  })}
                  onChange={updateInput}
                  name="genre"
                  placeholder="Ex: Biology"
                ></CreatableSelect>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FontAwesomeIcon icon={faChartLine} className="me-2" />
                  Difficulty Level
                </Form.Label>
                <Form.Control
                  value={difficulty}
                  onChange={updateInput}
                  name="difficulty"
                  type="number"
                  placeholder="1"
                  min="1"
                  max="5"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faQuestion} className="me-2" />
              Question
            </Form.Label>
            {questionType === "image" ? (
              <>
                <Form.Control
                  className="mb-2"
                  value={question}
                  onChange={updateInput}
                  name="question"
                  type="text"
                  placeholder="Describe the image"
                />
                <Form.Control
                  type="file"
                  onChange={handleQuestionAsImageChange}
                  accept="image/*"
                />
                {questionAsImage && (
                  <small className="text-muted d-block mt-2">
                    Selected file: {questionAsImage.name}
                  </small>
                )}
              </>
            ) : (
              <Form.Control
                value={question}
                onChange={updateInput}
                name="question"
                type="text"
                placeholder="How to spell my name?"
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faList} className="me-2" />
              Question Type
            </Form.Label>
            <div>
              <DropdownButton
                variant="primary"
                title={questionType.toUpperCase()}
              >
                {QuestionTypes.filter((type) => type !== questionType).map(
                  (type) => {
                    return (
                      <Dropdown.Item
                        key={type}
                        onClick={() => handleQuestionTypeChange(type)}
                      >
                        <span className="text-capitalize">{type}</span>
                      </Dropdown.Item>
                    );
                  }
                )}
              </DropdownButton>
            </div>
          </Form.Group>

          <ModalAnswerInputModalAnswerInput
            questionObj={questionObj}
            updateInput={updateInput}
          />
          <Form.Group className="mb-3">
            <Form.Label>Generate Question From Text By AI</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              name="text"
              placeholder="Enter the text"
            />
            <Button
              className="mt-2"
              onClick={() => {
                generateQuestionFromText(text);
              }}
            >
              Generate Question
              <FontAwesomeIcon icon={faQuestion} className="ms-2" />
            </Button>
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
            {image && (
              <small className="text-muted d-block mt-2">
                Selected file: {image.name}
              </small>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
            setQuestionObj({ ...QuestionObj });
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSubmit();
            setText("");
          }}
          disabled={!isFormValid}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Question
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModal;

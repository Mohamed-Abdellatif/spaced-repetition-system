import { faBook, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import type { IQuestion } from "../../vite-env";

interface CalendarQuestionsModalProps {
  showModal: boolean;
  selectedDate: string;
  selectedQuestions: IQuestion[];
  handleEditClick: (question: IQuestion) => void;
  setShowModal: (show: boolean) => void;
  handleDeleteClick: (question: IQuestion) => void;
}

const CalendarQuestionsModal = ({
  showModal,
  selectedDate,
  selectedQuestions,
  handleEditClick,
  setShowModal,
  handleDeleteClick,
}: CalendarQuestionsModalProps) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      className="schedule-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faBook} className="me-2 " />
          <span className="text-capitalize">
            {selectedDate
              ? `Questions for ${selectedDate}`
              : selectedQuestions[0]?.genre}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedQuestions.length > 0 ? (
          <div className="questions-list">
            {selectedQuestions.map((question: IQuestion) => (
              <Card key={question.id} className="question-card mb-3">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <div>
                      <h5 className="question-text mb-2">
                        {question.question}
                      </h5>
                      <p className="answer-text mb-0">
                        <strong>Answer:</strong> {question.answer}
                      </p>
                    </div>
                  </div>
                  <Row>
                    <Col sm={6} className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleEditClick(question);
                          setShowModal(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit
                      </Button>
                    </Col>

                    <Col sm={6} className="d-flex justify-content-center">
                      <Button
                        variant="danger"
                        onClick={() => {
                          handleDeleteClick(question);
                          setShowModal(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              No questions scheduled for this date.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CalendarQuestionsModal;

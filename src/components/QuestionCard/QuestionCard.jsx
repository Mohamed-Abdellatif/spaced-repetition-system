import moment from "moment/moment";
import "./QuestionCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card, Row, Col, Button } from "react-bootstrap";

const QuestionCard = ({ questionObj, setToDelete, setToEdit, addToList }) => {
  const { question, created, genre, id, questionType} = questionObj;
  const navigate = useNavigate();

  return (
    <Card className="question-card animate-fade mb-3">
      <Card.Body>
        <Row className="question-card__header">
          <Col xs={12} sm={8}>
            <h3 className="question-card__title">{question}</h3>
          </Col>
          <Col xs={12} sm={4} className="text-sm-end">
            <span className="question-card__genre">{genre}</span>
          </Col>
        </Row>

        <Row className="question-card__content">
          <Col xs={12}>
            <p>Type: {questionType}</p>
            <small className="text-muted d-block">
              Created on {moment(created).format("MMMM Do YYYY")}
            </small>
          </Col>
        </Row>

        <Row className="question-card__footer">
          <Col xs={12}>
            <div className="question-card__actions">
              <Row className="g-2 w-100">
                <Col xs={12} sm={6} md={3}>
                  <Button
                    onClick={() => addToList(questionObj)}
                    variant="primary"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add To List
                  </Button>
                </Col>
                
                <Col xs={12} sm={6} md={3}>
                  <Button
                    onClick={() => navigate(`/question/${id}`)}
                    variant="outline-secondary"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    View
                  </Button>
                </Col>
                
                <Col xs={12} sm={6} md={3}>
                  <Button
                    onClick={() => setToEdit(questionObj)}
                    variant="outline-primary"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit
                  </Button>
                </Col>
                
                <Col xs={12} sm={6} md={3}>
                  <Button
                    onClick={() => setToDelete(questionObj)}
                    variant="outline-danger"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;

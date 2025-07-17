import moment from "moment/moment";
import "./CSVQuestionCard.css";
import { Card, Row, Col } from "react-bootstrap";
import type { IQuestion } from "../../vite-env";

interface QuestionCard {
  questionObj: IQuestion;
}

const CSVQuestionCard = ({ questionObj }: QuestionCard) => {
  const { question, created, genre, questionType } = questionObj;

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
      </Card.Body>
    </Card>
  );
};

export default CSVQuestionCard;

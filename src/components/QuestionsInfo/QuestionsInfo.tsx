import { Col, Row } from "react-bootstrap";
import type { IQuestion } from "../../vite-env";

const QuestionsInfo = ({
  questions,
  currentGenre,
  questionsLength,
}: {
  questions: IQuestion[];
  currentGenre: string;
  questionsLength: number;
}) => {
  return (
    <Row>
      <Col xs={12}>
        <h6>
          {questions.length} Question{questions.length > 1 ? "s" : ""}
          {currentGenre && currentGenre !== "ALL GENRES" ? ` in ` : ""}
          <span className="text-primary">
            {" "}
            {currentGenre && currentGenre !== "ALL GENRES"
              ? `"${currentGenre}"`
              : ""}
          </span>
        </h6>
        <h6>
          Total: {questionsLength} Question{questionsLength > 1 ? "s" : ""}
        </h6>
      </Col>
    </Row>
  );
};

export default QuestionsInfo;

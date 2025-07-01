import QuestionCard from "../QuestionCard/QuestionCard";
import { Row, Col, Alert } from "react-bootstrap";
import "./List.css";
import { UserContext } from "../../contexts/user.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { IQuestion } from "../../vite-env";

interface List  {
  questions:IQuestion[];
  setToDelete:(question:IQuestion)=>void;
  setToEdit:(question:IQuestion)=>void;
  addToList:(question:IQuestion)=>void;
  listType:string;
}

const List = ({
  questions,
  setToDelete,
  setToEdit,
  addToList,
  listType,
}:List) => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const questionsToRender = questions[0] ? questions : questions || [];

  return (
    <Row className="g-4">
      {questionsToRender.length > 0 ? (
        questionsToRender.map((question) => (
          <Col xs={12} key={question.id}>
            <QuestionCard
              listType={listType}
              addToList={addToList}
              setToEdit={setToEdit}
              questionObj={question}
              setToDelete={setToDelete}
            />
          </Col>
        ))
      ) : (
        <Col xs={12}>
          <Alert variant="warning" className="text-center">
            {currentUser ? (
              <h3 className="mb-0"> No questions available</h3>
            ) : (
              <h3 className="mb-0">
                {" "}
                Please{" "}
                <span
                  role="button"
                  onClick={() => navigate("/login")}
                  className="text-warning text-decoration-underline "
                >
                  Sign In
                </span>
              </h3>
            )}
          </Alert>
        </Col>
      )}
    </Row>
  );
};

export default List;

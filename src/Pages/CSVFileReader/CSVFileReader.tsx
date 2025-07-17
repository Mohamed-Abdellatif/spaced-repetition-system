import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { UserContext } from "../../contexts/user.context";
import {
  handleNotification,
  todayFormatDate,
} from "../../Utils/helperfunctions";
import type { IQuestion } from "../../vite-env";
import CSVQuestionCard from "../../components/CSVQuestionCard/CSVQuestionCard";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import useQuestionsQuery from "../../hooks/useQuestionsQuery";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import NotificationToast from "../../components/Toast/toast";

const CSVFileReader = () => {
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [response, setResponse] = useState<{
    message: string;
    isSuccess?: boolean;
  }>({ message: "", isSuccess: true });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const { AddQuestion } = useQuestionsQuery(currentUser);
  const addAllQuestions = async (questions: IQuestion[]) => {
    try {
      questions.map(async (question: IQuestion) => {
        AddQuestion.mutate(question);
      });

      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Added Successfully"
      );
    } catch (error: any) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        error.message,
        false
      );
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const parsedData = results?.data;
          if (
            !Object.keys(parsedData[0]).includes("Question") ||
            !Object.keys(parsedData[0]).includes("Answer") ||
            !Object.keys(parsedData[0]).includes("Genre")
          ) {
            handleNotification(
              setIsNotificationVisible,
              setResponse,
              "File With Invalid Format",
              false
            );
            return;
          }

          const questionsArray = parsedData.map((question: any) => {
            return {
              answer: question.Answer,
              choices: {
                choice1: "",
                choice2: "",
                choice3: "",
              },
              created: todayFormatDate(),
              difficulty: 1,
              genre: question.Genre,
              nextTest: todayFormatDate(),
              question: question.Question,
              questionType: "short response",
              userId: currentUser.uid,
            };
          });
          setQuestions(questionsArray);

          handleNotification(
            setIsNotificationVisible,
            setResponse,
            "Imported Successfully"
          );
        },
        error: (error) => {
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            error.message,
            false
          );
        },
      });
    } catch (error: any) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        error.message,
        false
      );
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faFileImport} className="me-3" />
            Import Questions
          </h1>
          <p className="page-description">
            Upload Questions From .csv Files for Easier Studying
          </p>
        </Col>
      </Row>
      <Row className="mb-4">
        <DropdownButton id="dropdown-basic-button" title="Valid Form">
          <Dropdown.Item>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>What is React?</td>
                  <td>A JavaScript library for building UIs</td>
                  <td>React</td>
                </tr>
              </tbody>
            </Table>
          </Dropdown.Item>
        </DropdownButton>
      </Row>

      <Row className="mb-2">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {questions.length > 0 && <h3>Imported Data:</h3>}
        {questions &&
          questions.map((question: IQuestion, i) => {
            return (
              <CSVQuestionCard
                key={`${i}-${question.question}`}
                questionObj={question}
              />
            );
          })}
      </Row>
      {questions.length > 0 && (
        <Row>
          <Col className="text-center">
            <Button onClick={() => addAllQuestions(questions)}>Save All</Button>
          </Col>
        </Row>
      )}
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </>
  );
};

export default CSVFileReader;

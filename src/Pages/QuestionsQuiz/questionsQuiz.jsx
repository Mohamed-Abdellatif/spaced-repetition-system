import "./questionsQuiz.css";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import moment from "moment";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSync } from "@fortawesome/free-solid-svg-icons";
import { getQuestionImage, todayFormatDate } from "../../Utils/helperfunctions";
import { questionsApi } from "../../services/api";

const QuestionsQuiz = () => {
  const { genre } = useParams();
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questionImgURL, setQuestionImgURL] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [response, setResponse] = useState("");
  const today = todayFormatDate();
  useEffect(() => {
    if (!currentUser) return;

    const getData = async () => {
      try {
        const questionsResponse = await questionsApi.getQuestions(
          currentUser.uid
        );

        if (genre === "General") {
          setQuestions(questionsResponse);
        } else if (genre === "Due-Today") {
          setQuestions(
            questionsResponse.filter((question) => question.nextTest === today)
          );
        } else {
          setQuestions(
            questionsResponse.filter((question) => question.genre === genre)
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getData();
  }, [genre, currentUser, today]);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentIndex]);
    }
    
    getQuestionImage(questions[currentIndex],setQuestionImgURL);
  }, [questions, currentIndex]);

  const setCurrentQuestion = (question) => {
    if (!question) return;
    setIsFlipped(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsFlipped(true);

    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect =
      currentAnswer.toLowerCase().trim() ===
      question.answer.toLowerCase().trim();
    setResponse(
      isCorrect
        ? "Right Answer ✅"
        : `Wrong Answer ❌ (Correct: ${question.answer})`
    );

    // Get last test date (if null, set to today)
    const prevInterval = question.interval || 2; // Default interval is 2 days
    const stability = question.stability || 2.5; // Initial stability factor

    let newInterval;
    let newStability = stability;

    if (isCorrect) {
      // Increase interval exponentially based on stability
      newInterval = Math.round(prevInterval * newStability);
      newStability += 0.15; // Gradually increase stability
    } else {
      // Reset interval to 2 days and decrease stability
      newInterval = 2;
      newStability = Math.max(1.3, stability - 0.2);
    }

    const nextTestDate = moment().add(newInterval, "days").format();
    // Update question data
    if (question.nextTest <= today || question.nextTest === null) {
      await questionsApi.updateQuestion(question.id, {
        nextTest: nextTestDate,
        lastTested: moment().format(),
        interval: newInterval, // Store interval for better adaptation
        stability: newStability, // Store stability factor
      });
    }

    setCurrentAnswer("");

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setResponse("All Questions Are Done 🎉");
        setIsFlipped(true);
      }
    }, 2000);
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  return (
    <Container className="quiz-container">
      <Row className="w-100">
        <Col>
          <h1 className="quiz-title p-1">
            {genre !== "all" ? genre : "General"} Quiz
          </h1>
        </Col>
      </Row>

      {questions.length > 0 ? (
        <>
          <Row className="justify-content-center w-100">
            <Col xs={12} md={8} lg={6}>
              <div className="progress-bar">
                <progress value={currentIndex + 1} max={questions.length} />
                <span>
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="card-container">
                <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      {questions[currentIndex]?.questionType === "image" && (
                        <img
                          src={questionImgURL}
                          className=""
                          alt="question"
                          width={"330px"}
                          height={"300px"}
                        />
                      )}
                      <h3 className="question-text">
                        {questions[currentIndex]?.question}
                      </h3>
                      <Form
                        onSubmit={handleSubmit}
                        className="w-100 d-flex flex-column align-items-center"
                      >
                        <Form.Control
                          type="text"
                          className="answer-input"
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          disabled={isFlipped}
                          autoFocus
                        />
                        <Button
                          type="submit"
                          className="submit-btn"
                          disabled={isFlipped || !currentAnswer.trim()}
                        >
                          Submit Answer
                        </Button>
                      </Form>
                    </div>

                    <div className="flip-card-back">
                      {currentIndex === questions.length - 1 &&
                      response === "All Questions Are Done 🎉" ? (
                        <div className="text-center">
                          <h3 className="feedback-text mb-4">{response}</h3>
                          <Button
                            variant="light"
                            className="restart-btn"
                            onClick={() => {
                              setCurrentIndex(0);
                              setQuestions(shuffle([...questions]));
                              setIsFlipped(false);
                              setResponse("");
                            }}
                          >
                            <FontAwesomeIcon icon={faSync} className="me-2" />
                            Restart Quiz
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <FontAwesomeIcon
                            icon={
                              response.includes("Right Answer")
                                ? faCheck
                                : faTimes
                            }
                            size="3x"
                            className={`feedback-icon ${
                              response.includes("Right Answer")
                                ? "success"
                                : "error"
                            }`}
                          />
                          <h3 className="feedback-text">{response}</h3>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center mt-5">
          <h3>No questions available for this category.</h3>
          <p className="text-muted">
            Try selecting a different category or add some questions first.
          </p>
        </div>
      )}
    </Container>
  );
};

export default QuestionsQuiz;

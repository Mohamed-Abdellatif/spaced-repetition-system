import { useState, useEffect, useCallback, useContext } from "react";
import {
  Card,
  Button,
  ProgressBar,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { UserContext } from "../../contexts/user.context";
import "./StudyCards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faRotateRight,
  faEye,
  faEyeSlash,
  faAward,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { listsApi, questionsApi } from "../../services/api";

const StudyCards = () => {
  const { listName } = useParams();
  const [cards, setCards] = useState([]);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [remembered, setRemembered] = useState([]);
  const [reviewAgain, setReviewAgain] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  // Fetch cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        let questionRes = [];
        const response = await listsApi.getListQuestions(
          listName.replaceAll("%20", " "),
          currentUser?.uid
        );
        const publicListResponse = await listsApi.getPublicListQuestions(
          listName.replaceAll("%20", " ")
        );
        if (response[0]?.questions.length > 0) {
          questionRes = await questionsApi.getQuestionsByIds(
            response[0]?.questions
          );
        } else {
          questionRes = await questionsApi.getQuestionsByIds(
            publicListResponse[0]?.questions
          );
        }
        setCards(questionRes);
        setCardCount(questionRes.length);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchCards();
    }
  }, [currentUser, listName]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case " ":
          e.preventDefault();
          setShowAnswer((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, showAnswer]);

  useEffect(() => {
    if (
      remembered?.includes(cards[currentIndex]?.id) &&
      cards.length > remembered.length
    ) {
      if (isNextClicked) {
        handleNext();
        setIsNextClicked(false);
      } else {
        handlePrevious();
      }
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    setIsNextClicked(true);
    setCurrentIndex((prev) => (prev > -1 ? (prev + 1) % cards.length : prev));
  }, [cards.length]);

  const handlePrevious = useCallback(() => {
    setIsNextClicked(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const card = cards[currentIndex];

  const handleRemembered = useCallback(() => {
    if (card?.id) {
      setRemembered((prev) =>
        prev.includes(card.id) ? prev : [...prev, card.id]
      );
      setReviewAgain((prev) => prev.filter((id) => id !== card.id));
    }
    handleNext();
  }, [card, handleNext]);

  const handleReviewAgain = useCallback(() => {
    if (card?.id) {
      setReviewAgain((prev) =>
        prev.includes(card.id) ? prev : [...prev, card.id]
      );
      setRemembered((prev) => prev.filter((id) => id !== card.id));
    }
    handleNext();
  }, [card, handleNext]);

  // Progress Calculation
  const progress = cardCount > 0 ? (remembered.length / cardCount) * 100 : 0;

  if (isLoading) {
    return (
      <Container className="study-container d-flex justify-content-center align-items-center">
        <Spinner />
      </Container>
    );
  }

  if (cards.length === 0) {
    return (
      <Container className="study-container">
        <div className="text-center">
          <h3>No cards to study</h3>
          <p>Add some questions to start studying!</p>
        </div>
      </Container>
    );
  }
  if (cards.length === remembered.length) {
    return (
      <Container className="study-container">
        <Row className="text-center ">
          <Col xs={12}>
            <h3>
              <FontAwesomeIcon icon={faAward} /> You finished Studying!!!
            </h3>
          </Col>
          <Col xs={12}>
            <Button
              className="mt-3"
              variant="primary"
              onClick={() => {
                setCurrentIndex(0);
                setRemembered([]);
                setReviewAgain([]);
              }}
            >
              Restart Studying
              <FontAwesomeIcon icon={faSync} className="ms-2" />
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="study-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="card-holder p-0">
          <Card className="study-progress  mb-4">
            <Card.Body>
              <ProgressBar
                variant="success"
                now={progress}
                label={`${Math.round(progress)}%`}
              />
              <Row className="stats mt-2">
                <Col className="text-success text-center">
                  Remembered: {remembered?.length || 0}
                </Col>
                <Col className="text-warning text-center">
                  To Review: {reviewAgain?.length || 0}
                </Col>

                <Col className="text-muted text-center">
                  Remaining: {cardCount - remembered.length}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="study-card align-content-between">
            <Card.Body className="text-center">
              <Row className="card-content">
                <Card.Title className="question-text">
                  {cards[currentIndex]?.question}
                </Card.Title>

                <div className={`answer-section ${showAnswer ? "show" : ""}`}>
                  {showAnswer && (
                    <Card.Text className="answer-text">
                      {cards[currentIndex]?.answer}
                    </Card.Text>
                  )}
                </div>
              </Row>

              <Row className=" mt-4 justify-content-between">
                <Col md={3} className="justify-content-center">
                  <Button
                    variant="outline-secondary"
                    onClick={handlePrevious}
                    disabled={cards.length < 0}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Prev
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    <FontAwesomeIcon icon={showAnswer ? faEyeSlash : faEye} />{" "}
                    {showAnswer ? "Hide Answer" : "Show Answer"}
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleNext}
                    disabled={cards.length < 0}
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Button>
                </Col>
              </Row>

              <Row className="feedback-buttons mt-3">
                <Col x={6} md={4}>
                  <Button
                    variant="success"
                    onClick={handleRemembered}
                    className="me-2"
                    disabled={remembered.includes(card?.id)}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Remembered
                  </Button>
                </Col>
                <Col x={6} md={4}>
                  <Button
                    variant="warning"
                    onClick={handleReviewAgain}
                    disabled={reviewAgain?.includes(card?.id)}
                  >
                    <FontAwesomeIcon icon={faRotateRight} /> Review Again
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudyCards;

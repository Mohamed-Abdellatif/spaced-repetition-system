import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBook } from "@fortawesome/free-solid-svg-icons";
import "./spacedSchedule.css";
import { questionsApi } from "../../services/api";
import type { IQuestion } from "../../vite-env";

const SpacedSchedule = () => {
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await questionsApi.getQuestions(currentUser.uid);

      setQuestions(response);

      const eventList = response
        .filter((q: IQuestion) => q.nextTest !== null)
        .map((q: IQuestion) => ({
          title: q.question,
          start: moment(q.nextTest).format("YYYY-MM-DD"),
          backgroundColor: "var(--bs-primary)",
          textColor: "white",
          borderColor: "var(--bs-primary)",
          extendedProps: {
            questionText: q.question,
            questionId: q.id,
            question: q,
          },
        }));

      setEvents(eventList);
    } catch (err) {
      console.error("Error fetching spaced repetition schedule:", err);
    }
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  const handleDateClick = (info: any) => {
    const dateClicked = info.dateStr;
    setSelectedDate(moment(dateClicked).format("MMMM Do YYYY"));

    const filteredQuestions = questions.filter(
      (q: IQuestion) => moment(q.nextTest).format("YYYY-MM-DD") === dateClicked
    );

    setSelectedQuestions(filteredQuestions);
    setShowModal(true);
  };

  const handleEventClick = (info: any) => {
    const eventDate = moment(info.event.start).format("YYYY-MM-DD");
    setSelectedDate(moment(eventDate).format("MMMM Do YYYY"));

    const filteredQuestions = questions.filter(
      (q: IQuestion) => moment(q.nextTest).format("YYYY-MM-DD") === eventDate
    );

    setSelectedQuestions(filteredQuestions);
    setShowModal(true);
  };

  const updateQuestionDate = async (
    questionId: number,
    date: Date | null,
    question: IQuestion
  ) => {
    if (!date) return;
    await questionsApi.updateQuestion(questionId, {
      ...question,
      nextTest: moment(date).format(),
    });
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">
            <FontAwesomeIcon icon={faCalendar} className="me-3" />
            Spaced Repetition Schedule
          </h1>
          <p className="page-description">
            Track your learning progress and review schedule
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="schedule-card">
            <Card.Body>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventBorderColor="#fff"
                height="auto"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek",
                }}
                editable={true} // enables dragging and resizing
                eventDrop={(info) => {
                  updateQuestionDate(
                    info.event.extendedProps.questionId,
                    info.event.start,
                    info.event.extendedProps.question
                  );
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="schedule-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faBook} className="me-2" />
            Questions for {selectedDate}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestions.length > 0 ? (
            <div className="questions-list">
              {selectedQuestions.map((q: IQuestion, index) => (
                <Card key={q.id} className="question-card mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-start">
                      <div className="question-number me-3">{index + 1}</div>
                      <div>
                        <h5 className="question-text mb-2">{q.question}</h5>
                        <p className="answer-text mb-0">
                          <strong>Answer:</strong> {q.answer}
                        </p>
                      </div>
                    </div>
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
    </Container>
  );
};

export default SpacedSchedule;

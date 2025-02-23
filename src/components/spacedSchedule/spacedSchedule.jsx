import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button } from "react-bootstrap";
import "./spacedSchedule.css"; // Import custom CSS for styling

const dataURL = "http://localhost:3001";

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
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser.uid,
      });

      setQuestions(response.data);

      const eventList = response.data
        .filter((q) => q.nextTest !== null)
        .map((q) => ({
          title: q.question,
          start: moment(q.nextTest).format("YYYY-MM-DD"),
          backgroundColor: "#ffcc00",
          textColor: "#333",
          extendedProps: { questionText: q.question, questionId: q.id },
        }));

      setEvents(eventList);
    } catch (err) {
      console.error("Error fetching spaced repetition schedule:", err);
    }
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  const handleDateClick = (info) => {
    const dateClicked = info.dateStr;
    setSelectedDate(moment(dateClicked).format("MMMM Do YYYY"));

    const filteredQuestions = questions.filter(
      (q) => moment(q.nextTest).format("YYYY-MM-DD") === dateClicked
    );

    setSelectedQuestions(filteredQuestions);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventDate = moment(info.event.start).format("YYYY-MM-DD");

    setSelectedDate(moment(eventDate).format("MMMM Do YYYY"));

    const filteredQuestions = questions.filter(
      (q) => moment(q.nextTest).format("YYYY-MM-DD") === eventDate
    );

    setSelectedQuestions(filteredQuestions);
    setShowModal(true);
  };

  return (
    <div className="schedule-container">
      <div className="schedule-card">
        <h2 className="schedule-title">📅 Spaced Repetition Schedule</h2>

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
        />
      </div>

      {/* Modal for Questions */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📖 Questions for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuestions.length > 0 ? (
            selectedQuestions.map((q, index) => (
              <p key={q.id} className="modal-question">
                <strong>{index + 1}.</strong> {q.question}<br/> Answer= {q.answer}
              </p>
            ))
          ) : (
            <p className="no-questions">No questions scheduled for this date.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SpacedSchedule;

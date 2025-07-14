import moment from "moment";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./spacedSchedule.css";

import type { IQuestion } from "../../vite-env";
import useCalendarQuestions from "../../hooks/useCalendarQuestions";
import useEditQuestion from "../../hooks/useEditQuestion";
import EditModal from "../../components/EditModal/editModal";
import { ToEditQuestionObj } from "../../Utils/constants";
import { handleImageChange } from "../../Utils/helperfunctions";
import NotificationToast from "../../components/Toast/toast";
import useDeleteQuestion from "../../hooks/useDeleteQuestion";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import CalendarQuestionsModal from "../../components/CalendarQuestionsModal/CalendarQuestionsModal";

const SpacedSchedule = () => {
  const { currentUser } = useContext(UserContext);
  const [response, setResponse] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { questions, updateQuestionDate, refetch } =
    useCalendarQuestions(currentUser);

  const {
    showEditModal,
    setShowEditModal,
    toEdit,
    updateInput,
    handleEditSubmit,
    setToEdit,
    setEditImage,
    handleEditClick,
  } = useEditQuestion(refetch, setIsNotificationVisible, setResponse);

  const {
    handleDeleteClick,
    showDeleteModal,
    setShowDeleteModal,
    deleteQuestion,
    toDelete,
  } = useDeleteQuestion(refetch, setIsNotificationVisible, setResponse);

  const events = useMemo(() => {
    return questions
      .filter((question) => question.nextTest !== null)
      .map((question) => ({
        title: question.question,
        start: moment(question.nextTest).format("YYYY-MM-DD"),
        backgroundColor: "var(--bs-primary)",
        textColor: "white",
        borderColor: "var(--bs-primary)",
        extendedProps: {
          questionText: question.question,
          questionId: question.id,
          question: question,
        },
      }));
  }, [questions]);

  const handleDateClick = (info: any) => {
    const dateClicked = info.dateStr;
    setSelectedDate(moment(dateClicked).format("MMMM Do YYYY"));

    const filteredQuestions = questions.filter(
      (question: IQuestion) =>
        moment(question.nextTest).format("YYYY-MM-DD") === dateClicked
    );

    setSelectedQuestions(filteredQuestions);
    setShowModal(true);
  };

  const handleEventClick = (info: any) => {
    const question = info.event.extendedProps.question;

    setSelectedQuestions([question]);
    setShowModal(true);
  };

  const handleEventDrop = async (info: any) => {
    const { questionId, question } = info.event.extendedProps;
    const newDate = info.event.start;

    if (!newDate) return;
    updateQuestionDate.mutate({
      questionId,
      date: newDate,
      question,
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
                  handleEventDrop(info);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <CalendarQuestionsModal
        showModal={showModal}
        selectedDate={selectedDate}
        selectedQuestions={selectedQuestions}
        handleEditClick={handleEditClick}
        setShowModal={setShowModal}
        handleDeleteClick={handleDeleteClick}
      />
      <EditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        questionObj={toEdit ? toEdit : ToEditQuestionObj}
        updateInput={updateInput}
        handleSubmit={handleEditSubmit}
        setQuestionObj={setToEdit}
        handleImageChange={(e) => handleImageChange(e, setEditImage)}
      />
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deleteQuestion={deleteQuestion}
        toDelete={toDelete ? toDelete : ToEditQuestionObj}
      />
    </Container>
  );
};

export default SpacedSchedule;

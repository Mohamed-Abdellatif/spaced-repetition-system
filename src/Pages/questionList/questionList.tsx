import { useState, useContext } from "react";
import { Row, Col, Button, Spinner, Container } from "react-bootstrap";
import "./questionList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddModal from "../../components/AddModal/AddModal";
import List from "../../components/ViewQuestionsList/List";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import NotificationToast from "../../components/Toast/toast";
import EditModal from "../../components/EditModal/editModal";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../../components/AddToListModal/AddToListModal";
import { listsApi } from "../../services/api";
import {
  addQuestionToList,
  generateQuestionFromText,
  handleImageChange,
} from "../../Utils/helperfunctions";
import { useQuestions } from "../../hooks/useQuestions";
import SearchBar from "../../components/SearchBar/SearchBar";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import { ToEditQuestionObj } from "../../Utils/constants";
import type { IList, IQuestion } from "../../vite-env";
import useEditQuestion from "../../hooks/useEditQuestion";
import useDeleteQuestion from "../../hooks/useDeleteQuestion";
import useAddQuestion from "../../hooks/useAddQuestion";
import QuestionsInfo from "../../components/QuestionsInfo/QuestionsInfo";

const QuestionList = () => {
  const { currentUser } = useContext(UserContext);

  const {
    loading,
    questions,
    allQuestions,
    questionsLength,
    currentGenre,
    setCurrentGenre,
    lists,
    response,
    isNotificationVisible,
    setIsNotificationVisible,
    setResponse,
    searchQuestions,
    loadMoreData,
    getData,
    uniqueGenres,
  } = useQuestions(currentUser);

  const {
    setQuestionAsImage,
    setQuestionObj,
    handleAddClick,
    showAddModal,
    setShowAddModal,
    questionObj,
    updateAddInput,
    handleAddSubmit,
    setImage,
    questionAsImage,
    image,
  } = useAddQuestion(
    currentUser,
    setIsNotificationVisible,
    setResponse,
    getData
  );

  const {
    showEditModal,
    setShowEditModal,
    toEdit,
    updateInput,
    handleEditSubmit,
    setToEdit,
    setEditImage,
    handleEditClick,
  } = useEditQuestion(getData, setIsNotificationVisible, setResponse);

  const {
    handleDeleteClick,
    showDeleteModal,
    setShowDeleteModal,
    deleteQuestion,
    toDelete,
  } = useDeleteQuestion(getData, setIsNotificationVisible, setResponse);

  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const [toBeAdded, setToBeAdded] = useState<IQuestion>(ToEditQuestionObj);
  const [newListName, setNewListName] = useState("");

  const handleAddToListClick = (question: IQuestion) => {
    setToBeAdded(question);
    setShowAddToListModal(true);
  };

  const addToList = async (list: IList) => {
    await addQuestionToList(
      list,
      toBeAdded,
      lists,
      setResponse,
      setIsNotificationVisible,
      currentUser
    );
  };

  const updateNewListInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName(e.target.value);
  };

  //create new list
  const createNewList = async (newListName: string) => {
    try {
      setNewListName("");
      await listsApi.createList({
        listName: newListName,
        userId: currentUser?.uid,
        questions: [],
      });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleQuestionAsImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    setQuestionAsImage(event.target.files[0]);
  };

  const handleGenerateQuestionFromText = async (text: string) => {
    await generateQuestionFromText(
      text,
      setIsNotificationVisible,
      setResponse,
      setQuestionObj,
      currentUser
    );
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <SearchBar onSearch={searchQuestions} />
        </Col>
        <Col xs={12} md={3} className="mb-3 mb-md-0">
          <GenreFilter
            currentGenre={currentGenre}
            setCurrentGenre={setCurrentGenre}
            allQuestions={allQuestions}
          />
        </Col>
        <Col xs={12} md={3}>
          <Button
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleAddClick}
            disabled={currentUser === null}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Question
          </Button>
        </Col>
      </Row>
      {currentUser?.uid && (
        <QuestionsInfo
          questions={questions}
          currentGenre={currentGenre}
          questionsLength={questionsLength}
        />
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <List
            listType={"private"}
            questions={questions.sort(
              (a: { id: number }, b: { id: number }) => a.id - b.id
            )}
            setToDelete={handleDeleteClick}
            setToEdit={handleEditClick}
            addToList={handleAddToListClick}
          />
          {questionsLength > questions.length &&
            currentGenre === "ALL GENRES" && (
              <div className="text-center mt-4">
                <Button variant="outline-primary" onClick={loadMoreData}>
                  Load More
                </Button>
              </div>
            )}
        </>
      )}

      <AddModal
        generateQuestionFromText={handleGenerateQuestionFromText}
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        questionObj={questionObj ? questionObj : ToEditQuestionObj}
        updateInput={updateAddInput}
        handleSubmit={handleAddSubmit}
        setQuestionObj={setQuestionObj}
        handleImageChange={(e) => handleImageChange(e, setImage)}
        handleQuestionAsImageChange={handleQuestionAsImageChange}
        questionAsImage={questionAsImage}
        image={image}
        genres={uniqueGenres}
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

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deleteQuestion={deleteQuestion}
        toDelete={toDelete ? toDelete : ToEditQuestionObj}
      />

      <AddToListModal
        show={showAddToListModal}
        onHide={() => setShowAddToListModal(false)}
        addToList={(list: IList) => {
          addToList(list);
          setShowAddToListModal(false);
        }}
        lists={lists ? lists : []}
        updateInput={updateNewListInput}
        newListName={newListName}
        createNewList={(name: string) => createNewList(name)}
      />

      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </Container>
  );
};

export default QuestionList;

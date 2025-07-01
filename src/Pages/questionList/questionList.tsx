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
import { imagesApi, listsApi, questionsApi } from "../../services/api";
import {
  addQuestionToList,
  generateQuestionFromText,
  generateWrongChoicesFromText,
  handleNotification,
  todayFormatDate,
} from "../../Utils/helperfunctions";
import { useQuestions } from "../../hooks/useQuestions";
import SearchBar from "../../components/SearchBar/SearchBar";
import GenreFilter from "../../components/GenreFilter/GenreFilter";
import { QuestionObj, ToEditQuestionObj } from "../../Utils/constants";
import type { IList, IQuestion } from "../../vite-env";

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

  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const [image, setImage] = useState<any | null>(null);
  const [questionAsImage, setQuestionAsImage] = useState<any | null>(null);
  const [toEdit, setToEdit] = useState<IQuestion | null>({
    ...ToEditQuestionObj,
  });
  const [toDelete, setToDelete] = useState<IQuestion | null>(null);
  const [toBeAdded, setToBeAdded] = useState<IQuestion >(ToEditQuestionObj);
  const [newListName, setNewListName] = useState("");
  const [questionObj, setQuestionObj] = useState<IQuestion | null>({
    ...QuestionObj,
  });
  // Modal handlers
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (question: IQuestion) => {
    setToEdit(question);
    setShowEditModal(true);
  };

  const handleDeleteClick = (question: IQuestion) => {
    setToDelete(question);
    setShowDeleteModal(true);
  };

  const handleAddToListClick = (question: IQuestion) => {
    setToBeAdded(question);
    setShowAddToListModal(true);
  };

  // delete
  const deleteQuestion = async () => {
    try {
      if (!toDelete?.id) {
        return;
      }
      const response = await questionsApi.deleteQuestion(toDelete?.id);
      await imagesApi.deleteImage(toDelete?.id);
      if (toDelete?.questionType === "image") {
        await imagesApi.deleteQuestionAsImage(toDelete.id);
      }
      getData();
      handleNotification(setIsNotificationVisible, setResponse, response);
      setShowDeleteModal(false);
    } catch {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Error please try again later"
      );
    }
  };

  // edit
  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToEdit({
      ...(toEdit as IQuestion),
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    let wrongChoicesObj = { choice1: "", choice2: "", choice3: "" };
    if (!toEdit) {
      return;
    }
    const { question, answer, difficulty, genre } = toEdit;
    if (question != " " && answer != " " && difficulty && genre != " ") {
      try {
        if (!toEdit.id) {
          return;
        }
        if (toEdit.questionType === "MCQ") {
          wrongChoicesObj = await generateWrongChoicesFromText(
            question,
            answer,
            setIsNotificationVisible,
            setResponse
          );
        }

        const response = await questionsApi.updateQuestion(toEdit.id, {
          ...toEdit,
          choices: wrongChoicesObj,
        });

        if (image !== null && toEdit.id) {
          if (toEdit?.img) {
            await imagesApi.deleteImage(toEdit.id);
          }
          handleImageSubmit(toEdit.id);
        }
        setImage(null);
        getData();
        handleNotification(setIsNotificationVisible, setResponse, response);
        setShowEditModal(false);
      } catch (err: any) {
        handleNotification(setIsNotificationVisible, setResponse, err.message);
      }
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please complete the blanks"
      );
    }
  };

  //add
  const updateAddInput = (
    e: any,
    selectedOption:any=null
  ) => {
    if (
      selectedOption?.name === "genre" &&
      selectedOption?.action !== "clear"
    ) {
      const name = selectedOption.name;
      setQuestionObj({
        ...(questionObj as IQuestion),
        [name]: e.value,
        userId: currentUser?.uid,
      });
    } else if (selectedOption?.action === "clear") {
      const name = selectedOption.name;
      setQuestionObj({
        ...(questionObj as IQuestion),
        [name]: "",
        userId: currentUser?.uid,
      });
    } else {
      setQuestionObj({
        ...(questionObj as IQuestion),
        [e.target.name]: e.target.value,
        userId: currentUser?.uid,
      });
    }
  };

  const handleAddSubmit = async () => {
    let wrongChoicesObj;
    if (!questionObj) {
      return;
    }
    const { question, answer, difficulty, genre, questionType } = questionObj;
    if (
      question != " " &&
      answer != " " &&
      difficulty &&
      genre != " " &&
      (questionType === "image" ? questionAsImage !== null : true)
    ) {
      if (questionType === "MCQ") {
        wrongChoicesObj = await generateWrongChoicesFromText(
          question,
          answer,
          setIsNotificationVisible,
          setResponse
        );
      }
      const created = todayFormatDate();
      const nextTest = created;
      const response = await questionsApi.createQuestion({
        ...questionObj,
        choices: wrongChoicesObj,
        created,
        nextTest,
      });
      if (questionType === "image") {
        handleQuestionAsImageSubmit(response.id);
      }

      handleImageSubmit(response.id);
      setImage(null);
      setQuestionAsImage(null);
      getData();

      setQuestionObj({ ...QuestionObj });
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        response.message
      );
      setShowAddModal(false);
    } else {
      if (questionType === "image" && questionAsImage === null) {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please upload an image"
        );
      } else {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please complete the blanks"
        );
      }
    }
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImage(event.target.files[0]);
  };
  const handleQuestionAsImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    setQuestionAsImage(event.target.files[0]);
  };

  const handleImageSubmit = async (questionID: number) => {
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      await imagesApi.uploadImage(questionID, formData);
    }
  };
  const handleQuestionAsImageSubmit = async (questionID: number) => {
    if (questionAsImage) {
      const formData = new FormData();
      formData.append("image", questionAsImage);
      await imagesApi.uploadImageAsQuestion(questionID, formData);
    }
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
        questionObj={questionObj?questionObj:ToEditQuestionObj}
        updateInput={updateAddInput}
        handleSubmit={handleAddSubmit}
        setQuestionObj={setQuestionObj}
        handleImageChange={handleImageChange}
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
        handleImageChange={handleImageChange}
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

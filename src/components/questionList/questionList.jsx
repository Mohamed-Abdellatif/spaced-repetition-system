import { useState, useContext } from "react";

import {
  Row,
  Col,
  Button,
  Spinner,
  Container,
} from "react-bootstrap";
import "./questionList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddModal from "../AddModal/AddModal";
import List from "../ViewQuestionsList/List";
import DeleteModal from "../DeleteModal/DeleteModal";
import NotificationToast from "../Toast/toast";
import EditModal from "../EditModal/editModal";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../AddToListModal/AddToListModal";
import { imagesApi, listsApi, questionsApi } from "../../Utils/api";
import { addQuestionToList, generateQuestionFromText, handleNotification } from "../../Utils/helperfunctions";
import { useQuestions } from "../../hooks/useQuestions";
import SearchBar from "../SearchBar/SearchBar";
import GenreFilter from "../GenreFilter/GenreFilter";

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
    getData
  } = useQuestions(currentUser);

  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const [image, setImage] = useState(null);
  const [toEdit, setToEdit] = useState({
    question: "",
    difficulty: "",
    answer: "",
    genre: "",
    questionType: "",
  });
  const [toDelete, setToDelete] = useState({});
  const [toBeAdded, setToBeAdded] = useState({});
  const [newListName, setNewListName] = useState("");
  const [questionObj, setQuestionObj] = useState({
    question: "",
    difficulty: "",
    answer: "",
    userId: "",
    genre: "",
    questionType: "MCQ",
    choices: {
      choice1: "",
      choice2: "",
      choice3: "",
    },
  });

  // Modal handlers
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (question) => {
    setToEdit(question);
    setShowEditModal(true);
  };

  const handleDeleteClick = (question) => {
    setToDelete(question);
    setShowDeleteModal(true);
  };

  const handleAddToListClick = (question) => {
    setToBeAdded(question);
    setShowAddToListModal(true);
  };

  // delete
  const deleteQuestion = async () => {
    try {
      const response = await questionsApi.deleteQuestion(toDelete.id);
      await imagesApi.deleteImage(toDelete.id);
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
  const updateInput = (e) => {
    setToEdit({
      ...toEdit,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    const { question, answer, difficulty, genre } = toEdit;
    if (
      !question == " " &&
      !answer == " " &&
      !difficulty == " " &&
      !genre == " "
    ) {
      try {
        const response = await questionsApi.updateQuestion(toEdit.id, toEdit);

        if (image !== null) {
          if (toEdit.img) {
            await imagesApi.deleteImage(toEdit.id);
          }
          handleImageSubmit(toEdit.id);
        }
        setImage(null);
        getData();
        handleNotification(setIsNotificationVisible, setResponse, response);
        setShowEditModal(false);
      } catch (err) {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Error please try again later"
        );
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
  const updateAddInput = (e) => {
    setQuestionObj({
      ...questionObj,
      [e.target.name]: e.target.value,
      userId: currentUser?.uid,
    });
  };

  const handleAddSubmit = async () => {
    const { question, answer, difficulty, genre } = questionObj;
    if (
      !question == " " &&
      !answer == " " &&
      !difficulty == " " &&
      !genre == " "
    ) {
      const created = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      });
      const nextTest = created;
      const response = await questionsApi.createQuestion({
        ...questionObj,
        created,
        nextTest,
      });
      handleImageSubmit(response.id);
      setImage(null);
      getData();

      setQuestionObj({
        question: "",
        difficulty: "",
        answer: "",
        genre: "",
        questionType: "MCQ",
        choices: {
          choice1: "",
          choice2: "",
          choice3: "",
        },
      });
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        response.message
      );
      setShowAddModal(false);
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please complete the blanks"
      );
    }
  };

  const addToList = async (list) => {
    await addQuestionToList(list, toBeAdded,lists,setResponse,setIsNotificationVisible,currentUser);
  };

  const updateNewListInput = (e) => {
    setNewListName(e.target.value);
  };

  //create new list
  const createNewList = async (newListName) => {
    try {
      setNewListName("");
      await listsApi.createList({
        listName: newListName,
        userId: currentUser?.uid,
      });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleImageSubmit = async (questionID) => {
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      await imagesApi.uploadImage(questionID, formData);
    }
  };

  const handleGenerateQuestionFromText = async (text) => {
   await generateQuestionFromText(text,setIsNotificationVisible,setResponse,setQuestionObj,currentUser);
  }

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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <List
            listType={"private"}
            questions={questions.sort((a, b) => a.id - b.id)}
            setToDelete={handleDeleteClick}
            setToEdit={handleEditClick}
            addToList={handleAddToListClick}
          />
          {questionsLength > questions.length && !query.text.length > 0 && (
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
        questionObj={questionObj}
        updateInput={updateAddInput}
        handleSubmit={handleAddSubmit}
        setQuestionObj={setQuestionObj}
        handleImageChange={handleImageChange}
        image={image}
      />

      <EditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        questionObj={toEdit}
        updateInput={updateInput}
        handleSubmit={handleEditSubmit}
        setQuestionObj={setToEdit}
        handleImageChange={handleImageChange}
        image={image}
      />

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deleteQuestion={deleteQuestion}
        toDelete={toDelete}
      />

      <AddToListModal
        show={showAddToListModal}
        onHide={() => setShowAddToListModal(false)}
        addToList={(list) => {
          addToList(list);
          setShowAddToListModal(false);
        }}
        lists={lists}
        updateInput={updateNewListInput}
        newListName={newListName}
        createNewList={(name) => createNewList(name)}
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
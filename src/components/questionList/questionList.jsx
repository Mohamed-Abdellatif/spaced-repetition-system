import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Row,
  Col,
  Button,
  DropdownButton,
  Dropdown,
  Spinner,
  Container,
  Form,
  InputGroup,
} from "react-bootstrap";
import "./questionList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

import AddModal from "../AddModal/AddModal";
import List from "../ViewQuestionsList/List";
import DeleteModal from "../DeleteModal/DeleteModal";
import NotificationToast from "../Toast/toast";
import EditModal from "../EditModal/editModal";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../AddToListModal/AddToListModal";
import { imagesApi, listsApi, questionsApi } from "../../Utils/api";
import { handleNotification } from "../../Utils/helperfunctions";

const dataURL = import.meta.env.VITE_SRS_BE_URL;
const Google_API_KEY = import.meta.env.VITE_API_KEY;

const QuestionList = () => {
  const { currentUser } = useContext(UserContext);

  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toEdit, setToEdit] = useState({
    question: "",
    difficulty: "",
    answer: "",
    genre: "",
    questionType: "",
  });
  const [response, setResponse] = useState("");

  const [toDelete, setToDelete] = useState({});
  const [toBeAdded, setToBeAdded] = useState({});

  const [lists, setLists] = useState({});
  const [newListName, setNewListName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsToShow, setQuestionsToShow] = useState(10);
  const [query, setQuery] = useState({ text: "" });
  const [questionsLength, setQuestionsLength] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
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
  const [currentGenre, setCurrentGenre] = useState("ALL GENRES");

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

  const handleSearchUpdate = (e) => {
    setQuery({ text: e.target.value });
  };

  const handleSearchClick = async () => {
    if (currentUser) {
      try {
        const response = await questionsApi.searchQuestions(
          query.text,
          currentUser?.uid
        );
        setQuestions(response);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const response = await questionsApi.getQuestions(
        currentUser?.uid,
        questionsToShow
      );
      const allResponse = await questionsApi.getQuestions(currentUser?.uid);
      const lengthResponse = await questionsApi.getQuestionsLength(
        currentUser?.uid
      );
      setQuestionsLength(lengthResponse);
      setAllQuestions(allResponse);
      const listResponse = await listsApi.getLists(currentUser?.uid);
      const publicListResponse = await listsApi.getPublicListsWithCreatorId(
        currentUser?.uid
      );
      setLists([...listResponse, ...publicListResponse]);
      if (currentGenre === "ALL GENRES") {
        setQuestions(response);
      } else {
        setQuestions(
          allResponse.filter((question) => currentGenre === question.genre)
        );
      }

      setLoading(false);
    } catch (error) {
      if ("Network Error" === error.message) {
        setLoading(false);
      }
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [currentGenre]);
  useEffect(() => {
    if (query.text.length > 0) {
      handleSearchClick();
    } else {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.text]);

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

  const loadMoreData = async () => {
    if (questionsLength > questions.length) {
      setQuestionsToShow(questionsToShow + 5);
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsToShow]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  //insert image
  const handleImageSubmit = async (questionID) => {
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      // eslint-disable-next-line
      await imagesApi.uploadImage(questionID, formData);
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
      await questionsApi.createQuestion({
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

  const genres = [].concat(allQuestions.map((question) => question.genre));
  let filteredArray = [];
  for (let i = 0; i < genres.length; i++) {
    if (!filteredArray.includes(genres[i])) {
      filteredArray.push(genres[i]);
    }
  }
  //add to list
  const addToList = async (list) => {
    const { id } = toBeAdded;
    const { listName } = list;
    try {
      if (list?.creatorId === currentUser?.uid) {
        const response = await listsApi.getPublicListQuestions(listName);
        const listId = lists.filter(
          (list) => list.listName === listName.replaceAll("%20", " ")
        )[0].id;
        if (response[0].questions !== null) {
          if (!response[0].questions.includes(id)) {
            const requestions = response[0].questions;
            await listsApi.updatePublicList(listId, {
              questions: requestions.concat(id),
              creatorId: currentUser?.uid,
            });
            handleNotification(
              setIsNotificationVisible,
              setResponse,
              `Question Added to '${listName}' Successfully`
            );
          } else {
            handleNotification(
              setIsNotificationVisible,
              setResponse,
              "Question already exists in the list"
            );
          }
        } else {
          await listsApi.updatePublicList(listId, {
            questions: [id],
            creatorId: currentUser?.uid,
          });
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            `Question Added to '${listName}' Successfully`
          );
        }
      } else {
        const response = await listsApi.getListQuestions(
          listName,
          currentUser?.uid
        );
        const listId = lists.filter(
          (list) => list.listName === listName.replaceAll("%20", " ")
        )[0].id;
        if (response[0].questions !== null) {
          if (!response[0].questions.includes(id)) {
            const requestions = response[0].questions;
            await listsApi.updateList(listId, {
              questions: requestions.concat(id),
              userId: currentUser?.uid,
            });
            handleNotification(
              setIsNotificationVisible,
              setResponse,
              `Question Added to '${listName}' Successfully`
            );
          } else {
            handleNotification(
              setIsNotificationVisible,
              setResponse,
              "Question already exists in the list"
            );
          }
        } else {
          await listsApi.updateList(listId, {
            questions: [id],
            userId: currentUser?.uid,
          });
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            `Question Added to '${listName}' Successfully`
          );
        }
      }
    } catch (err) {
      handleNotification(setIsNotificationVisible, setResponse, err);
    }
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
  const generateQuestionFromText = async (text) => {
    try {
      const genAI = new GoogleGenerativeAI(Google_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Extract a question from the following text and return it as a **valid JSON object** ONLY.
        No explanations, no Markdown, just plain JSON.  you must complete the question with info extracted from the text below
        The format must match:
        {
            "question": "",
            "difficulty": "0",
            "answer": "",
            "genre": "",
            "questionType": "Short Response",
            "choices": { "choice1": "", "choice2": "", "choice3": "" }
        }
        Here is the text: "${text}"
        `;

      const response = await model.generateContent(prompt);

      if (!response || !response.response) {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please Try Again Later"
        );
        return;
      }

      let responseText = response.response.text().trim();

      if (responseText.startsWith("```json")) {
        responseText = responseText.slice(7, -3).trim();
      }

      let extractedObject;
      try {
        extractedObject = JSON.parse(responseText);
      } catch (jsonError) {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please Try Again Later"
        );
        return;
      }

      if (extractedObject?.question) {
        setQuestionObj({ ...extractedObject, userId: currentUser?.uid });
      } else {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please Try Again Later"
        );
      }
    } catch (error) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search questions..."
              value={query.text}
              onChange={handleSearchUpdate}
            />
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup>
        </Col>
        <Col xs={12} md={3} className="mb-3 mb-md-0">
          <DropdownButton
            id="dropdown-basic-button"
            title={currentGenre}
            variant="outline-primary"
            className="w-100"
            disabled={allQuestions.length < 1}
          >
            <Dropdown.Item
              onClick={() => setCurrentGenre("ALL GENRES")}
              active={currentGenre === "ALL GENRES"}
            >
              ALL GENRES
            </Dropdown.Item>
            {allQuestions
              .map((question) => question.genre)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((genre, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setCurrentGenre(genre)}
                  active={currentGenre === genre}
                >
                  {genre}
                </Dropdown.Item>
              ))}
          </DropdownButton>
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
        generateQuestionFromText={generateQuestionFromText}
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

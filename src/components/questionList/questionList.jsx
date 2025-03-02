import { useState, useEffect } from "react";
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
import axios from "axios";
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

const dataURL = process.env.REACT_APP_SRS_BE_URL;

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
        const response = await axios.post(
          `${dataURL}/searchQuestions/${query.text}`,
          { userId: currentUser?.uid }
        );
        setQuestions(response.data);
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
      const response = await axios.post(`${dataURL}/getQuestions`, {
        questionsNumber: questionsToShow,
        userId: currentUser?.uid,
      });
      const allResponse = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser?.uid,
      });
      const lengthResponse = await axios.post(`${dataURL}/questionsLength`, {
        userId: currentUser?.uid,
      });
      setQuestionsLength(lengthResponse.data);
      setAllQuestions(allResponse.data);
      const listResponse = await axios.post(`${dataURL}/getLists`, {
        userId: currentUser?.uid,
      });
      setLists(listResponse.data);
      if (currentGenre === "ALL GENRES") {
        setQuestions(response.data);
      } else {
        setQuestions(
          allResponse.data.filter((question) => currentGenre === question.genre)
        );
      }

      setLoading(false);
    } catch (error) {
      if ("Network Error" === error.message) {
        setLoading(false);
      }
      console.log(error.message);
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
      const response = await axios.delete(
        `${dataURL}/questions/${toDelete.id}`
      );
      getData();
      setIsNotificationVisible(true);
      setResponse(response.data);
      setShowDeleteModal(false);
    } catch {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
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
      const res = await axios.put(`${dataURL}/upload/${questionID}`, formData);
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
        const response = await axios.put(
          `${dataURL}/questions/${toEdit.id}`,
          toEdit
        );
        setResponse(response.data);
        if (image !== null) {
          handleImageSubmit(toEdit.id);
        }
        setImage(null);
        getData();
        setIsNotificationVisible(true);
        setShowEditModal(false);
      } catch (err) {
        console.log(err);
        setResponse("Error please try again later");
        setIsNotificationVisible(true);
      }
    } else {
      setResponse("Please complete the blanks");
      setIsNotificationVisible(true);
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
      const response = await axios.post(`${dataURL}/questions`, questionObj);
      handleImageSubmit(response.data.id);
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

      setResponse(response.data.message);
      setIsNotificationVisible(true);
      setShowAddModal(false);
    } else {
      setResponse("Please complete the blanks");
      setIsNotificationVisible(true);
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
  const addToList = async (listName) => {
    const { id } = toBeAdded;
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listName,
        userId: currentUser?.uid,
      });

      if (response.data[0].questions !== null) {
        if (!response.data[0].questions.includes(id)) {
          const requestions = response.data[0].questions;

          await axios.put(`${dataURL}/lists/${listName}`, {
            questions: requestions.concat(id),
            userId: currentUser?.uid,
          });
        }
      } else {
        await axios.put(`${dataURL}/lists/${listName}`, {
          questions: [id],
          userId: currentUser?.uid,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateNewListInput = (e) => {
    setNewListName(e.target.value);
  };

  //create new list
  const createNewList = async (newListName) => {
    try {
      setNewListName("");
      await axios.post(`${dataURL}/lists`, {
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
            disabled={allQuestions.length<1}
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
            disabled={currentUser===null}
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
            questions={questions}
            setToDelete={handleDeleteClick}
            setToEdit={handleEditClick}
            addToList={handleAddToListClick}
          />
          {questionsLength > questions.length && (
            <div className="text-center mt-4">
              <Button variant="outline-primary" onClick={loadMoreData}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      <AddModal
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
        addToList={(listName) => {
          addToList(listName);
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

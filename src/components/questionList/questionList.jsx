import { useState, useEffect } from "react";
import { Row, Col, Button, DropdownButton, Dropdown, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import "./questionList.css";

import AddModal from "../AddModal/AddModal";

import List from "../ViewQuestionsList/List";
import DeleteModal from "../DeleteModal/DeleteModal";
import NotificationToast from "../Toast/toast";

import EditModal from "../EditModal/editModal";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../AddToListModal/AddToListModal";

const dataURL = "http://localhost:3001";

const QuestionList = () => {
  const { currentUser } = useContext(UserContext);

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
    if (!currentUser) return;
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
    // eslint-disable-next-line
    if (
      // eslint-disable-next-line
      !question == " " && // eslint-disable-next-line
      !answer == " " && // eslint-disable-next-line
      !difficulty == " " && // eslint-disable-next-line
      !genre == " " // eslint-disable-next-line
    ) {
      try {
        const response = await axios.put(
          `${dataURL}/questions/${toEdit.id}`,
          toEdit
        );
        setResponse(response.data);
        if (image !== null) { handleImageSubmit(toEdit.id) }
        setImage(null)
        getData();
        setIsNotificationVisible(true);
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
      // eslint-disable-next-line
      !question == " " && // eslint-disable-next-line
      !answer == " " && // eslint-disable-next-line
      !difficulty == " " && // eslint-disable-next-line
      !genre == " " // eslint-disable-next-line
    ) {
      const response = await axios.post(`${dataURL}/questions`, questionObj);
      handleImageSubmit(response.data.id)
      setImage(null)
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
    <>
      <div className="fixedHeading">
        <Container className="mt-5">
          <Row className="mb-3 justify-content-between">
            <Col sm={12} md={9} lg={9}>
              <div className="input-group searchInput">
                <input
                  value={query.text}
                  onChange={handleSearchUpdate}
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <Button
                  variant="info"
                  onClick={() => handleSearchClick()}
                  type="button"
                  
                >
                  <i className="fa fa-solid fa-magnifying-glass" />
                </Button>
              </div>
            </Col>
            <Col sm={4} md={3} lg={2} className="d-flex justify-content-end">
              <Button
                data-bs-toggle="modal"
                data-bs-target="#addModal"
                type="button"
                className="btn btn-success addBtn"
              >
                Create New <i className="fa-solid fa-plus" />
              </Button>
            </Col>
          </Row>

          <Row className="">
            <Col sm={8} md={9} lg={2}>
              {questions.length} from {questionsLength}
            </Col>
            <Col sm={4} md={3} lg={2}  >
              <DropdownButton
                disabled={!questions.length}
                title={currentGenre}
                className="ms-3"
              >
                {questions &&
                  filteredArray.map((genre) => (
                    <Dropdown.Item key={genre} onClick={() => setCurrentGenre(genre)}>
                      {genre}
                    </Dropdown.Item>
                  ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setCurrentGenre("All GENRES")}>All GENRES</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
        </Container>
      </div>

      {!loading && currentUser ? (
        <>
          <div className="cards-container">
            <Row className="justify-content-center">
              <Col sm={12} md={10} >
                <List
                  addToList={setToBeAdded}
                  setToEdit={setToEdit}
                  toEdit={toEdit}
                  questions={questions}
                  setToDelete={setToDelete}
                />
              </Col>
            </Row>
          </div>
        </>
      ) : currentUser ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : (
        <h3 className="spinner">Please Sign In</h3>
      )}

      {questions.length < 10 || questionsLength === questions.length ? (
        ""
      ) : (
        <Button
          variant="primary"
          className="loadMoreButton"
          onClick={() => loadMoreData()}
        >
          Load More...
        </Button>
      )}

      <AddModal
        handleImageChange={handleImageChange}
        setQuestionObj={setQuestionObj}
        questionObj={questionObj}
        handleSubmit={handleAddSubmit}
        updateInput={updateAddInput}
      />

      <DeleteModal deleteQuestion={deleteQuestion} toDelete={toDelete} />

      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />

      <EditModal
        handleImageChange={handleImageChange}
        setQuestionObj={setToEdit}
        questionObj={toEdit}
        handleSubmit={handleEditSubmit}
        updateInput={updateInput}
        image={image}
      />

      <AddToListModal
        addToList={addToList}
        lists={lists}
        updateInput={updateNewListInput}
        newListName={newListName}
        createNewList={createNewList}
      />
    </>
  );
};

export default QuestionList;

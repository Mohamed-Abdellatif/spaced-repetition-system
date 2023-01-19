import { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import axios from "axios";
import "./questionList.css";

import AddModal from "../AddModal/AddModal";

import Spinner from "../Spinner/spinner";
import List from "../ViewQuestionsList/List";
import DeleteModal from "../DeleteModal/DeleteModal";
import NotificationToast from "../Toast/toast";

import EditModal from "../EditModal/editModal";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Utils/firebase/firebase.utils";


const dataURL = "http://localhost:3001";

const QuestionList = () => {
  
  const { currentUser,setCurrentUser } = useContext(UserContext);

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
  const [currentGenre, setCurrentGenre] = useState("All");

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
    if(!currentUser)return
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
      if (currentGenre === "All") {
        setQuestions(response.data);
      } else {
        setQuestions(
          allResponse.data.filter((question) => currentGenre === question.genre)
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
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
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User present
        setCurrentUser(currentUser)
        // redirect to home if user is on /login page 
      } else {
        // User not logged in
        // redirect to login if on a protected page 
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (// eslint-disable-next-line
      !question == " " &&// eslint-disable-next-line
      !answer == " " &&// eslint-disable-next-line
      !difficulty == " " &&// eslint-disable-next-line
      !genre == " "// eslint-disable-next-line
    ) {
      try {
        const response = await axios.put(
          `${dataURL}/questions/${toEdit.id}`,
          toEdit
        );
        setResponse(response.data);
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
    if (// eslint-disable-next-line
      !question == " " &&// eslint-disable-next-line
      !answer == " " &&// eslint-disable-next-line
      !difficulty == " " &&// eslint-disable-next-line
      !genre == " "// eslint-disable-next-line
    ) {
      const response = await axios.post(`${dataURL}/questions`, questionObj);
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
      setResponse(response.data);
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

  return (
    <>
      <div className="fixedHeading">
        <div className="heading">
          <div className="input-group mb-3 searchInput">
            <input
              value={query.text}
              onChange={handleSearchUpdate}
              type="text"
              className="form-control "
              placeholder="Search"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn  btn-info"
              onClick={() => handleSearchClick()}
              type="button"
              id="button-addon2"
            >
              <i className="fa fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <button
            data-bs-toggle="modal"
            data-bs-target="#addModal"
            type="button"
            className="btn btn-success addBtn"
          >
            Create New <i className="fa-solid fa-plus" />
          </button>
        </div>
        <div className="Count">
          {questions.length} from {questionsLength}
          <DropdownButton
            id="dropdown-basic-button"
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
            <Dropdown.Item onClick={() => setCurrentGenre("All")}>
              All
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>

      {!loading && currentUser ? (
        <>
          <List
            setToEdit={setToEdit}
            toEdit={toEdit}
            questions={questions}
            setToDelete={setToDelete}
          />
        </>
      ) : currentUser ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <h3 className="spinner">Please Sign In</h3>
      )}

      {questions.length < 10 || questionsLength === questions.length ? (
        ""
      ) : (
        <button
          className="loadMoreButton btn btn-primary"
          onClick={() => loadMoreData()}
        >
          Load More...
        </button>
      )}

      <AddModal
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
        setQuestionObj={setToEdit}
        questionObj={toEdit}
        handleSubmit={handleEditSubmit}
        updateInput={updateInput}
      />
    </>
  );
};

export default QuestionList;

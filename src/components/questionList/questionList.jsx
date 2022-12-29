import { useState, useEffect } from "react";

import axios from "axios";
import "./questionList.css";

import AddModal from "../AddModal/AddModal";

import Spinner from "../Spinner/spinner";
import List from "../List/List";
import DeleteModal from "../DeleteModal/DeleteModal";
import NotificationToast from "../Toast/toast";

import EditModal from "../EditModal/editModal";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
const dataURL = "http://localhost:3001";

const QuestionList = () => {
  const {currentUser} = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [toEdit, setToEdit] = useState({
    question: "",
    difficulty: "",
    answer: "",
  });
  const [response, setResponse] = useState("");
  const [toDelete, setToDelete] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionsToShow, setQuestionsToShow] = useState(10);
  const [query, setQuery] = useState({ text: "" });
  const [questionsLength, setQuestionsLength] = useState(0);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [questionObj, setQuestionObj] = useState({
    question: "",
    difficulty: "",
    answer: "",
    userId:''
  });

  

  

  const handleSearchUpdate = (e) => {
    setQuery({ text: e.target.value });
  };
  
  const handleSearchClick = async () => {
    if(currentUser){
    try {
      const response = await axios.post(
        `${dataURL}/searchQuestions/${query.text}`,{userId:currentUser.uid}
      );
      setQuestions(response.data);
    } catch (err) {
      console.log(err);
    }}
  };
  

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${dataURL}/getQuestions`,{questionsNumber:questionsToShow,userId:currentUser.uid}
      );
      const lengthResponse = await axios.post(`${dataURL}/questionsLength`,{userId:currentUser.uid});
      setQuestionsLength(lengthResponse.data);
      setQuestions(response.data);
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

  // edit
  const updateInput = (e) => {
    setToEdit({
      ...toEdit,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditSubmit = async () => {
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
  };
  //
  
  //add

  const updateAddInput = (e) => {
    setQuestionObj({
      ...questionObj,
      [e.target.name]: e.target.value,
      userId:currentUser.uid
      
    });
  };

  const handleAddSubmit = async () => {
    const response = await axios.post(`${dataURL}/questions`, questionObj);
    
    getData();
    setQuestionObj({
      question: "",
      difficulty: "",
      answer: "",
    });
    setResponse(response.data);
    setIsNotificationVisible(true);
  };

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
      ) : currentUser ? (<div className="spinner"><Spinner /></div>
        
      ):<h3 className="spinner">Please Sign In</h3>}

      {questions.length < 10 ? (
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
        questionObj={toEdit}
        handleSubmit={handleEditSubmit}
        updateInput={updateInput}
      />
    </>
  );
};

export default QuestionList;

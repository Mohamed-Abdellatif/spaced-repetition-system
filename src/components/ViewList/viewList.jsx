import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../AddToListModal/AddToListModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import EditModal from "../EditModal/editModal";
import NotificationToast from "../Toast/toast";
import List from "../ViewQuestionsList/List";
import "./viewList.css";

const dataURL = "http://localhost:3001";

const ViewList = () => {
  const navigate=useNavigate()
  const { listName } = useParams();
  const [toBeAdded, setToBeAdded] = useState({});
  const [lists, setLists] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [editListName, setEditListName] = useState(listName);
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [toEdit, setToEdit] = useState({
    question: "",
    difficulty: "",
    answer: "",
    genre: "",
    questionType: "",
  });
  const [toDelete, setToDelete] = useState({});
  const [newListName, setNewListName] = useState("");
  const [response, setResponse] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listName,
        userId: currentUser?.uid,
      });
      const listResponse = await axios.post(`${dataURL}/getLists`, {
        userId: currentUser?.uid,
      });
      setLists(listResponse.data);
      const res = await axios.post(`${dataURL}/getQuestionsById`, {
        questionsList: response.data[0].questions,
      });
      setQuestions(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listName]);

  //delete
  const deleteQuestion = async () => {
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listName,
        userId: currentUser?.uid,
      });
      const filtered = response.data[0].questions.filter(
        (id) => id !== toDelete.id
      );
      await axios.put(`${dataURL}/lists/${listName}`, {
        questions: filtered,
        userId: currentUser?.uid,
      });
      getData();
      setIsNotificationVisible(true);
      setResponse("Deleted from the list");
    } catch (err) {
      console.log(err);
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
    }
  };

  //edit

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

  //add to list
  const addToList = async (listNameToAdd) => {
    const { id } = toBeAdded;
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listNameToAdd,
        userId: currentUser?.uid,
      });

      if (response.data[0].questions !== null) {
        if (!response.data[0].questions.includes(id)) {
          const requestions = response.data[0].questions;

          await axios.put(`${dataURL}/lists/${listNameToAdd}`, {
            questions: requestions.concat(id),
            userId: currentUser?.uid,
          });
        }
      } else {
        await axios.put(`${dataURL}/lists/${listNameToAdd}`, {
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

  const updateListName = (e) => {
    setEditListName(e.target.value);
  };

  const changeListName=async()=>{
  await axios.put(`${dataURL}/lists/${listName}`, {
    newListName:editListName,
    userId: currentUser?.uid,
  });
  navigate(`/list/${editListName}`)
  setIsClicked(!isClicked)
  }
  return (
    <>
      <div className="question-cards">
        {!isClicked ? (
          <div className="listName">
            <h1>{listName}</h1>
            <button
              onClick={() => setIsClicked(!isClicked)}
              className="editBtn text-primary"
            >
              Rename
            </button>
          </div>
        ) : (
          <div className="listName mb-3">
            <input
              type="text"
              onChange={updateListName}
              value={editListName}
            />
            <button
              onClick={() => changeListName()}
              className="btn btn-outline-primary ms-3"
            >
             Edit
            </button>
            <button
              onClick={() => setIsClicked(!isClicked)}
              className="btn btn-outline-secondary ms-3"
            >
             Cancel
            </button>
          </div>
        )}
        <List
          addToList={setToBeAdded}
          setToEdit={setToEdit}
          toEdit={toEdit}
          questions={questions}
          setToDelete={setToDelete}
        />
      </div>
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

export default ViewList;

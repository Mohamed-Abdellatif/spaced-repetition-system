import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import DeleteModal from "../DeleteModal/DeleteModal";
import EditModal from "../EditModal/editModal";
import NotificationToast from "../Toast/toast";
import List from "../ViewQuestionsList/List";

const dataURL = "http://localhost:3001";

const ViewList = () => {
  const { listName } = useParams();
  console.log(listName);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [toEdit, setToEdit] = useState({
    question: "",
    difficulty: "",
    answer: "",
    genre: "",
    questionType: "",
  });
  const [toDelete, setToDelete] = useState({});
  const [response, setResponse] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listName,
      });
      setQuestions(response.data[0].questions);
      console.log(response.data[0].questions)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listName]);
  //delete
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
        const listResponse = await axios.post(`${dataURL}/getListQuestions`, {
          listName: "hhh ",
        });
        if(Array.isArray(listResponse.data[0].questions) === true){
          const filtered = listResponse.data[0].questions.filter(
            (question) => question.id !== toEdit.id
          );
          await axios.put(`${dataURL}/lists/20`, {
            questions: filtered.concat(toEdit),
          });
        }else{
          await axios.put(`${dataURL}/lists/20`, {
            questions: toEdit,
          });
        }

        

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
  const addToList = async (question) => {
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: "hhh ",
      });

      if (response.data[0].questions !== null) {
        if (Array.isArray(response.data[0].questions) === false) {
          if (response.data[0].questions.id !== question.id) {
            await axios.put(`${dataURL}/lists/20`, {
              questions: [response.data[0].questions, question],
            });
          }
        } else {
          if (
            ![]
              .concat(response.data[0].questions.map((question) => question.id))
              .includes(question.id)
          ) {
            const requestions = response.data[0].questions;

            await axios.put(`${dataURL}/lists/20`, {
              questions: requestions.concat(question),
            });
          }
        }
      } else {
        await axios.put(`${dataURL}/lists/20`, { questions: question });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <List
        addToList={addToList}
        setToEdit={setToEdit}
        toEdit={toEdit}
        questions={questions}
        setToDelete={setToDelete}
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

export default ViewList;

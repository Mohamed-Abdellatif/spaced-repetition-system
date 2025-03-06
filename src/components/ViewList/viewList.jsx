import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../AddToListModal/AddToListModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import EditModal from "../EditModal/editModal";
import NotificationToast from "../Toast/toast";
import List from "../ViewQuestionsList/List";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./viewList.css";

const dataURL = process.env.REACT_APP_SRS_BE_URL;

const ViewList = () => {
  const { listName } = useParams();
  const [toBeAdded, setToBeAdded] = useState({});
  const [lists, setLists] = useState([]);
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

  // Add modal state management
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.post(`${dataURL}/getListQuestions`, {
        listName: listName.replaceAll("%20", " "),
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
        listName: listName.replaceAll("%20", " "),
        userId: currentUser?.uid,
      });
      const filtered = response.data[0].questions.filter(
        (id) => id !== toDelete.id
      );
      await axios.put(`${dataURL}/lists/${listName.replaceAll("%20", " ")}`, {
        questions: filtered,
        userId: currentUser?.uid,
      });
      await getData();
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

        await setResponse(response.data);
        await getData();
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

  // Update handlers for modals
  const handleAddToList = (question) => {
    setToBeAdded(question);
    setShowAddToListModal(true);
  };

  const handleDelete = (question) => {
    setToDelete(question);
    setShowDeleteModal(true);
  };

  const handleEdit = (question) => {
    setToEdit(question);
    setShowEditModal(true);
  };
  const list= lists?.filter(list => list.listName === listName)[0];
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="my-2">
                <Col>
                  <h4 className="mb-0 text-primary text-uppercase">
                    {listName}
                  </h4>
                </Col>
              </Row>
              <Row className="my-2">
                <Col>
                  <h6 className="mb-0 text-secondary text-capitalize">
                    {(list?.description?.length>0)?(list.description):"No Description"}
                  </h6>
                </Col>
              </Row>

              <div className="questions-container">
                <List
                  addToList={handleAddToList}
                  setToEdit={handleEdit}
                  toEdit={toEdit}
                  questions={questions}
                  setToDelete={handleDelete}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deleteQuestion={() => {
          deleteQuestion();
          setShowDeleteModal(false);
        }}
        toDelete={toDelete}
      />
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
      <EditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        setQuestionObj={setToEdit}
        questionObj={toEdit}
        handleSubmit={() => {
          handleEditSubmit();
          setShowEditModal(false);
        }}
        updateInput={updateInput}
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
        createNewList={createNewList}
      />
    </Container>
  );
};

export default ViewList;

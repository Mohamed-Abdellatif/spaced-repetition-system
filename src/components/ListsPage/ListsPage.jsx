import { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import NotificationToast from "../Toast/toast";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import ListsMapper from "../ListsMapper/ListsMapper";
import DeleteListModal from "../DeleteListModal/DeleteListModal";
import EditListModal from "../EditListModal/editListModal";
import AddListModal from "../AddListModal/AddListModal";
import { getDisplayNameFromDocument } from "../../Utils/firebase/firebase.utils";

const dataURL = import.meta.env.VITE_SRS_BE_URL;

const ListsPage = () => {
  const { currentUser } = useContext(UserContext);

  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toEdit, setToEdit] = useState({});
  const [response, setResponse] = useState("");

  const [toDelete, setToDelete] = useState({});

  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState({ listName: "", description: "" });

  const [query, setQuery] = useState({ text: "" });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [questionObj, setQuestionObj] = useState([]);

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

  const handleSearchUpdate = (e) => {
    setQuery({ text: e.target.value });
  };

  const handleSearchClick = async () => {
    if (query.text < 1) {
      getData();
      return;
    }
    if (currentUser) {
      try {
        const response = await axios.post(
          `${dataURL}/searchLists/${query.text}`,
          { userId: currentUser?.uid }
        );
        setLists(response.data.sort((a, b) => a.id - b.id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateAddInput = (e) => {
    e.preventDefault();
    setNewList({ ...newList, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (isListPublic) => {
    try {
      let response = {};
      const displayName = await getDisplayNameFromDocument();
      if (isListPublic) {
        response = await axios.post(`${dataURL}/publicLists`, {
          listName: newList.listName,
          creatorId: currentUser?.uid,
          description: newList.description,
          creator:displayName[currentUser?.email]
        });
      } else {
        response = await axios.post(`${dataURL}/lists`, {
          listName: newList.listName,
          userId: currentUser?.uid,
          description: newList.description,
        });
      }
      setShowAddModal(false);
      setNewList({ listName: "", description: "" });
      getData();
      setResponse(response.data);
      setIsNotificationVisible(true);
    } catch (err) {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
      setShowAddModal(false);
    }
  };

  const getData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const listResponse = await axios.post(`${dataURL}/getLists`, {
        userId: currentUser?.uid,
      });
      const publicListResponse = await axios.post(`${dataURL}/getPublicListsWithCreatorId`, {
        creatorId: currentUser?.uid,
      });
      const res = await axios.post(`${dataURL}/getIds`);
      setQuestionObj([].concat(res.data.map((id) => id.id)));
      setLists([...listResponse.data.sort((a, b) => a.id - b.id),...publicListResponse.data.sort((a, b) => a.id - b.id)]);
      setLoading(false);
      updateLists();
    } catch (error) {
      if ("Network Error" === error.message) {
        setLoading(false);
      }
      setResponse("Network Error");
      setIsNotificationVisible(true);
    }
  };
  const updateLists = async () => {
    lists
      ?.map((list) =>
        list.questions?.filter((question) => questionObj?.includes(question))
      )
      .map((questions, i) =>
        axios.put(`${dataURL}/lists/${lists[i].id}`, {
          newListName: lists[i].listName,
          userId: currentUser?.uid,
          questions: questions,
        })
      );
  };

  const deleteList = async () => {
    try {
      const response = toDelete.creatorId===currentUser.uid?await axios.delete(`${dataURL}/publicLists/${toDelete.id}`):await axios.delete(`${dataURL}/lists/${toDelete.id}`);
      getData();
      setIsNotificationVisible(true);
      setResponse(response.data);
      setShowDeleteModal(false);
    } catch {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
    }
  };
  const updateEditInput = (e) => {
    e.preventDefault();
    setToEdit({ ...toEdit, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const response = toEdit.creatorId!==currentUser.uid?await axios.put(`${dataURL}/lists/${toEdit.id}`, {
        newListName: toEdit.listName,
        userId: currentUser?.uid,
        questions: toEdit.questions,
        description: toEdit.description,
      }):await axios.put(`${dataURL}/publicList/${toEdit.id}`, {
        newListName: toEdit.listName,
        creatorId: currentUser?.uid,
        questions: toEdit.questions,
        description: toEdit.description,
      });
      getData();
      setShowEditModal(false);
      setResponse(response.data);
      setIsNotificationVisible(true);
    } catch {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
      setShowEditModal(false);
    }
  };

  useEffect(() => {
    updateLists();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    handleSearchClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  useEffect(() => {
    updateLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <>
      <Row className="mb-4 justify-content-between">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search lists..."
              value={query.text}
              onChange={handleSearchUpdate}
            />
            <Button variant="outline-primary">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </InputGroup>
        </Col>

        <Col xs={12} md={3}>
          <Button
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center"
            onClick={handleAddClick}
            disabled={currentUser === null}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add List
          </Button>
        </Col>
      </Row>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <ListsMapper
          lists={lists}
          setToDelete={handleDeleteClick}
          setListName={handleEditClick}
          setToEdit={handleEditClick}
          setToAdd={null}
        />
      )}
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
      <DeleteListModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        deleteList={deleteList}
        toDelete={toDelete}
      />
      <EditListModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        toEdit={toEdit}
        handleSubmit={handleEditSubmit}
        updateInput={updateEditInput}
      />
      <AddListModal
        list={newList}
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        updateInput={updateAddInput}
        handleSubmit={handleAddSubmit}
      />
    </>
  );
};

export default ListsPage;

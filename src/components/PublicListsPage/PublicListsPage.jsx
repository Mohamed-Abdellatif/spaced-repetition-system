import { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import NotificationToast from "../Toast/toast";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import ListsMapper from "../ListsMapper/ListsMapper";

const dataURL = import.meta.env.VITE_SRS_BE_URL;

const PublicListsPage = () => {
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
          `${dataURL}/searchPublicLists/${query.text}`,
          { userId: currentUser?.uid }
        );
        setLists(response.data.sort((a, b) => a.id - b.id));
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

      const listResponse = await axios.post(`${dataURL}/getPublicLists`);
      setLists(listResponse.data.sort((a, b) => a.id - b.id));
      setLoading(false);
    } catch (error) {
      if ("Network Error" === error.message) {
        setLoading(false);
      }
      setResponse("Network Error");
      setIsNotificationVisible(true);
    }
  };
  const setToAdd = async (list) => {
    try {
      const response = await axios.post(`${dataURL}/lists`, {
        listName: list.listName,
        userId: currentUser?.uid,
        description: list.description,
        questions: list.questions,
      });

      if (list?.questions?.length > 0) {
        for (const questionId of list.questions) {
          try {
            const questionResponse = await axios.get(
              `${dataURL}/question/${questionId}`
            );
            const questionData = questionResponse.data;

            const created = new Date().toLocaleString("en-US", {
              timeZone: "Africa/Cairo",
            });
            const nextTest = new Date().toLocaleString("en-US", {
              timeZone: "Africa/Cairo",
            });

            const newQuestionResponse = await axios.post(
              `${dataURL}/questions`,
              {
                ...questionData,
                userId: currentUser?.uid,
                created,
                nextTest,
              }
            );

            if (questionData.img) {
              try {
                const imageResponse = await axios.get(
                  `${dataURL}/questionsImgDirect/${questionId}`,
                  {
                    responseType: "blob",
                  }
                );

                if (imageResponse.data) {
                  const formData = new FormData();
                  formData.append("image", imageResponse.data);
                  await axios.put(
                    `${dataURL}/upload/${newQuestionResponse.data.id}`,
                    formData
                  );
                }
              } catch (imageError) {
                setResponse("Please Try Again");
                setIsNotificationVisible(true);
              }
            }
          } catch (questionError) {
            setResponse("Please Try Again");
            setIsNotificationVisible(true);
          }
        }
      }

      setShowAddModal(false);
      setNewList({ listName: "", description: "" });
      getData();
      setResponse(response.data);
      setIsNotificationVisible(true);
    } catch (err) {
      console.error("Error adding list:", err);
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
      setShowAddModal(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    handleSearchClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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
      </Row>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <ListsMapper
          lists={lists}
          setToDelete={null}
          setListName={null}
          setToEdit={null}
          setToAdd={setToAdd}
        />
      )}
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </>
  );
};

export default PublicListsPage;

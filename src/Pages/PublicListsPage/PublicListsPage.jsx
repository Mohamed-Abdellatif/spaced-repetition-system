import { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import NotificationToast from "../../components/Toast/toast";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import ListsMapper from "../../components/ListsMapper/ListsMapper";
import { imagesApi, listsApi, questionsApi } from "../../services/api";
import { todayFormatDate } from "../../Utils/helperfunctions";

const PublicListsPage = () => {
  const { currentUser } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const [lists, setLists] = useState([]);
  const [query, setQuery] = useState({ text: "" });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

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
        const response = await listsApi.searchPublicLists(
          query.text,
          currentUser.uid
        );
        setLists(response.sort((a, b) => a.id - b.id));
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

      const listResponse = await listsApi.getPublicLists();
      setLists(listResponse.sort((a, b) => a.id - b.id));
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
      const response = await listsApi.createList({
        listName: list.listName,
        userId: currentUser?.uid,
        description: list.description,
        questions: list.questions,
      });

      if (list?.questions?.length > 0) {
        for (const questionId of list.questions) {
          try {
            const questionResponse = await questionsApi.getQuestionById(
              questionId
            );
            const questionData = questionResponse;

            const created = todayFormatDate();
            const nextTest = todayFormatDate();

            const newQuestionResponse = await questionsApi.createQuestion({
              ...questionData,
              userId: currentUser?.uid,
              created,
              nextTest,
            });

            if (questionData.img) {
              try {
                const imageResponse = await imagesApi.getImageDirect(
                  questionId
                );

                if (imageResponse) {
                  const formData = new FormData();
                  formData.append("image", imageResponse);
                  await imagesApi.uploadImage(newQuestionResponse.id, formData);
                }
              } catch (imageError) {
                setResponse("Please Try Again");
                setIsNotificationVisible(true);
              }
            }
            if (questionData.questionType === "image") {
              try {
                const imageResponse = await imagesApi.getQuestionAsImageDirect(
                  questionId
                );

                if (imageResponse) {
                  const formData = new FormData();
                  formData.append("image", imageResponse);
                  await imagesApi.uploadImageAsQuestion(newQuestionResponse.id, formData);
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

      getData();
      setResponse("Added Successfully");
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

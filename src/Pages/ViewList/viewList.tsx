import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import AddToListModal from "../../components/AddToListModal/AddToListModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import EditModal from "../../components/EditModal/editModal";
import NotificationToast from "../../components/Toast/toast";
import List from "../../components/ViewQuestionsList/List";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./viewList.css";
import { listsApi, questionsApi } from "../../services/api";
import type { IList, IQuestion } from "../../vite-env";
import { ToEditQuestionObj } from "../../Utils/constants";
const SHARE_URL = import.meta.env.VITE_SHARE_LIST_URL;

const ViewList = ({ listType }: { listType: string }) => {
  const { listName } = useParams();
  const [toBeAdded, setToBeAdded] = useState<IQuestion | null>(null);
  const [list, setList] = useState<IList>();
  const [lists, setLists] = useState<IList[]>([]);
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [toEdit, setToEdit] = useState<IQuestion | null>({
    ...ToEditQuestionObj,
  });
  const [toDelete, setToDelete] = useState<IQuestion | null>(null);
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
      if (!listName || !currentUser?.uid) {
        return;
      }
      const list =
        listType === "private"
          ? await listsApi.getList(listName, currentUser?.uid)
          : await listsApi.getPublicList(listName, currentUser?.uid);

      setList(list);
      const response =
        listType === "private"
          ? await listsApi.getListQuestions(
              listName?.replaceAll("%20", " "),
              currentUser?.uid
            )
          : await listsApi.getPublicListQuestions(
              listName?.replaceAll("%20", " ")
            );

      const listResponse = await listsApi.getLists(currentUser?.uid);
      const publicListResponse = await listsApi.getPublicListsWithCreatorId(
        currentUser?.uid
      );
      setLists([...listResponse, ...publicListResponse]);
      const res = await questionsApi.getQuestionsByIds(response[0].questions);
      setQuestions(res);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listName]);
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  //delete
  const deleteQuestion = async () => {
    try {
      if (!listName || !currentUser?.uid || !list?.id) {
        return;
      }
      const response = await listsApi.getListQuestions(
        listName?.replaceAll("%20", " "),
        currentUser?.uid
      );
      const filtered = response[0].questions.filter(
        (id: number) => id !== toDelete?.id
      );
      await listsApi.updateList(list?.id, {
        listName: listName,
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

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToEdit({
      ...(toEdit as IQuestion),
      [e.target.name]: e.target.value,
    });
  };
  const handleEditSubmit = async () => {
    if (!toEdit) {
      return;
    }
    const { question, answer, difficulty, genre } = toEdit;
    // eslint-disable-next-line
    if (
      // eslint-disable-next-line
      question != " " && // eslint-disable-next-line
      answer != " " && // eslint-disable-next-line
      difficulty && // eslint-disable-next-line
      genre != " " // eslint-disable-next-line
    ) {
      try {
        if (!toEdit.id) {
          return;
        }
        const response = await questionsApi.updateQuestion(toEdit.id, toEdit);

        setResponse(response);
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
  const addToList = async (list: IList) => {
    const listNameToAdd = list?.listName;
    if (!toBeAdded) {
      return;
    }
    const { id } = toBeAdded;
    if (!id) {
      return;
    }
    try {
      if (!currentUser?.uid) {
        return;
      }

      const response = await listsApi.getListQuestions(
        listNameToAdd?.replaceAll("%20", " "),
        currentUser?.uid
      );

      const listResponse =
        listType === "private"
          ? await listsApi.getList(listNameToAdd, currentUser?.uid)
          : await listsApi.getPublicList(listNameToAdd, currentUser?.uid);

      if (response[0].questions?.length !== 0 || response.length !== 0) {
        if (!response[0].questions.includes(id)) {
          const requestions = response[0].questions;

          await listsApi.updateList(listResponse.id, {
            listName: listNameToAdd,
            questions: requestions.concat(id),
            userId: currentUser?.uid,
          });
          setResponse(`Question Added To ${listNameToAdd}`);
          setIsNotificationVisible(true);
        } else {
          setResponse(`Question Already Exists in ${listNameToAdd}`);
          setIsNotificationVisible(true);
        }
      } else {
        await listsApi.updateList(listResponse.id, {
          listName: listNameToAdd,
          questions: [id],
          userId: currentUser?.uid,
        });
        setResponse(`Question Added To ${listNameToAdd}`);
        setIsNotificationVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updateNewListInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewListName(e.target.value);
  };
  const createNewList = async (newListName: string) => {
    try {
      setNewListName("");
      await listsApi.createList({
        listName: newListName,
        userId: currentUser?.uid,
        questions: [],
      });
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  // Update handlers for modals
  const handleAddToList = (question: IQuestion) => {
    setToBeAdded(question);
    setShowAddToListModal(true);
  };

  const handleDelete = (question: IQuestion) => {
    setToDelete(question);
    setShowDeleteModal(true);
  };

  const handleEdit = (question: IQuestion) => {
    setToEdit(question);
    setShowEditModal(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_URL}${listName}`);
      setResponse("Link Copied To Clipboard");
      setIsNotificationVisible(true);
    } catch (err) {
      setResponse("Failed to copy");
      setIsNotificationVisible(true);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="my-2 ">
                <Col>
                  <h4 className="mb-0 text-primary text-uppercase">
                    {listName}
                  </h4>
                </Col>
                {listType === "public" && (
                  <Col className="text-end" sm={3}>
                    <Button onClick={() => handleCopy()}>Share Quiz</Button>
                  </Col>
                )}
              </Row>
              <Row className="my-2">
                <Col>
                  <h6 className="mb-0 text-secondary text-capitalize">
                    {list?.description?.length && list?.description?.length > 0
                      ? list.description
                      : "No Description"}
                  </h6>
                </Col>
              </Row>

              <div className="questions-container">
                <List
                  listType={listType}
                  addToList={handleAddToList}
                  setToEdit={handleEdit}
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
        toDelete={toDelete ? toDelete : ToEditQuestionObj}
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
        questionObj={toEdit ? toEdit : ToEditQuestionObj}
        handleSubmit={() => {
          handleEditSubmit();
          setShowEditModal(false);
        }}
        updateInput={updateInput}
        handleImageChange={() => {}}
      />
      <AddToListModal
        show={showAddToListModal}
        onHide={() => setShowAddToListModal(false)}
        addToList={(list: IList) => {
          addToList(list);
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

import { useState, useEffect } from "react";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import NotificationToast from "../../components/Toast/toast";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import ListsMapper from "../../components/ListsMapper/ListsMapper";
import DeleteListModal from "../../components/DeleteListModal/DeleteListModal";
import EditListModal from "../../components/EditListModal/editListModal";
import AddListModal from "../../components/AddListModal/AddListModal";
import { getDisplayNameFromDocument } from "../../Utils/firebase/firebase.utils";
import { listsApi, questionsApi } from "../../services/api";
import type { IList, IQuestion } from "../../vite-env";
import { ListObj } from "../../Utils/constants";



const ListsPage = () => {
  const { currentUser } = useContext(UserContext);

  // Modal state management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toEdit, setToEdit] = useState<IList | null>(null);
  const [response, setResponse] = useState("");
  const [toDelete, setToDelete] = useState<IList | null>(null);
  const [lists, setLists] = useState<any[] | null>(null);
  const [newList, setNewList] = useState({ listName: "", description: "" ,questions:[]});
  const [query, setQuery] = useState({ text: "" });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [questionIDs, setQuestionIDs] = useState<IQuestion[] | null>(null);

  // Modal handlers
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (list: IList) => {
    setToEdit(list);
    setShowEditModal(true);
  };

  const handleDeleteClick = (list: IList) => {
    setToDelete(list);
    setShowDeleteModal(true);
  };

  const handleSearchUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery({ text: e.target.value });
  };

  const handleSearchClick = async () => {
    if (query.text.length < 1) {
      getData();
      return;
    }
    if (currentUser) {
      try {
        const response = await listsApi.searchLists(
          query.text,
          currentUser.uid
        );
        setLists(
          response.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateAddInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewList({ ...newList, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (isListPublic: boolean) => {
    try {
      let response = "";
      const displayName: Record<string, string> = await getDisplayNameFromDocument();

      if (isListPublic && currentUser?.email ) {
        response = await listsApi.createPublicList({
          listName: newList.listName,
          creatorId: currentUser?.uid,
          description: newList.description,
          creator: displayName[currentUser.email],
          questions:[]
        });
      } else {
        response = await listsApi.createList({
          listName: newList.listName,
          userId: currentUser?.uid,
          description: newList.description,
          questions:[]
        });
      }
      setShowAddModal(false);
      setNewList({ listName: "", description: "" ,questions:[]});
      getData();
      setResponse(response);
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
      const listResponse = await listsApi.getLists(currentUser?.uid);
      const publicListResponse = await listsApi.getPublicListsWithCreatorId(
        currentUser?.uid
      );
      const IdsResponse = await questionsApi.getIDs();
      setQuestionIDs(
        [].concat(IdsResponse.map((question: IQuestion) => question.id))
      );
      setLists([
        ...listResponse.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id
        ),
        ...publicListResponse.sort(
          (a: { id: number }, b: { id: number }) => a.id - b.id
        ),
      ]);
      setLoading(false);
      updateLists();
    } catch (error: any) {
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
        list.questions?.filter((question: IQuestion) =>
          questionIDs?.includes(question)
        )
      )
      .map((questions, i) =>
        listsApi.updateList(lists[i].id, {
          listName: lists[i].listName,
          userId: currentUser?.uid,
          questions: questions,
        })
      );
  };

  const deleteList = async () => {
    try {
      if (!toDelete?.id) {
          return;
        }
      const response = toDelete?.creatorId
        ? await listsApi.deletePublicList(toDelete.id)
        : await listsApi.deleteList(toDelete?.id);
      getData();
      setIsNotificationVisible(true);
      setResponse(response);
      setShowDeleteModal(false);
    } catch {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
    }
  };
  const updateEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setToEdit({ ...(toEdit as IList), [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      if (!toEdit?.id) {
          return;
        }
      const response =
        toEdit?.creatorId !== currentUser?.uid
          ? await listsApi.updateList(toEdit?.id, {
              listName: toEdit?.listName,
              userId: currentUser?.uid,
              questions: toEdit?.questions,
              description: toEdit?.description,
            })
          : await listsApi.updatePublicList(toEdit?.id, {
              listName: toEdit?.listName,
              creatorId: currentUser?.uid,
              questions: toEdit?.questions,
              description: toEdit?.description,
            });
      getData();
      setShowEditModal(false);
      setResponse(response);
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
          lists={lists?lists:[]}
          setToDelete={handleDeleteClick}
          setToEdit={handleEditClick}
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
        toDelete={toDelete?toDelete:ListObj}
      />
      <EditListModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        toEdit={toEdit?toEdit:ListObj}
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

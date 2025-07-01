import "./AddToListModal.css";
import { useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList } from "@fortawesome/free-solid-svg-icons";
import type { IList } from "../../vite-env";
import { ListObj } from "../../Utils/constants";
interface AddToListModal {
  addToList:(list:IList)=>void;
  lists:IList[];
  updateInput:(e: React.ChangeEvent<HTMLInputElement>)=>void;
  newListName:string;
  createNewList:(listName:string)=>{};
  show:boolean;
  onHide:()=>void;
}

const AddToListModal = ({
  addToList,
  lists,
  updateInput,
  newListName,
  createNewList,
  show,
  onHide,
}:AddToListModal) => {
  const [listObj, setListObj] = useState<IList>(ListObj);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    createNewList(newListName);
    setIsClicked(false);
  };

  const addQuestionToList = () => {
    addToList(listObj);
    setListObj(ListObj);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      id="AddToListModal"
      aria-labelledby="addtolist"
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faList} className="me-2" />
          Add Question To List
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {!isClicked ? (
          <>
            <h5 className="mb-3">Select a list to add the question to:</h5>
            <ListGroup className="mb-4">
              {lists.length > 0 &&
                lists.map((list) => {
                  if(!list.id)return
                  return(
                  <ListGroup.Item
                    key={list.id}
                    action
                    active={listObj?.listName === list.listName}
                    onClick={() => setListObj(list)}
                    className="d-flex align-items-center mt-2"
                  >
                    {list.listName}
                  </ListGroup.Item>
                )})}
            </ListGroup>
            <Button
              variant="success"
              onClick={() => setIsClicked(true)}
              className="d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create New List
            </Button>
          </>
        ) : (
          <div className="d-flex flex-column">
            <Form.Group className="mb-3">
              <Form.Label>New List Name</Form.Label>
              <Form.Control
                value={newListName}
                onChange={updateInput}
                type="text"
                placeholder="Enter list name"
              />
            </Form.Group>
            <div>
              <Button variant="primary" onClick={handleClick} className="me-2">
                Create List
              </Button>
              <Button variant="secondary" onClick={() => setIsClicked(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setIsClicked(false);
            onHide();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={addQuestionToList}
          disabled={listObj === null}
        >
          Add to{" "}
          {listObj && <span className="fw-bold">{listObj?.listName}</span>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToListModal;

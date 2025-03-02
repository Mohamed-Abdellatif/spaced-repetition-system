import "./AddToListModal.css";
import { useState } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faList } from "@fortawesome/free-solid-svg-icons";

const AddToListModal = ({ addToList, lists, updateInput, newListName, createNewList, show, onHide }) => {
  const [listName, setListName] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    createNewList(newListName);
    setIsClicked(false);
  };

  const addQuestionToList = () => {
    addToList(listName);
    setListName(null);
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
                lists.map((list) => (
                  <ListGroup.Item
                    key={list.id}
                    action
                    active={listName === list.listName}
                    onClick={() => setListName(list.listName)}
                    className="d-flex align-items-center mt-2"
                  >
                    {list.listName}
                  </ListGroup.Item>
                ))}
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
              <Button
                variant="primary"
                onClick={handleClick}
                className="me-2"
              >
                Create List
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsClicked(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={()=>{
          setIsClicked(false);
          onHide();
        }}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={addQuestionToList}
          disabled={listName === null}
        >
          Add to {listName && <span className="fw-bold">{listName}</span>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToListModal;

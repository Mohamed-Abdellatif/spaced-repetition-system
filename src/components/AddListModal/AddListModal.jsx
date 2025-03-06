import "./AddListModal.css";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faPen } from "@fortawesome/free-solid-svg-icons";

const AddListModal = ({ updateInput, handleSubmit, show, onHide, list }) => {
  const { listName, description } = list;

  const isFormValid = listName?.length > 0;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="list-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
          Add New List
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Form>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>
                <FontAwesomeIcon icon={faList} className="me-2" />
                List Name
              </Form.Label>
              <Form.Control
                value={listName}
                onChange={updateInput}
                name="listName"
                type="text"
                placeholder="Ex: Biology Questions"
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>
                <FontAwesomeIcon icon={faPen} className="me-2" />
                List Description
              </Form.Label>
              <Form.Control
                value={description}
                onChange={updateInput}
                name="description"
                type="text"
                placeholder="Ex: List that covers from chapter 1 till chapter 2"
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add List
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddListModal;

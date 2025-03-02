import "./DeleteModal.css";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const DeleteModal = ({ deleteQuestion, toDelete, show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      id="deleteModal"
      aria-labelledby="deleteModalLabel"
      centered
      size="md"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Confirm Deletion
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faTrash}
            size="2x"
            className="text-danger mb-3"
          />
          <p className="mb-1">Are you sure you want to delete this question?</p>
          <p className="fw-bold text-dark mb-0">"{toDelete.question}"</p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={deleteQuestion}
        >
          Delete Question
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
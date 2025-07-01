import "./DeleteListModal.css";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import type { IList } from "../../vite-env";

interface DeleteListModal {
  deleteList:()=>void;
  toDelete:IList;
  show:boolean;
  onHide:()=>void;
}

const DeleteListModal = ({ deleteList, toDelete, show, onHide }:DeleteListModal) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      id="deleteListModal"
      aria-labelledby="deleteModalLabel"
      centered
      size="sm"
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
          <p className="mb-1">Are you sure you want to delete this list?</p>
          <p className="fw-bold text-dark mb-0">"{toDelete?.listName}"</p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={deleteList}>
          Delete List
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteListModal;

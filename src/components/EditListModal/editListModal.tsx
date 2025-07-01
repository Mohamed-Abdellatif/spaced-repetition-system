import "./editListModal.css";
import { Modal, Button, Form, Row } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faList, faPen } from "@fortawesome/free-solid-svg-icons";
import type { IList } from "../../vite-env";

interface EditListModal {
  updateInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  toEdit: IList;
  show: boolean;
  onHide: () => void;
}

const EditListModal = ({ toEdit, updateInput, handleSubmit, show, onHide }:EditListModal) => {
  const isFormValid = toEdit?.listName?.length > 0;

  return (
    <Modal show={show} onHide={onHide} id="editListModal" size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faEdit} className="me-2" />
          Edit Question
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
                value={toEdit?.listName}
                onChange={updateInput}
                name="listName"
                type="text"
                placeholder="List Name"
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
                value={toEdit?.description}
                onChange={updateInput}
                name="description"
                type="text"
                placeholder="List Description"
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
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditListModal;

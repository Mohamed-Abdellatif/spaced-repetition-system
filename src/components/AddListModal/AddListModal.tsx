import "./AddListModal.css";
import { Modal, Button, Form, Row, Col, ButtonGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faPen,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useState } from "react";
import type { IList } from "../../vite-env";


interface AddListModal  {
  show:boolean;
  updateInput:(e:React.ChangeEvent<HTMLInputElement>)=>void;
  handleSubmit:(isListPublic: boolean)=>void;
  onHide:()=>void;
  list:IList;
}

const AddListModal = ({ updateInput, handleSubmit, show, onHide, list }:AddListModal) => {
  const { listName, description } = list;
  const [isListPublic, setIsListPublic] = useState(false);

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
          <Row >
            <Col >
              <ButtonGroup className="mb-3 bg-secondary">
                <ToggleButton
                  id="public_list"
                  type="radio"
                  variant={isListPublic ? "primary" : "bg-secondary"}
                  name="radio"
                  value={"true"}
                  checked={isListPublic}
                  onChange={() => setIsListPublic(true)}
                >
                  <FontAwesomeIcon icon={faLockOpen} className="me-2" /> Public
                </ToggleButton>
                <ToggleButton
                  id="private_list"
                  type="radio"
                  variant={!isListPublic ? "primary" : "bg-secondary"}
                  name="radio"
                  value={"false"}
                  checked={!isListPublic}
                  onChange={() => setIsListPublic(false)}
                >
                  <FontAwesomeIcon icon={faLock} className="me-2" /> Private
                </ToggleButton>
              </ButtonGroup>
            </Col>
          </Row>
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
          onClick={() => {
            handleSubmit(isListPublic)
            setIsListPublic(false);
          }}
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

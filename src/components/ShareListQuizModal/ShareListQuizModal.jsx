import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const SHARE_URL = import.meta.env.VITE_SHARE_LIST_URL;

const ShareListQuizModal=({show,onHide,listName}) =>{
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Share Quiz
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Share The List Quiz with this Link</h4>
        <a href={`${SHARE_URL}${listName}`} target="blank">
          {`${SHARE_URL}${listName}`}
        </a>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


export default ShareListQuizModal;
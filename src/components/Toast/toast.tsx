import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { ToastContainer } from "react-bootstrap";

interface NotificationToast {
  show:boolean;
  setShow:(bool:boolean)=>void;
  response: string;}

const NotificationToast = ({ show, setShow, response }:NotificationToast) => {
  return (
    <>
      <Row>
        <Col xs={6}>
          <ToastContainer position="top-end" containerPosition="fixed">
            <Toast
              onClose={() => setShow(false)}
              show={show}
              delay={3000}
              autohide
            >
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">SRS</strong>
                <small>1 second ago</small>
              </Toast.Header>
              <Toast.Body className="bg-light">
                <strong>{response}</strong>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Col>
      </Row>
    </>
  );
};

export default NotificationToast;

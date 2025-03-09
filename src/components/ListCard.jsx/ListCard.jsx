import {
  faBookOpen,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Card, Button } from "react-bootstrap";

import "./ListCard.css";
import { useNavigate } from "react-router-dom";

const ListCard = ({ list,setToDelete,setToEdit }) => {
    const navigate = useNavigate();
  const {  listName,questions,description } = list;
  return (
    <Card className="question-card animate-fade mb-3">
      <Card.Body>
        <Row className="question-card__header">
          <Col xs={12} sm={6}>
            <h3 className="question-card__title text-uppercase text-truncate">{listName}</h3>
          </Col>
          <Col xs={12} sm={6} className="text-sm-end">
            <span className="question-card__genre">{questions?.length} Questions</span>
          </Col>
        </Row>

        <Row className="question-card__content">
          <Col xs={12}>
            <p className="text-truncate">{description?description:"No Description"}</p>
          </Col>
        </Row>

        <Row className="question-card__footer">
          <Col xs={12}>
            <div className="question-card__actions">
              <Row className="g-2 w-100">
                <Col xs={12} sm={6} md={4}>
                  <Button
                    onClick={() => navigate(`/list/${listName}`)}
                    variant="outline-secondary"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faEye}  />
                  </Button>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Button
                    onClick={() => setToEdit(list)}
                    variant="outline-primary"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faEdit}  />
                  </Button>
                </Col>

                <Col xs={12} sm={6} md={4}>
                  <Button
                    onClick={() => setToDelete(list)}
                    variant="outline-danger"
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faTrash}  />
                  </Button>
                </Col>
              </Row>
              <Row className="mt-2 g-2 me-1">
                <Col xs={12} className="text-center">
                  <Button
                    variant="outline-success"
                    onClick={() => navigate(`/study/${listName}`)}
                    className="w-100"
                  >
                    <span className="fw-bold">Study List</span>
                    <FontAwesomeIcon icon={faBookOpen} className="ms-2"/> 
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ListCard;

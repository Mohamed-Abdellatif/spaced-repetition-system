import { Alert, Col, Row } from "react-bootstrap";
import ListCard from "../ListCard.jsx/ListCard";
import type { IList } from "../../vite-env";

interface ListsMapper {
  lists: IList[];
  setToDelete?: (list:IList) => void;
  setToEdit?: (list:IList) => void;
  setToAdd?: (list:IList) => {};
}

const ListsMapper = ({ lists, setToDelete, setToEdit, setToAdd }:ListsMapper) => {
  return (
    <Row>
      {lists?.length ? (
        lists?.map((list) => {
          return (
            <Col xs={12} md={6} lg={4} key={list.id}>
              {" "}
              <ListCard
                list={list}
                setToDelete={setToDelete?setToDelete:()=>{}}
                setToEdit={setToEdit?setToEdit:()=>{}}
                setToAdd={setToAdd?setToAdd:()=>{}}
              />
            </Col>
          );
        })
      ) : (
        <Col xs={12}>
          <Alert variant="warning" className="text-center">
            <h3 className="mb-0"> No lists available</h3>
          </Alert>
        </Col>
      )}
    </Row>
  );
};

export default ListsMapper;

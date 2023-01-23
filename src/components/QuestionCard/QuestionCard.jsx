import moment from "moment/moment";
import { useState } from "react";
import "./QuestionCard.css";

const QuestionCard = ({ questionObj, setToDelete, setToEdit,addToList }) => {
  const [isClicked,setIsClicked] = useState(false)
  const {  question, created, answer,genre } = questionObj;
  return (
    <>
      <div className="list">
        <div className="card  questionCard  mb-3">
          <div className="card-body">
            <div className="card-content" >
              <h5 className="card-title"> {genre}</h5>
              <p className="card-text">{!isClicked ? question:`Answer : ${answer}`}</p>
              <p>{moment(created).format('MMMM Do YYYY')}</p>
            </div>

            <div className="crud">
            <button
                onClick={()=> addToList(questionObj)}
                className="btn btn-success"
              >
                Add To List
           </button>
            <button
                onClick={()=> setIsClicked(!isClicked)}
                className="btn btn-secondary ms-3"
              >
                <i className="fa-solid fa-eye "/>
              </button>
              <button
                onClick={() => setToEdit(questionObj)}
                className="btn btn-primary ms-3"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
              >
                Edit
              </button>
              <button
                onClick={() => setToDelete(questionObj)}
                type="button"
                className="btn btn-danger ms-3"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;

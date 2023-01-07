import { useState } from "react";
import "./QuestionCard.css";

const QuestionCard = ({ questionObj, setToDelete, setToEdit }) => {
  const [isClicked,setIsClicked] = useState(false)
  const { id, question, created, answer,genre } = questionObj;
  return (
    <>
      <div className="list">
        <div className="card  questionCard  mb-3">
          <div className="card-body">
            <div className="card-content" >
              <h5 className="card-title"> {genre}</h5>
              <p className="card-text">{!isClicked ? question:`Answer : ${answer}`}</p>
              <p>{created.slice(0, 10)}</p>
            </div>

            <div className="crud">
            <button
                onClick={()=> setIsClicked(!isClicked)}
                className="btn btn-secondary"
              >
                <i className="fa-solid fa-eye"/>
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

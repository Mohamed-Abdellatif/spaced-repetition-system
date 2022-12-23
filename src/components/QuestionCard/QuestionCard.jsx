

import "./QuestionCard.css";

const QuestionCard = ({ questionObj, setToDelete,setToEdit }) => {

  const { id, question, created } = questionObj;
  return (
    <>
      <div className="list" onClick={()=> console.log('hi')}>
        <div className="card  questionCard  mb-3">
          <div className="card-body">
            <h5 className="card-title">Card {id}</h5>
            <p className="card-text">{question}</p>
            <p>{created.slice(0, 10)}</p>
            <div className="crud">
              <button
              onClick={() => setToEdit(questionObj)}
                className="btn btn-primary"
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

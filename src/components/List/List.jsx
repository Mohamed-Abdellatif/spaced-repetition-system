import QuestionCard from "../QuestionCard/QuestionCard";
import "./List.css";

const List = ({ questions, setToDelete,setToEdit,toEdit }) => {
  return (
    <>
      <div className="cards-container">
        {questions.length > 0 ? (
          questions
            .map((question) => (
              <QuestionCard
              setToEdit={setToEdit}
              toEdit={toEdit}
              questionObj={question}
              setToDelete={setToDelete}
              key={question.id}
              
              />
            ))
        ) : (
          <h3 className="NoData">
            <span className="text-danger">There are no questions to show</span>
          </h3>
        )}
      </div>
    </>
  );
};

export default List;

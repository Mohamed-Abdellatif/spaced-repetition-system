import "./editModal.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import MCQInput from "../MCQInput/MCQInput";


const EditModal = ({ questionObj, updateInput, handleSubmit,setQuestionObj }) => {
  const { question, answer, difficulty, genre, questionType, choices } =
  questionObj;
  const handleQuestionTypeChange = (questionType) => {
    setQuestionObj({ ...questionObj, questionType: questionType });
  };
  const updateChoices = (e) => {
    
    setQuestionObj({
      ...questionObj,
      choices: { ...choices, [e.target.name]: e.target.value },
    });
    
  };
  
  return (<>
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content modal-edit-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
            Edit Question
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body modal-edit-body">
            <>
             
              <div className="">
              <div className="mb-3 ">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Genre
                  </label>
                  <input
                    value={questionObj.genre}
                    onChange={updateInput}
                    name="genre"
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Ex: Biology"
                  />
                </div>
                <div className="mb-3 ">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Question
                  </label>
                  <input
                    value={questionObj.question}
                    onChange={updateInput}
                    name="question"
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="How to spell my name?"
                  />
                </div>
                <div className="mb-3 ">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Question Type
                    </label>
                    <DropdownButton
                      id="dropdown-basic-button"
                      title={questionObj.questionType}
                      className="ms-3"
                    >
                      {questionObj.questionType==="MCQ"?"":<Dropdown.Item
                        onClick={() => handleQuestionTypeChange("MCQ")}
                      >
                        MCQ
                      </Dropdown.Item>}
                      {questionObj.questionType==="Short Response"?"":<Dropdown.Item
                        onClick={() => handleQuestionTypeChange("Short Response")}
                      >
                        Short Response
                      </Dropdown.Item>}
                      {questionObj.questionType==="Complete"?"":<Dropdown.Item
                        onClick={() => handleQuestionTypeChange("Complete")}
                      >
                        Complete
                      </Dropdown.Item>}
                      {questionObj.questionType==="True or false"?"":<Dropdown.Item
                        onClick={() => handleQuestionTypeChange("True or false")}
                      >
                        True or false
                      </Dropdown.Item>}
                    </DropdownButton>
                  </div>
                <div className="mb-3 ">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Difficulty Level
                  </label>
                  <input
                    value={questionObj.difficulty}
                    onChange={updateInput}
                    name="difficulty"
                    type="number"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="0"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Answer
                  </label>
                  <textarea
                    value={questionObj.answer}
                    onChange={updateInput}
                    name="answer"
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                  {questionType === "MCQ" && (
                     <MCQInput updateChoices={updateChoices} choices={choices}/>
                    )}
                </div>
                <div className="btn-container"></div>
              </div>
              
            </>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              data-bs-dismiss={// eslint-disable-next-line
                !question == "" &&// eslint-disable-next-line
                !answer == "" &&// eslint-disable-next-line
                !difficulty == "" &&// eslint-disable-next-line
                !genre == ""
                  ? "modal"
                  : ""
              }
              onClick={ handleSubmit}
            >
              Edit Question
            </button>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default EditModal;

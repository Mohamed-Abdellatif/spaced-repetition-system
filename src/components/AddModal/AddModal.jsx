import "./AddModal.css";

const AddModal = ({ questionObj, updateInput, handleSubmit }) => {
  
  return (<>
    
    <div
      className="modal fade"
      id="addModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
        <header>
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Add Question
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div></header>

          <div className="modal-body">
            <>
             
              <div className="">
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
                </div>
                <div className="btn-container"></div>
              </div>
            </>
          </div><footer>
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
              data-bs-dismiss="modal"
              onClick={ handleSubmit}
            >
              Add Question
            </button>
          </div></footer>
        </div>
      </div>
    </div></>
  );
};

export default AddModal;

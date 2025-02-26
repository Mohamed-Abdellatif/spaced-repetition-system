import "./AddToListModal.css";
import { useState } from "react";

const AddToListModal = ({ addToList, lists, updateInput, newListName,createNewList }) => {
  const [listName, setListName] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const handleClick=()=>{
    createNewList(newListName)
    setIsClicked(false)
  }
  const addQustionToList = () =>{
    addToList(listName)
    setListName(null)
  }
  
  return (
    <>
      <div
        className="modal fade"
        id="AddToListModal"
        tabIndex="-1"
        aria-labelledby="addtolist"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content modal-list-content">
            <header>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="addtolist">
                  Add Question To List
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </header>

            <div className="modal-body modal-list-body">
              <>
                {!isClicked ? (
                  <>
                  <h3>Click on the list you want:</h3>
                    {lists.length > 0 &&
                      lists.map((list) => (
                        <div key={list.id}>
                         
                          
                          <div
                            
                            className="  mb-3 btn btn-primary"
                            onClick={() => setListName(list.listName)}
                          >
                            {list.listName}
                          </div>
                          <br />
                        </div>
                      ))}
                    <button
                      className="  mb-3 btn btn-success"
                      onClick={() => setIsClicked(true)}
                    >
                      Add New List
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      value={newListName}
                      onChange={updateInput}
                      type="text"
                      className="form-control mb-3"
                      id="exampleFormControlInput10"
                      placeholder="LIST NAME"
                    />
                    <button
                      className="  ms-3 btn btn-secondary"
                      onClick={() => setIsClicked(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="  ms-3 btn btn-primary"
                      onClick={() => handleClick()}
                    >
                      Add New List
                    </button>
                  </>
                )}
              </>
            </div>
            <footer>
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
                  onClick={()=>addQustionToList()}
                  disabled={listName===null}
                >
                  Add Question To{" "}
                  <span className="text-warning">{listName}</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToListModal;

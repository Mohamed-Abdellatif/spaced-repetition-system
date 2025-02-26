import "./DeleteModal.css";

const DeleteModal = ({deleteQuestion,toDelete}) => {
    return(
        <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content modal-del-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleLabel">
                Deletion Confirmation
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body modal-del-body">
              Are you sure you want to delete this <br />{" "}
              <strong>{toDelete.question}</strong>?
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
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => deleteQuestion()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default DeleteModal
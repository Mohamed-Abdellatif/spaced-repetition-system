const MCQInput=({ updateChoices,choices})=>{
    const numberOfChoices = [1, 2, 3];
    return(
        <>{numberOfChoices.map(number => 
            <div className="mb-3 mt-3 " key={number}>
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label"
              >
                Choice {number}
              </label>
              <input
                value={choices[number-1]}
                onChange={updateChoices}
                name={`choice ${number}`}
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Wrong Choice"
              />
            </div>
          )}</>
    )
}

export default MCQInput


const ChoicesList =({choices,isChecked,handleRadioClick})=>{
    return(<>
    {choices.length > 1 &&
          choices.map((answer,i) => {
            return (
              <div
                style={isChecked[answer]}
                className="answer-card"
                key={i}
                onClick={() => handleRadioClick(answer)}
              >
                {answer}
              </div>
            );
          })}
    </>)
}

export default ChoicesList
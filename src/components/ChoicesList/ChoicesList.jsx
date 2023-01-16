const ChoicesList =({choices,isChecked,handleRadioClick})=>{
    return(<>
    {choices.length > 1 &&
          choices.map((answer) => {
            return (
              <div
                style={isChecked[answer]}
                className="answer-card"
                key={answer}
                onClick={() => handleRadioClick(answer)}
              >
                {answer}
              </div>
            );
          })}
    </>)
}

export default ChoicesList
import { useEffect, useState } from "react";
import "./viewQuestion.css"
import axios from "axios";
import { useParams } from "react-router-dom";

const dataURL = "http://localhost:3001";

const ViewQuestion = () => {
   const {questionId} = useParams()
   const [questionObj,setQuestionObj] = useState({})
   const getData = async () => {
      try{
         const response = await axios.get(`${dataURL}/question/${questionId}`)
         setQuestionObj(response.data)
      }catch(err){console.log(err)}
     
   }
   useEffect(()=>{
      getData()
      // eslint-disable-next-line
   },[questionId])
   const {question, answer, difficulty} = questionObj
  return (
    <>
      <div className="questionContainer">
        <img
          src="https://placehold.co/400x400?text=PlaceHolder"
          className="img-left"
          width={"400px"}
          height={"400px"}
          alt={"question diagram"}
        />
        <ul class="list-right">
          <li>Question : {question}</li>
          <li>Answer : {answer}</li>
          <li>Difficulty: {difficulty}</li>
        </ul>
      </div>
    </>
  );
};

export default ViewQuestion;

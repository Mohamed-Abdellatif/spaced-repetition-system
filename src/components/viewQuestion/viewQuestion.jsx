import { useEffect, useState } from "react";
import "./viewQuestion.css"
import axios from "axios";
import { useParams } from "react-router-dom";
import NotificationToast from "../Toast/toast";

const dataURL = "http://localhost:3001";

const ViewQuestion = () => {
   const {questionId} = useParams()
   const [questionObj,setQuestionObj] = useState({})
   const [imageURL,setImageURL] = useState({})
   const [response,setResponse] = useState();
   const [isNotificationVisible,setIsNotificationVisible] = useState(false);
   const getData = async () => {
    try {
      const response = await axios.get(`${dataURL}/question/${questionId}`);
      setQuestionObj(response.data);
  
      const imgResponse = await axios.get(`${dataURL}/questionsImg/${questionId}`, {
        responseType: "blob", // Ensure binary data is returned
      });
  
      if (imgResponse.status === 200) { // Correct way to check response success
        const url = URL.createObjectURL(imgResponse.data);
        setImageURL(url);
      }
    } catch (err) {
      setResponse("Error please try again later");
      setIsNotificationVisible(true);
    }
  };
  
   useEffect(()=>{
      getData()
      // eslint-disable-next-line
   },[questionId])
   const {question, answer, difficulty} = questionObj
  return (
    <>
      <div className="questionContainer">
        <img
          src={imageURL?imageURL:"https://placehold.co/400x400?text=PlaceHolder"}
          className="img-left px-3"
          width={"300px"}
          height={"300px"}
          alt={"question diagram"}
        />
        <ul class="list-right px-5">
          <li>Question : {question}</li>
          <li>Answer : {answer}</li>
          <li>Difficulty: {difficulty}</li>
        </ul>
      </div>
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </>
  );
};

export default ViewQuestion;

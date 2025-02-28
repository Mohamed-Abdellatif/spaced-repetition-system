import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NotificationToast from "../Toast/toast";
import { motion } from "framer-motion";
import "./viewQuestion.css";

const dataURL = "http://localhost:3001";

const ViewQuestion = () => {
  const { questionId } = useParams();
  const [questionObj, setQuestionObj] = useState({});
  const [imageURL, setImageURL] = useState(null);
  const [response, setResponse] = useState();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(`${dataURL}/question/${questionId}`);
      setQuestionObj(response.data);

      const imgResponse = await axios.get(`${dataURL}/questionsImg/${questionId}`);
      if (imgResponse.status === 200) {
        setImageURL(imgResponse.data.url);
      }
    } catch (err) {
      setResponse("Error, please try again later");
      setIsNotificationVisible(true);
    }
  };

  useEffect(() => {
    getData();
  }, [questionId]);

  const { question, answer, difficulty } = questionObj;

  return (
    <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="flashcard"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {!isFlipped ? (
          <div className="front">
            <img
              src={imageURL || "https://placehold.co/400x400?text=Placeholder"}
              className="flashcard-image"
              alt="question diagram"
              height={300}
              width={300}
            />
            <p className="question-text">{question}</p>
            <span className="difficulty-tag">{difficulty}</span>
          </div>
        ) : (
          <div className="back">
            <p className="answer-text">{answer}</p>
          </div>
        )}
      </motion.div>
      <NotificationToast setShow={setIsNotificationVisible} show={isNotificationVisible} response={response} />
    </div>
  );
};

export default ViewQuestion;
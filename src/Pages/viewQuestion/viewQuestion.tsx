import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotificationToast from "../../components/Toast/toast";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./viewQuestion.css";
import { imagesApi, questionsApi } from "../../services/api";
import { getQuestionImage } from "../../Utils/helperfunctions";
import type { IQuestion } from "../../vite-env";

const ViewQuestion = () => {
  const { questionId } = useParams();
  const [questionObj, setQuestionObj] = useState<IQuestion>();
  const [imageURL, setImageURL] = useState(null);
  const [questionImgURL, setQuestionImgURL] = useState(null);
  const [response, setResponse] = useState<{
    message: string;
    isSuccess?: boolean;
  }>({ message: "", isSuccess: true });
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getData = async () => {
    try {
      if (!questionId) {
        return;
      }

      const response = await questionsApi.getQuestionById(parseInt(questionId));
      setQuestionObj(response);
      getQuestionImage(response, setQuestionImgURL);

      const imgResponse = await imagesApi.getImage(parseInt(questionId));
      if (imgResponse) {
        setImageURL(imgResponse.url);
      }
    } catch (err) {
      setResponse({
        message: "Error please try again later",
        isSuccess: false,
      });
      setIsNotificationVisible(true);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [questionId]);

  if (!questionObj) {
    return;
  }
  const { question, answer, difficulty, questionType, img } = questionObj;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <motion.div
        className="card flashcard"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          <div className="card-body front text-center">
            {questionType === "image" && (
              <img
                src={`${questionImgURL}?t=${Date.now()}`}
                className="card-img-top flashcard-image"
                alt="question"
                width={"300px"}
                height={"300px"}
              />
            )}
            <h5 className={"card-title mt-3"}>
              Question: <br /> {question}
            </h5>
            <span className={`badge bg-secondary`}>{difficulty}</span>
          </div>
        ) : (
          <div className="card-body back text-center d-flex align-items-center justify-content-center">
            {img && (
              <img
                src={`${imageURL}?t=${Date.now()}`}
                className="card-img-top flashcard-image"
                alt="question diagram"
                width={"300px"}
                height={"300px"}
              />
            )}
            <p className="answer-text">
              Answer: <br />
              {answer}
            </p>
          </div>
        )}
      </motion.div>
      <NotificationToast
        setShow={(bool: boolean) => setIsNotificationVisible(bool)}
        show={isNotificationVisible}
        response={response}
      />
    </div>
  );
};

export default ViewQuestion;

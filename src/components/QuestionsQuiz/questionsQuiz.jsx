import "./questionsQuiz.css";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import NotificationToast from "../Toast/toast";

const dataURL = "http://localhost:3001";

const QuestionsQuiz = () => {
  const { genre } = useParams();
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [choices, setChoices] = useState("");
  const [isChecked, setIsChecked] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [response, setResponse] = useState("");

  const navigate = useNavigate();

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const getData = async () => {
    try {
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser.uid,
      });
      if (genre === "all") {
        setQuestions(shuffle(response.data));
      } else {
        setQuestions(
          shuffle(response.data.filter((question) => question.genre === genre))
        );
      }

      
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);
  useEffect(() => {
    setCurrentQuestion(questions[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  useEffect(() => {
    const wrongChoices = questions.filter(
      (question) => question !== currentQuestion
    );
    const allChoices = [].concat(currentQuestion, ...wrongChoices);
    setChoices(shuffle(allChoices.slice(0, 4)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleSumbit = (e) => {
    e.preventDefault();
    const currentQuestionIndex = questions.indexOf(currentQuestion);
    if (currentAnswer === currentQuestion.answer) {
      setIsChecked({});
      setIsNotificationVisible(true);
      setResponse("Right Answer");
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
      } else {
        setIsNotificationVisible(true);
        setResponse("All Questions Are Done");
      }
    } else {
      setIsNotificationVisible(true);
      setResponse("Wrong Answer");
    }
  };

  const handleRadioClick = (answer, id) => {
    setCurrentAnswer(answer);
    if (id) {
      setIsChecked({ [id]: { backgroundColor: "lightblue" } });
    }
  };

  return (
    <>
      <div className="container">{genre==='all'?"":genre} Quiz</div>
      <div className="">{currentQuestion && currentQuestion.question}</div>
      <Form>
        {choices.length > 1 &&
          choices.map((question) => {
            return (
              <div
                style={isChecked[question.id]}
                className="answer-card"
                key={question.id}
                onClick={() => handleRadioClick(question.answer, question.id)}
              >
                {question.answer}
              </div>
            );
          })}
        <button className="btn mt-3 ms-3 btn-primary" onClick={handleSumbit}>
          Submit
        </button>
      </Form>
      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </>
  );
};

export default QuestionsQuiz;

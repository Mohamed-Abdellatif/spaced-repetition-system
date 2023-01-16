import "./questionsQuiz.css";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import NotificationToast from "../Toast/toast";
import ChoicesList from "../ChoicesList/ChoicesList";
import moment from "moment/moment";

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
    if (currentQuestion && currentQuestion.questionType === "MCQ") {
      const wrongChoices = Object.values(currentQuestion.choices);

      setChoices(shuffle(wrongChoices.concat(currentQuestion.answer)));
    }

    if (currentQuestion && currentQuestion.questionType === "True or false") {
      setChoices(["true", "false"]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleSumbit = async (e) => {
    e.preventDefault();

    const currentQuestionIndex = questions.indexOf(currentQuestion);
    const { nextTest, lastTested } = currentQuestion;
    const daysBeforeNextTest = moment(nextTest).diff(moment(), "days");
    if (currentAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setIsChecked({});
      setIsNotificationVisible(true);
      setCurrentAnswer("");
      setResponse("Right Answer");
      if (currentQuestion.nextTest && daysBeforeNextTest === 0) {
        const nextTestDate = moment(nextTest).diff(moment(lastTested), "days");

        await axios.put(`${dataURL}/questions/${currentQuestion.id}`, {
          nextTest: moment()
            .add(nextTestDate * 2, "days")
            .format(),
        });
      } else {
        await axios.put(`${dataURL}/questions/${currentQuestion.id}`, {
          nextTest: moment().add(2, "days").format(),
        });
      }
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
      } else {
        setIsNotificationVisible(true);
        setResponse("All Questions Are Done");
      }
    } else {
      setIsNotificationVisible(true);
      setResponse("Wrong Answer");
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
      } else {
        setIsNotificationVisible(true);
        setResponse("All Questions Are Done");
      }
    }
    await axios.put(`${dataURL}/questions/${currentQuestion.id}`, {
      lastTested: new Date(),
    });
  };

  const handleRadioClick = (answer) => {
    setCurrentAnswer(answer);
    if (answer) {
      setIsChecked({ [answer]: { backgroundColor: "lightblue" } });
    }
  };

  const handleInputChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  return (
    <>
      <div className="container">{genre === "all" ? "" : genre} Quiz</div>
      <div className="">{currentQuestion?.question}</div>

      {currentQuestion?.questionType === "True or false" ||
      currentQuestion?.questionType === "MCQ" ? (
        <ChoicesList
          choices={choices}
          isChecked={isChecked}
          handleRadioClick={handleRadioClick}
        />
      ) : (
        <div>
          <input
            type="text"
            className="answer-card form-control"
            value={currentAnswer}
            onChange={handleInputChange}
          />
        </div>
      )}
      <button className="btn mt-3 ms-3 btn-primary" onClick={handleSumbit}>
        Submit
      </button>

      <NotificationToast
        setShow={setIsNotificationVisible}
        show={isNotificationVisible}
        response={response}
      />
    </>
  );
};

export default QuestionsQuiz;

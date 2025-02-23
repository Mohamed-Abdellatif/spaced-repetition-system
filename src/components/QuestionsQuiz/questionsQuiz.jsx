import "./questionsQuiz.css";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import moment from "moment";

const dataURL = "http://localhost:3001";

const QuestionsQuiz = () => {
  const { genre } = useParams();
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const getData = async () => {
      try {
        const res = await axios.post(`${dataURL}/getQuestions`, {
          userId: currentUser.uid,
        });

        let filteredQuestions =
          genre === "General"
            ? res.data
            : res.data.filter((q) => q.genre === genre);
        setQuestions(shuffle(filteredQuestions));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getData();
  }, [genre, currentUser]);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentIndex]);
    }
  }, [questions, currentIndex]);

  const setCurrentQuestion = (question) => {
    if (!question) return;
    setIsFlipped(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFlipped(true);
  
    const question = questions[currentIndex];
    if (!question) return;
  
    const isCorrect =
      currentAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    setResponse(
      isCorrect
        ? "Right Answer ✅"
        : `Wrong Answer ❌ (Correct: ${question.answer})`
    );
  
    // Get last test date (if null, set to today)
    const prevInterval = question.interval || 2; // Default interval is 2 days
    const stability = question.stability || 2.5; // Initial stability factor
  
    let newInterval;
    let newStability = stability;
  
    if (isCorrect) {
      // Increase interval exponentially based on stability
      newInterval = Math.round(prevInterval * newStability);
      newStability += 0.15; // Gradually increase stability
    } else {
      // Reset interval to 2 days and decrease stability
      newInterval = 2;
      newStability = Math.max(1.3, stability - 0.2);
    }
  
    const nextTestDate = moment().add(newInterval, "days").format();
  
    // Update question data
    await axios.put(`${dataURL}/questions/${question.id}`, {
      nextTest: nextTestDate,
      lastTested: moment().format(),
      interval: newInterval, // Store interval for better adaptation
      stability: newStability, // Store stability factor
    });
  
    setCurrentAnswer("");
  
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        setResponse("All Questions Are Done 🎉");
        setIsFlipped(true);
      }
    }, 2000);
  };
  

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{genre !== "all" ? genre : "General"} Quiz</h2>

      <div className="progress-bar">
        <progress value={currentIndex + 1} max={questions.length}></progress>
        <span>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Flip Card UI */}
      <div className="card-container">
        <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
          <div className="flip-card-inner">
            {/* Front Side - Question */}
            <div className="flip-card-front">
              <h3 className="question-text">
                {questions[currentIndex]?.question}
              </h3>

              <input
                type="text"
                className="answer-input"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              />
            </div>

            {/* Back Side - Answer Feedback */}
            <div className="flip-card-back">
              <h3 className="feedback-text">{response}</h3>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary submit-btn"
        onClick={handleSubmit}
        disabled={isFlipped}
      >
        Submit
      </button>
    </div>
  );
};

export default QuestionsQuiz;

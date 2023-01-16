import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import "./spacedSchedule.css";

const dataURL = "http://localhost:3001";

const SpacedSchedule = () => {
  const { currentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [questionsNextTest, setQuestionsNextTest] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser.uid,
      });
      const nextTestResponse = await axios.post(
        `${dataURL}/questionsNextTest`,
        {
          userId: currentUser.uid,
        }
      );
      setQuestions(response.data);

      setQuestionsNextTest(
        nextTestResponse.data
          .filter((kk) => kk.nextTest !== null)
          .map((question) => {
            if (question.nextTest) {
              return question.nextTest;
            }
          })
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let filteredArray = [];
  for (let i = 0; i < questionsNextTest.length; i++) {
    if (
      !filteredArray.includes(
        moment(questionsNextTest[i]).format("D MMMM YYYY")
      )
    ) {
      filteredArray.push(moment(questionsNextTest[i]).format("D MMMM YYYY"));
    }
  }
  const nextTestDates = [...filteredArray].sort(
    (a, b) => a.slice(0, 2) - b.slice(0, 2)
  );
 
  return (
    <>
      <div className="container">
        {nextTestDates.length &&
          nextTestDates.map((nextTest) => (
            <>
              
              <div className="mb-3 date bg-success text-light">
                {nextTest === moment().format("D MMMM YYYY")
                  ? "Today"
                  : moment(nextTest).format("MMMM Do YYYY")}
              </div>
              {questions.length &&
                questions
                  .filter(
                    (question) =>
                      nextTest ===
                      moment(question.nextTest).format("D MMMM YYYY")
                  )
                  .map((question, i) => (
                    <div key={question.id}>
                      {i + 1}-{question.question}
                    </div>
                  ))}
              <hr />
            </>
          ))}
          <div className="mb-3 bg-success date text-light">
                    Not Yet Detrmined
                  </div>
                  
        {questions.length &&
          questions.map((question) => {
            if (question.nextTest === null) {
              return (
                <>
                  
                  
                  <div>{question.question}</div>
                  
                </>
              );
            }<hr />
          })}
      </div>
    </>
  );
};

export default SpacedSchedule;

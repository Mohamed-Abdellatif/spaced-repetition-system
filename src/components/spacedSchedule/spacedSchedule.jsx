import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user.context";
import { auth } from "../../Utils/firebase/firebase.utils";
import "./spacedSchedule.css";

const dataURL = "http://localhost:3001";

const SpacedSchedule = () => {
  const { currentUser,setCurrentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [questionsNextTest, setQuestionsNextTest] = useState([]);

  const getData = async () => {
    if(!currentUser)return
    try {
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser?.uid,
      });
      const nextTestResponse = await axios.post(
        `${dataURL}/questionsNextTest`,
        {
          userId: currentUser?.uid,
        }
      );
      setQuestions(response.data);

      setQuestionsNextTest(
        nextTestResponse.data
          .filter((question) => question.nextTest !== null)
          .map((question) => question.nextTest)
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User present
        setCurrentUser(currentUser)
        // redirect to home if user is on /login page 
      } else {
        // User not logged in
        // redirect to login if on a protected page 
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const notDeterminedQuestions = questions.filter(
    (question) => question.nextTest === null
  );

  return (
    <>
      <div className="container">
        {nextTestDates.length!==0 &&
          nextTestDates.map((nextTest,i) => (
            <div key={i}>
              <div  className="mb-3 date bg-success text-light">
                {nextTest === moment().format("D MMMM YYYY")
                  ? "Today"
                  : moment(nextTest).format("MMMM Do YYYY")}
              </div>
              {questions.length !==0 &&
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
            </div>
          ))}
        {notDeterminedQuestions.length!==0 && <div className="mb-3 bg-success date text-light">Not Yet Detrmined</div>}

        {questions.length!==0 &&
          notDeterminedQuestions.map((question) => (
            <div key ={question.id}>{question.question}</div>
          ))}
      </div>
    </>
  );
};

export default SpacedSchedule;

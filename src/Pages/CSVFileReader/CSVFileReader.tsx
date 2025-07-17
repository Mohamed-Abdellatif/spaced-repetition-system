import React, { useContext, useState } from "react";
import Papa from "papaparse";
import { UserContext } from "../../contexts/user.context";
import { todayFormatDate } from "../../Utils/helperfunctions";
import type { IQuestion } from "../../vite-env";
import CSVQuestionCard from "../../components/CSVQuestionCard/CSVQuestionCard";
import { Button } from "react-bootstrap";
import useQuestionsQuery from "../../hooks/useQuestionsQuery";


const CSVFileReader = () => {
  const { currentUser } = useContext(UserContext);
  const [data, setData] = useState([]);

   const {AddQuestion} = useQuestionsQuery(currentUser?.uid)

  const addAllQuestions=(questions:IQuestion[])=>{
    questions.map((question:IQuestion)=>{
       AddQuestion.mutate(question);
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, 
      skipEmptyLines: true,
      complete: (results: any) => {
        setData(results?.data);
      },
      error: (error) => {
        console.error("Parsing error:", error);
      },
    });
  };
  const questions = data.map((question: any) => {
    return {
      answer: question.Answer,
      choices: {
        choice1: "",
        choice2: "",
        choice3: "",
      },
      created: todayFormatDate(),
      difficulty: 1,
      genre: question.Genre,
      nextTest: todayFormatDate(),
      question: question.Question,
      questionType: "short response",
      userId: currentUser.uid,
    };
  });

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <h3>Parsed Data:</h3>
      {questions &&
        questions.map((question: IQuestion, i) => {
          return (
            <CSVQuestionCard
              key={`${i}-${question.question}`}
              questionObj={question}
            />
          );
        })}

      <Button onClick={()=>addAllQuestions(questions)}>Save All</Button>  
    </div>
  );
};

export default CSVFileReader;

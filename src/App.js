import { Route,  Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/navbar";

import QuestionList from "./components/questionList/questionList";
import QuestionsQuiz from "./components/QuestionsQuiz/questionsQuiz";
import SpacedSchedule from "./components/spacedSchedule/spacedSchedule";
import ViewList from "./components/ViewList/viewList";
import Authentication from "./Authentication/authentication/authentication.component";
import ViewQuestion from "./components/viewQuestion/viewQuestion";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<QuestionList />} />
          <Route path="login" element={<Authentication />} />
          <Route path="quiz/:genre" element={<QuestionsQuiz />} />
          <Route path="schedule" element={<SpacedSchedule />} />
          <Route path="list/:listName" element={<ViewList />} />
          <Route path="question/:questionId" element={<ViewQuestion />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/navbar";

import QuestionList from "./components/questionList/questionList";
import QuestionsQuiz from "./components/QuestionsQuiz/questionsQuiz";
import SpacedSchedule from "./components/spacedSchedule/spacedSchedule";
import ViewList from "./components/ViewList/viewList";
import Authentication from "./HH/authentication/authentication.component";

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/login" element={<Authentication />} />
        <Route path="/quiz/:genre" element={<QuestionsQuiz />} />
        <Route path="/schedule" element={<SpacedSchedule />} />
        <Route path="/list/:listName" element={<ViewList />} />
      </Routes>
    </>
  );
};

export default App;

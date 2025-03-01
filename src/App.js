import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navbar/navbar";
import { Container } from "react-bootstrap";
import QuestionList from "./components/questionList/questionList";
import QuestionsQuiz from "./components/QuestionsQuiz/questionsQuiz";
import SpacedSchedule from "./components/spacedSchedule/spacedSchedule";
import ViewList from "./components/ViewList/viewList";
import Authentication from "./Authentication/authentication/authentication.component";
import ViewQuestion from "./components/viewQuestion/viewQuestion";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route
            index
            element={
              <Container fluid="lg" className="py-4">
                <QuestionList />
              </Container>
            }
          />
          <Route
            path="login"
            element={
              <Container fluid="lg" className="py-4">
                <Authentication />
              </Container>
            }
          />
          <Route
            path="quiz/:genre"
            element={
              <Container fluid="lg" className="py-4">
                <QuestionsQuiz />
              </Container>
            }
          />
          <Route
            path="schedule"
            element={
              <Container fluid="lg" className="py-4">
                <SpacedSchedule />
              </Container>
            }
          />
          <Route
            path="list/:listName"
            element={
              <Container fluid="lg" className="py-4">
                <ViewList />
              </Container>
            }
          />
          <Route
            path="question/:questionId"
            element={
              <Container fluid="lg" className="py-4">
                <ViewQuestion />
              </Container>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

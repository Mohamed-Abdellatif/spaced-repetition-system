import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./layout/navbar/navbar";
import { Container } from "react-bootstrap";
import QuestionList from "./Pages/questionList/questionList";
import QuestionsQuiz from "./Pages/QuestionsQuiz/questionsQuiz";
import SpacedSchedule from "./Pages/spacedSchedule/spacedSchedule";
import ViewList from "./Pages/ViewList/viewList";
import Authentication from "./Authentication/authentication/authentication.component";
import ListsPage from "./Pages/ListsPage/ListsPage";
import StudyCards from "./Pages/StudyPage/StudyCards";
import PublicListsPage from "./Pages/PublicListsPage/PublicListsPage";
import ViewQuestion from "./Pages/viewQuestion/viewQuestion";
import CSVFileReader from "./Pages/CSVFileReader/CSVFileReader";

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
            path="test/:listName"
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
                <ViewList listType={"private"}/>
              </Container>
            }
          />
          <Route
            path="lists"
            element={
              <Container fluid="lg" className="py-4">
                <ListsPage />
              </Container>
            }
          />
          <Route
            path="publicLists"
            element={
              <Container fluid="lg" className="py-4">
                <PublicListsPage />
              </Container>
            }
          />
          <Route
            path="publicList/:listName"
            element={
              <Container fluid="lg" className="py-4">
                <ViewList listType={"public"}/>
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
          <Route
            path="study/:listName"
            element={
              <Container fluid="lg" className="py-4">
                <StudyCards />
              </Container>
            }
          />
          <Route
            path="import"
            element={
              <Container fluid="lg" className="py-4">
                <CSVFileReader />
              </Container>
            }
          />
        </Route>
        
      </Routes>
    </div>
  );
};

export default App;

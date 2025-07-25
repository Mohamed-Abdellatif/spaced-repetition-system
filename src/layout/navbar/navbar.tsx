import { useContext, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import {
  auth,
  getDisplayNameFromDocument,
  signOutUser,
} from "../../Utils/firebase/firebase.utils";
import "./navbar.css";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faQuestionCircle,
  faList,
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faSearch,
  faFileImport,
} from "@fortawesome/free-solid-svg-icons";
import { questionsApi } from "../../services/api";
import { todayFormatDate } from "../../Utils/helperfunctions";
import type { IQuestion } from "../../vite-env";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [displayName, setDisplayName] = useState("");

  const currentPath = location.pathname.slice(1);
  const today = todayFormatDate();

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    setQuestions([]);
    navigate("/login");
  };
  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await questionsApi.getAllQuestions(currentUser.uid);
      setQuestions(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (!questions) return;
  const genres: string[] = questions?.map(
    (question: IQuestion) => question.genre
  );

  let uniqueGenreArray: string[] = [];
  for (let i = 0; i < genres.length; i++) {
    if (!uniqueGenreArray.includes(genres[i])) {
      uniqueGenreArray.push(genres[i]);
    }
  }
  const getDisplayName = async () => {
    if (!currentUser?.email) return;
    const displayName: Record<string, string> =
      await getDisplayNameFromDocument();
    setDisplayName(displayName[currentUser?.email]);
  };
  useEffect(() => {
    getData();
    getDisplayName();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setCurrentUser({
          uid: currentUser.uid,
          email: currentUser.email ?? undefined,
          displayName: currentUser.displayName ?? undefined,
        });
      } else {
        if (!currentPath.includes("test")) {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <Navbar fixed="top" expand="lg" bg="white" className="shadow-sm">
        <Container>
          <Navbar.Brand className="brand fw-bold" onClick={() => navigate("/")}>
            SRS
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link
                className={`nav-link ${
                  currentPath === "schedule" ? "active" : ""
                }`}
                onClick={() => navigate("/schedule")}
                disabled={currentUser === null}
              >
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Schedule
              </Nav.Link>

              <NavDropdown
                title={
                  <>
                    <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                    {uniqueGenreArray
                      .concat("General")
                      .includes(currentPath.slice(5)?.replaceAll("%20", " "))
                      ? currentPath.slice(5)?.replaceAll("%20", " ")
                      : "Choose Quiz Genre"}
                  </>
                }
                id="quiz-dropdown"
                disabled={questions?.length ? !(questions?.length > 0) : true}
                className={`nav-dropdown ${
                  currentPath.includes("quiz") ? "active" : ""
                }`}
                onClick={() => getData()}
                onMouseEnter={() => getData()}
              >
                {questions?.length &&
                  questions.length > 0 &&
                  uniqueGenreArray.map((genre) => (
                    <NavDropdown.Item
                      key={genre}
                      onClick={() => navigate(`/quiz/${genre}`)}
                      active={currentPath === `quiz/${genre}`}
                    >
                      {genre?.replaceAll("%20", " ")}
                    </NavDropdown.Item>
                  ))}
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => navigate(`/quiz/Due-Today`)}
                  active={currentPath === "quiz/Due-Today"}
                  disabled={
                    questions &&
                    questions?.filter((question) => question.nextTest === today)
                      .length < 1
                  }
                >
                  Due Today
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => navigate(`/quiz/General`)}
                  active={currentPath === "quiz/General"}
                >
                  All Questions
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                className={`nav-link ${
                  currentPath === "lists" ? "active" : ""
                }`}
                onClick={() => navigate("/lists")}
                disabled={currentUser === null}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                My Lists
              </Nav.Link>

              <Nav.Link
                className={`nav-link ${
                  currentPath === "publicLists" ? "active" : ""
                }`}
                onClick={() => navigate("/publicLists")}
                disabled={currentUser === null}
              >
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Browse
              </Nav.Link>
              <Nav.Link
                className={`nav-link ${
                  currentPath === "import" ? "active" : ""
                }`}
                onClick={() => navigate("/import")}
                disabled={currentUser === null}
              >
                <FontAwesomeIcon icon={faFileImport} className="me-2" />
                Import
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center">
              {currentUser && (
                <div className="d-flex align-items-center me-3">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="me-2 text-primary"
                  />
                  <span className="fw-medium">{displayName}</span>
                </div>
              )}

              <Nav.Link
                onClick={
                  currentUser ? signOutHandler : () => navigate("/login")
                }
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon
                  icon={currentUser ? faSignOutAlt : faSignInAlt}
                  className="me-2"
                />
                {currentUser ? "Sign Out" : "Sign In"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ marginTop: "76px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default NavBar;

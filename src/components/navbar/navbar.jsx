import { useContext, useState, useEffect } from "react";
import axios from "axios";
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
import { faCalendar, faQuestionCircle, faList, faSignOutAlt, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const dataURL =  process.env.REACT_APP_SRS_BE_URL;
const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [listNames, setListNames] = useState([]);
  const [displayName, setDisplayName] = useState("");

  const currentPath = location.pathname.slice(1);
  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    setQuestions([]);
    setListNames([]);
    navigate("/login");
  };
  const getData = async () => {
    if (!currentUser) return;
    try {
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser?.uid,
      });
      const listResponse = await axios.post(`${dataURL}/getLists`, {
        userId: currentUser?.uid,
      });
      setListNames([].concat(listResponse.data.map((list) => list.listName)));

      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  const genres = [].concat(questions.map((question) => question.genre));
  let filteredArray = [];
  for (let i = 0; i < genres.length; i++) {
    if (!filteredArray.includes(genres[i])) {
      filteredArray.push(genres[i]);
    }
  }
  const getDisplayName = async () => {
    const displayName = await getDisplayNameFromDocument();
    setDisplayName(displayName[currentUser?.email]);
  };
  useEffect(() => {
    getDisplayName();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User present
        setCurrentUser(currentUser);
        // redirect to home if user is on /login page
      } else {
        // User not logged in
        // redirect to login if on a protected page
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Nav className="me-auto" >
              <Nav.Link
                className={`nav-link ${currentPath === "schedule" ? "active" : ""}`}
                onClick={() => navigate("/schedule")}
                disabled={currentUser===null}
              >
                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                Schedule
              </Nav.Link>

              <NavDropdown
                title={
                  <>
                    <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                    {filteredArray.concat("General").includes(currentPath.slice(5))
                      ? currentPath.slice(5)
                      : "Choose Quiz Genre"}
                  </>
                }
                id="quiz-dropdown"
                disabled={!questions.length > 0}
                className={`nav-dropdown ${currentPath.includes("quiz") ? "active" : ""}`}
                onClick={()=>getData()}
                onMouseEnter={()=>getData()}
              >
                {questions.length > 0 &&
                  filteredArray.map((genre) => (
                    <NavDropdown.Item
                      key={genre}
                      onClick={() => navigate(`/quiz/${genre}`)}
                      active={currentPath === `quiz/${genre}`}
                    >
                      {genre}
                    </NavDropdown.Item>
                  ))}
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => navigate(`/quiz/General`)}
                  active={currentPath === "quiz/General"}
                >
                  All Questions
                </NavDropdown.Item>
              </NavDropdown>
              
              <Nav.Link
                className={`nav-link ${currentPath === "lists" ? "active" : ""}`}
                onClick={() => navigate("/lists")}
                disabled={currentUser===null}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                Lists
              </Nav.Link>
            </Nav>

            <Nav className="align-items-center">
              {currentUser && (
                <div className="d-flex align-items-center me-3">
                  <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                  <span className="fw-medium">{displayName}</span>
                </div>
              )}
              
              <Nav.Link
                onClick={currentUser ? signOutHandler : () => navigate("/login")}
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

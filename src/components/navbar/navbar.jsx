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
import { Col, Row } from "react-bootstrap";

const dataURL = "http://localhost:3001";
const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isClicked, setIsClicked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [listNames, setListNames] = useState([]);
  const [displayName, setDisplayName] = useState("");

  const currentPath = location.pathname.slice(1);
  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
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
  }, [isClicked]);
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
    
      <Navbar fixed="top" bg="primary" expand="lg" variant="dark" >
        <Container fluid >
          
            
          <Navbar.Brand className="brand " onClick={() => navigate("/")}>
            SRS
          </Navbar.Brand>
          
          
          <Navbar.Toggle aria-controls="navbarScroll" />
          
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <button
                className={
                  currentPath === "schedule"
                    ? "btn text-light active py-2"
                    : "btn text-light py-2"
                }
                onClick={() => navigate("/schedule")}
              >
                Schedule
              </button>
              <NavDropdown
                onClick={() => setIsClicked(!isClicked)}
                disabled={!questions.length > 0}
                title={
                  filteredArray
                    .concat("General")
                    .includes(currentPath.slice(5)) ? (
                    <span className="text-white">{currentPath.slice(5,)}</span>
                  ) : (
                    <span className="text-white">Choose Quiz Genre</span>
                    
                  )
                }
                id="navbarScrollingDropdown"
                className={
                  currentPath.includes("quiz") &&
                  "btn text-light  active p-0 m-0"
                }
              >
                {questions.length > 0 &&
                  filteredArray.map((genre) => (
                    <NavDropdown.Item
                      key={genre}
                      onClick={() => navigate(`/quiz/${genre}`)}
                    >
                      {genre}
                    </NavDropdown.Item>
                  ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => navigate(`/quiz/General`)}>
                  All
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                onClick={() => setIsClicked(!isClicked)}
                title={
                  listNames
                    .includes(currentPath.slice(5)) ? (
                    <span className="text-white">{currentPath.slice(5,)}</span>
                  ) : (
                    <span className="text-white">Lists</span>
                  )
                }
                className={
                  currentPath.includes("list") &&
                  "btn text-light active p-0 m-0"
                }
                disabled={!listNames.length>0}
                id="navScrollingDropdown"
              >
                {listNames.length > 0 &&
                  listNames.map((listName) => (
                    <NavDropdown.Item
                      key={listName}
                      onClick={() => navigate(`/list/${listName}`)}
                    >
                      {listName}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
            </Nav>
            <div className="d-flex">
              <div className="btn displayName">
                {currentUser && displayName}
              </div>
              {currentUser ? (
                <button
                  className="btn text-light"
                  onClick={() => signOutHandler()}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  className="btn text-light"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              )}
            </div>
          </Navbar.Collapse>
          
        </Container>
      </Navbar>
      
      <Outlet/>
    </>
  );
};

export default NavBar;

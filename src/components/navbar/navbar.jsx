import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../Utils/firebase/firebase.utils";
import "./navbar.css";

const dataURL = "http://localhost:3001";
const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isClicked, setIsClicked] = useState(false);
  const [questions, setQuestions] = useState([]);

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate("/login");
  };

  const getData = async () => {
    try {
      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser.uid,
      });

      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked]);
  const genres=[].concat(questions.map(question=> question.genre))
  let filteredArray = [];
  for (let i = 0; i < genres.length; i++) {
    if (!filteredArray.includes(genres[i])) {
      filteredArray.push(genres[i]);
    }
    
  }

  return (
    <>
      <Navbar fixed="top" bg="primary" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand className="brand" onClick={() => navigate("/")}>
            SPACED REPETITION SYSTEM{" "}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <button
                className="btn text-light"
                onClick={() => navigate("/schedule")}
              >
                Schedule
              </button>
              <Nav.Link href="#action2">Link</Nav.Link>
              <NavDropdown onClick={()=>setIsClicked(!isClicked)} title="Choose Genre" id="navbarScrollingDropdown">
                {questions &&
                  filteredArray.map((genre) => (
                    <NavDropdown.Item key={genre} onClick={()=>navigate(`/quiz/${genre}`)}>
                      {genre}
                    </NavDropdown.Item>
                  ))}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={()=>navigate(`/quiz/all`)}>
                  All
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Link
              </Nav.Link>
            </Nav>
            <div className="d-flex">
              <div className="btn">{currentUser && currentUser.email}</div>
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
    </>
  );
};

export default NavBar;

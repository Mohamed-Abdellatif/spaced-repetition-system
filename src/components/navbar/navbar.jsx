import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { auth, getDisplayNameFromDocument, signOutUser } from "../../Utils/firebase/firebase.utils";
import "./navbar.css";
import { onAuthStateChanged } from "firebase/auth";

const dataURL = "http://localhost:3001";
const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isClicked, setIsClicked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [listNames, setListNames] = useState([]);
  const [displayName, setDisplayName] = useState('');
  

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate("/login");
  };

  const getData = async () => {
    if(!currentUser)return
    try {

      const response = await axios.post(`${dataURL}/getQuestions`, {
        userId: currentUser?.uid,
      });
      const listResponse = await axios.post(`${dataURL}/getLists`,{userId:currentUser?.uid})
      setListNames([].concat(listResponse.data.map(list=>list.listName)))

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
  const getDisplayName=async()=>{const displayName = await  getDisplayNameFromDocument()
  setDisplayName( displayName[currentUser?.email])}
  useEffect(() => {
    getDisplayName()

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
      <Navbar fixed="top" bg="primary" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand className="brand" onClick={() => navigate("/")}>
            SPACED REPETITION SYSTEM
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
                {questions.length>0 &&
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
              <NavDropdown onClick={()=>setIsClicked(!isClicked)} title="Lists" id="navbarScrollingDropdown">
                {listNames.length>0 &&
                  listNames.map((listName) => (
                    <NavDropdown.Item key={listName} onClick={()=>navigate(`/list/${listName}`)}>
                      {listName}
                    </NavDropdown.Item>
                  ))}
              </NavDropdown>
            </Nav>
            <div className="d-flex">
              <div className="btn displayName">{currentUser && displayName}</div>
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

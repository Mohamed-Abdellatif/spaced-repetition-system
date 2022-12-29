import { useContext } from "react";

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../Utils/firebase/firebase.utils";
import "./navbar.css";
const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const signOutHandler = async () => {
    await signOutUser();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <>
      <Navbar fixed='top' bg="primary" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/">SPACED REPETITION SYSTEM </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <button className="btn text-light">Home</button>
              <Nav.Link href="#action2">Link</Nav.Link>
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
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

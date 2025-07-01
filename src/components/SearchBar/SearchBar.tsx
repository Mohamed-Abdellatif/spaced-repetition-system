import { Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBar  {
  onSearch:(text:string)=>{}
}

const SearchBar = ({ onSearch }:SearchBar) => {
  return (
    <InputGroup>
      <Form.Control
        type="text"
        placeholder="Search questions..."
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button variant="outline-primary">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  );
};

export default SearchBar; 
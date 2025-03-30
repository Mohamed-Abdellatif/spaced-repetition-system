import { DropdownButton, Dropdown } from "react-bootstrap";

const GenreFilter = ({ currentGenre, setCurrentGenre, allQuestions }) => {
  return (
    <DropdownButton
      id="dropdown-basic-button"
      title={currentGenre}
      variant="outline-primary"
      className="w-100"
      disabled={allQuestions.length < 1}
    >
      <Dropdown.Item
        onClick={() => setCurrentGenre("ALL GENRES")}
        active={currentGenre === "ALL GENRES"}
      >
        ALL GENRES
      </Dropdown.Item>
      {allQuestions
        .map((question) => question.genre)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((genre, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => setCurrentGenre(genre)}
            active={currentGenre === genre}
          >
            {genre}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  );
};

export default GenreFilter; 

import { Route, Routes } from 'react-router-dom';
import './App.css';


import QuestionList from './components/questionList/questionList';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<QuestionList/>}/>
      
    </Routes>
    

  );
}

export default App;

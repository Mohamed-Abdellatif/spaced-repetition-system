import { useState, useEffect } from "react";
import { questionsApi, listsApi } from "../services/api";
import { handleNotification } from "../Utils/helperfunctions";

export const useQuestions = (currentUser) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsToShow, setQuestionsToShow] = useState(10);
  const [questionsLength, setQuestionsLength] = useState(0);
  const [currentGenre, setCurrentGenre] = useState("ALL GENRES");
  const [lists, setLists] = useState([]);
  const [response, setResponse] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const getData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const response = await questionsApi.getQuestions(
        currentUser?.uid,
        questionsToShow
      );
      const allResponse = await questionsApi.getQuestions(currentUser?.uid);
      const lengthResponse = await questionsApi.getQuestionsLength(
        currentUser?.uid
      );
      setQuestionsLength(lengthResponse);
      setAllQuestions(allResponse);
      const listResponse = await listsApi.getLists(currentUser?.uid);
      const publicListResponse = await listsApi.getPublicListsWithCreatorId(
        currentUser?.uid
      );
      setLists([...listResponse, ...publicListResponse]);
      if (currentGenre === "ALL GENRES") {
        setQuestions(response);
      } else {
        setQuestions(
          allResponse.filter((question) => currentGenre === question.genre)
        );
      }

      setLoading(false);
    } catch (error) {
      if ("Network Error" === error.message) {
        setLoading(false);
      }
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
    }
  };

  const searchQuestions = async (query) => {
    if (currentUser && query.length > 0) {
      try {
        const response = await questionsApi.searchQuestions(
          query,
          currentUser?.uid
        );
        setQuestions(response);
      } catch (err) {
        console.log(err);
      }
    } else {
      getData();
    }
  };

  const loadMoreData = () => {
    if (questionsLength > questions.length) {
      setQuestionsToShow(questionsToShow + 5);
    }
  };

  const uniqueGenres = [];
  allQuestions.map(({ genre }) => {
    if (!uniqueGenres.includes(genre)) {
      uniqueGenres.push(genre);
    }
  });
  useEffect(() => {
    getData();
  }, [currentUser, questionsToShow, currentGenre]);

  return {
    loading,
    questions,
    allQuestions,
    questionsLength,
    currentGenre,
    setCurrentGenre,
    lists,
    response,
    isNotificationVisible,
    setIsNotificationVisible,
    setResponse,
    searchQuestions,
    loadMoreData,
    getData,
    uniqueGenres
  };
};

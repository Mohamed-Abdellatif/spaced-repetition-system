import { listsApi } from "./api";
import { GoogleGenerativeAI } from "@google/generative-ai";
const Google_API_KEY = import.meta.env.VITE_API_KEY;

export const handleNotification = (setIsNotificationVisible, setResponse,response) => {
    setIsNotificationVisible(true);
    setResponse(response);
  }; 

export const addQuestionToList = async (list,toBeAdded,lists,setResponse,setIsNotificationVisible,currentUser) => {
  const { id } = toBeAdded;
  const { listName } = list;
  try {
    if (list?.creatorId === currentUser?.uid) {
      const response = await listsApi.getPublicListQuestions(listName);
      const listId = lists.filter(
        (list) => list.listName === listName.replaceAll("%20", " ")
      )[0].id;
      if (response[0].questions !== null) {
        if (!response[0].questions.includes(id)) {
          const requestions = response[0].questions;
          await listsApi.updatePublicList(listId, {
            questions: requestions.concat(id),
            creatorId: currentUser?.uid,
          });
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            `Question Added to '${listName}' Successfully`
          );
        } else {
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            "Question already exists in the list"
          );
        }
      } else {
        await listsApi.updatePublicList(listId, {
          questions: [id],
          creatorId: currentUser?.uid,
        });
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          `Question Added to '${listName}' Successfully`
        );
      }
    } else {
      const response = await listsApi.getListQuestions(
        listName,
        currentUser?.uid
      );
      const listId = lists.filter(
        (list) => list.listName === listName.replaceAll("%20", " ")
      )[0].id;
      if (response[0].questions !== null) {
        if (!response[0].questions.includes(id)) {
          const requestions = response[0].questions;
          await listsApi.updateList(listId, {
            questions: requestions.concat(id),
            userId: currentUser?.uid,
          });
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            `Question Added to '${listName}' Successfully`
          );
        } else {
          handleNotification(
            setIsNotificationVisible,
            setResponse,
            "Question already exists in the list"
          );
        }
      } else {
        await listsApi.updateList(listId, {
          questions: [id],
          userId: currentUser?.uid,
        });
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          `Question Added to '${listName}' Successfully`
        );
      }
    }
  } catch (err) {
    handleNotification(setIsNotificationVisible, setResponse, err);
  }
};

export const generateQuestionFromText = async (text,setIsNotificationVisible,setResponse,setQuestionObj,currentUser) => {
  try {
    const genAI = new GoogleGenerativeAI(Google_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Extract a question from the following text and return it as a **valid JSON object** ONLY.
      No explanations, no Markdown, just plain JSON.  you must complete the question with info extracted from the text below
      The format must match:
      {
          "question": "",
          "difficulty": "0",
          "answer": "",
          "genre": "",
          "questionType": "Short Response",
          "choices": { "choice1": "", "choice2": "", "choice3": "" }
      }
      Here is the text: "${text}"
      `;

    const response = await model.generateContent(prompt);

    if (!response || !response.response) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
      return;
    }

    let responseText = response.response.text().trim();

    if (responseText.startsWith("```json")) {
      responseText = responseText.slice(7, -3).trim();
    }

    let extractedObject;
    try {
      extractedObject = JSON.parse(responseText);
    } catch (jsonError) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
      return;
    }

    if (extractedObject?.question) {
      setQuestionObj({ ...extractedObject, userId: currentUser?.uid });
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later"
      );
    }
  } catch (error) {
    handleNotification(
      setIsNotificationVisible,
      setResponse,
      "Please Try Again Later"
    );
  }
};
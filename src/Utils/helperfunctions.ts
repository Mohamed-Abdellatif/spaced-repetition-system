import { imagesApi, listsApi } from "../services/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IList, ICurrentUser, IQuestion } from "../vite-env";
const Google_API_KEY = import.meta.env.VITE_API_KEY;

export const handleNotification = (
  setIsNotificationVisible: (bool: boolean) => void,
  setResponse: ({
    message,
    isSuccess,
  }: {
    message: string;
    isSuccess: boolean;
  }) => void,
  response: string,
  isSuccess: boolean = true
) => {
  setIsNotificationVisible(true);
  setResponse({ message: response, isSuccess: isSuccess });
};

export const addQuestionToList = async (
  list: IList,
  toBeAdded: IQuestion,
  lists: IList[],
  setResponse: ({
    message,
    isSuccess,
  }: {
    message: string;
    isSuccess: boolean;
  }) => void,
  setIsNotificationVisible: (bool: boolean) => void,
  currentUser: ICurrentUser
) => {
  const { id } = toBeAdded;
  const { listName } = list;
  try {
    if (list?.creatorId === currentUser?.uid) {
      const response = await listsApi.getPublicListQuestions(listName);
      const listId = lists.filter(
        (list: { listName: any }) =>
          list.listName === listName.replaceAll("%20", " ")
      )[0].id;
      if (!listId || !id) return;
      if (response[0].questions !== null) {
        if (!response[0].questions.includes(id)) {
          const requestions = response[0].questions;
          await listsApi.updatePublicList(listId, {
            questions: requestions.concat(id),
            creatorId: currentUser?.uid,
            listName: listName,
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
            "Question already exists in the list",
            false
          );
        }
      } else {
        await listsApi.updatePublicList(listId, {
          questions: [id],
          creatorId: currentUser?.uid,
          listName: listName,
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
        (list: { listName: any }) =>
          list.listName === listName.replaceAll("%20", " ")
      )[0].id;
      if (!listId || !id) return;
      if (response[0].questions !== null) {
        if (!response[0].questions.includes(id)) {
          const requestions = response[0].questions;
          await listsApi.updateList(listId, {
            questions: requestions.concat(id),
            userId: currentUser?.uid,
            listName: listName,
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
            "Question already exists in the list",
            false
          );
        }
      } else {
        await listsApi.updateList(listId, {
          questions: [id],
          userId: currentUser?.uid,
          listName: listName,
        });
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          `Question Added to '${listName}' Successfully`
        );
      }
    }
  } catch (err: any) {
    handleNotification(
      setIsNotificationVisible,
      setResponse,
      err.message,
      false
    );
  }
};

export const generateQuestionFromText = async (
  text: string | any[],
  setIsNotificationVisible: (bool: boolean) => void,
  setResponse: ({
    message,
    isSuccess,
  }: {
    message: string;
    isSuccess: boolean;
  }) => void,
  setQuestionObj: (question: IQuestion) => void,
  currentUser: ICurrentUser
) => {
  try {
    const genAI = new GoogleGenerativeAI(Google_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
        "Please Try Again Later",
        false
      );
      return;
    } else if (text.length < 30) {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Enter a Longer Text",
        false
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
        "Please Try Again Later",
        false
      );
      return;
    }

    if (extractedObject?.question) {
      setQuestionObj({ ...extractedObject, userId: currentUser?.uid });
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please Try Again Later",
        false
      );
    }
  } catch (error) {
    handleNotification(
      setIsNotificationVisible,
      setResponse,
      "Please Try Again Later",
      false
    );
  }
};

export const todayFormatDate = (timeZone = "Africa/Cairo") => {
  return Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

export const getQuestionImage = async (
  question: IQuestion,
  setQuestionImgURL: any
) => {
  if (question?.questionType === "image" && question?.id) {
    const imgQuestionResponse = await imagesApi.getImageAsQuestion(
      question?.id
    );
    if (imgQuestionResponse) {
      setQuestionImgURL(imgQuestionResponse.url);
    }
  }
};

export const generateWrongChoicesFromText = async (
  text: string,
  correctAnswer: string,
  setIsNotificationVisible: (bool: boolean) => void,
  setResponse: ({
    message,
    isSuccess,
  }: {
    message: string;
    isSuccess: boolean;
  }) => void
) => {
  const EMPTY_CHOICES = {
    choice1: "",
    choice2: "",
    choice3: "",
  };

  if (text.length < 1 || correctAnswer.trim() === "") {
    handleNotification(
      setIsNotificationVisible,
      setResponse,
      "Please Enter Valid Text and Answer",
      false
    );
    return EMPTY_CHOICES;
  }

  try {
    const genAI = new GoogleGenerativeAI(Google_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Based on the following text, generate 3 wrong answer choices (distractors) that are plausible but incorrect compared to the correct answer.
      Return ONLY a valid JSON object in this format:
      {
        "choice1": "",
        "choice2": "",
        "choice3": ""
      }
      Text: "${text}"
      Correct Answer: "${correctAnswer}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from markdown-wrapped response
    let cleanText = responseText.trim();

    // If wrapped in ```json ... ```
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    }

    // Fallback regex-based JSON extraction
    const match = cleanText.match(/{[\s\S]*}/);
    if (!match) {
      throw new Error("No valid JSON found");
    }

    const jsonString = match[0];
    const extractedChoices = JSON.parse(jsonString);

    if (
      extractedChoices?.choice1 &&
      extractedChoices?.choice2 &&
      extractedChoices?.choice3
    ) {
      return extractedChoices;
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Failed to Generate Wrong Choices",
        false
      );
      return extractedChoices;
    }
  } catch (error) {
    handleNotification(
      setIsNotificationVisible,
      setResponse,
      "Please Try Again Later",
      false
    );
    return { choice1: "", choice2: "", choice3: "" };
  }
};

export const shuffle = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const handleImageSubmit = async (questionID: number, image: any) => {
  if (image) {
    const formData = new FormData();
    formData.append("image", image);
    await imagesApi.uploadImage(questionID, formData);
  }
};

export const handleImageChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setImage: any
) => {
  if (!event.target.files) return;
  setImage(event.target.files[0]);
};

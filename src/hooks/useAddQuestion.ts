import { useState, type Dispatch, type SetStateAction } from "react";
import type { ICurrentUser, IQuestion } from "../vite-env";
import { QuestionObj } from "../Utils/constants";
import { imagesApi, questionsApi } from "../services/api";
import {
  generateWrongChoicesFromText,
  handleImageSubmit,
  handleNotification,
  todayFormatDate,
} from "../Utils/helperfunctions";

const useAddQuestion = (
  currentUser: ICurrentUser,
  setIsNotificationVisible: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<string>>,
  getData: () => void
) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const [image, setImage] = useState<any | null>(null);

  const [questionAsImage, setQuestionAsImage] = useState<any | null>(null);

  const [questionObj, setQuestionObj] = useState<IQuestion | null>({
    ...QuestionObj,
  });

  const handleQuestionAsImageSubmit = async (questionID: number) => {
    if (questionAsImage) {
      const formData = new FormData();
      formData.append("image", questionAsImage);
      await imagesApi.uploadImageAsQuestion(questionID, formData);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };
  const updateAddInput = (e: any, selectedOption: any = null) => {
    if (
      selectedOption?.name === "genre" &&
      selectedOption?.action !== "clear"
    ) {
      const name = selectedOption.name;
      setQuestionObj({
        ...(questionObj as IQuestion),
        [name]: e.value,
        userId: currentUser?.uid,
      });
    } else if (selectedOption?.action === "clear") {
      const name = selectedOption.name;
      setQuestionObj({
        ...(questionObj as IQuestion),
        [name]: "",
        userId: currentUser?.uid,
      });
    } else {
      setQuestionObj({
        ...(questionObj as IQuestion),
        [e.target.name]: e.target.value,
        userId: currentUser?.uid,
      });
    }
  };

  const handleAddSubmit = async () => {
    let wrongChoicesObj;
    if (!questionObj) {
      return;
    }
    const { question, answer, difficulty, genre, questionType } = questionObj;
    if (
      question != " " &&
      answer != " " &&
      difficulty &&
      genre != " " &&
      (questionType === "image" ? questionAsImage !== null : true)
    ) {
      if (questionType === "MCQ") {
        wrongChoicesObj = await generateWrongChoicesFromText(
          question,
          answer,
          setIsNotificationVisible,
          setResponse
        );
      }
      const created = todayFormatDate();
      const nextTest = created;
      const response = await questionsApi.createQuestion({
        ...questionObj,
        choices: wrongChoicesObj,
        created,
        nextTest,
      });
      if (questionType === "image") {
        handleQuestionAsImageSubmit(response.id);
      }

      handleImageSubmit(response.id, image);
      setImage(null);
      setQuestionAsImage(null);
      getData();

      setQuestionObj({ ...QuestionObj });
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        response.message
      );
      setShowAddModal(false);
    } else {
      if (questionType === "image" && questionAsImage === null) {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please upload an image"
        );
      } else {
        handleNotification(
          setIsNotificationVisible,
          setResponse,
          "Please complete the blanks"
        );
      }
    }
  };
  return {
    setQuestionAsImage,
    setQuestionObj,
    handleAddClick,
    showAddModal,
    setShowAddModal,
    questionObj,
    updateAddInput,
    handleAddSubmit,
    setImage,
    questionAsImage,
    image,
  };
};

export default useAddQuestion;

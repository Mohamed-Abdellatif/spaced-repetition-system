import { useState, type Dispatch, type SetStateAction } from "react";
import { ToEditQuestionObj } from "../Utils/constants";
import type { IQuestion } from "../vite-env";
import {
  generateWrongChoicesFromText,
  handleImageSubmit,
  handleNotification,
} from "../Utils/helperfunctions";
import { imagesApi, questionsApi } from "../services/api";

const useEditQuestion = (
  getData: () => void,
  setIsNotificationVisible: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<string>>
) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImage, setEditImage] = useState<any | null>(null);
  const [toEdit, setToEdit] = useState<IQuestion | null>({
    ...ToEditQuestionObj,
  });

  const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToEdit({
      ...(toEdit as IQuestion),
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (question: IQuestion) => {
    setToEdit(question);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    let wrongChoicesObj = { choice1: "", choice2: "", choice3: "" };
    if (!toEdit) {
      return;
    }
    const { question, answer, difficulty, genre } = toEdit;
    if (question != " " && answer != " " && difficulty && genre != " ") {
      try {
        if (!toEdit.id) {
          return;
        }
        if (toEdit.questionType === "MCQ") {
          wrongChoicesObj = await generateWrongChoicesFromText(
            question,
            answer,
            setIsNotificationVisible,
            setResponse
          );
        }

        const response = await questionsApi.updateQuestion(toEdit.id, {
          ...toEdit,
          choices: wrongChoicesObj,
        });

        if (editImage !== null && toEdit.id) {
          if (toEdit?.img) {
            await imagesApi.deleteImage(toEdit.id);
          }
          handleImageSubmit(toEdit.id, editImage);
        }
        setEditImage(null);
        getData();
        handleNotification(setIsNotificationVisible, setResponse, response);
        setShowEditModal(false);
      } catch (err: any) {
        handleNotification(setIsNotificationVisible, setResponse, err.message);
      }
    } else {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Please complete the blanks"
      );
    }
  };

  return {
    showEditModal,
    setShowEditModal,
    toEdit,
    updateInput,
    handleEditSubmit,
    setToEdit,
    setEditImage,
    handleEditClick,
  };
};

export default useEditQuestion;

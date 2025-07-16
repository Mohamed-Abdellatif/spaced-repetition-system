import { useState, type Dispatch, type SetStateAction } from "react";
import { imagesApi, questionsApi } from "../services/api";
import { handleNotification } from "../Utils/helperfunctions";
import type { IQuestion } from "../vite-env";

const useDeleteQuestion = (
  getData: () => void,
  setIsNotificationVisible: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<
    SetStateAction<{ message: string; isSuccess?: boolean | undefined }>
  >
) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState<IQuestion | null>(null);

  const handleDeleteClick = (question: IQuestion) => {
    setToDelete(question);
    setShowDeleteModal(true);
  };

  const deleteQuestion = async () => {
    try {
      if (!toDelete?.id) {
        return;
      }
      const response = await questionsApi.deleteQuestion(toDelete?.id);
      await imagesApi.deleteImage(toDelete?.id);
      if (toDelete?.questionType === "image") {
        await imagesApi.deleteQuestionAsImage(toDelete.id);
      }
      getData();
      handleNotification(setIsNotificationVisible, setResponse, response);
      setShowDeleteModal(false);
    } catch {
      handleNotification(
        setIsNotificationVisible,
        setResponse,
        "Error please try again later",
        false
      );
    }
  };
  return {
    handleDeleteClick,
    showDeleteModal,
    setShowDeleteModal,
    deleteQuestion,
    toDelete,
  };
};

export default useDeleteQuestion;

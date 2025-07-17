import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ICurrentUser, IQuestion } from "../vite-env";
import { questionsApi } from "../services/api";
import moment from "moment";

const useQuestionsQuery = (currentUser: ICurrentUser) => {
  const queryClient = useQueryClient();

  const { data: questions = [], refetch } = useQuery<IQuestion[]>({
    queryKey: ["questions", currentUser?.uid],
    queryFn: () => {
      if (!currentUser) return Promise.resolve([]);
      return questionsApi.getQuestions(currentUser.uid);
    },
    enabled: !!currentUser,
  });

  const AddQuestion = useMutation({
    mutationFn: (question: IQuestion) => questionsApi.createQuestion(question),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", currentUser?.uid],
      });
    },
  });

  const updateQuestionDate = useMutation({
    mutationFn: ({
      questionId,
      date,
      question,
    }: {
      questionId: number;
      date: Date;
      question: IQuestion;
    }) =>
      questionsApi.updateQuestion(questionId, {
        ...question,
        nextTest: moment(date).format(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", currentUser?.uid],
      });
    },
  });

  return {
    questions,
    AddQuestion,
    updateQuestionDate,
    refetch,
  };
};

export default useQuestionsQuery;

import axios from 'axios';
import type { IList, IQuestion } from '../vite-env';

const dataURL = import.meta.env.VITE_SRS_BE_URL;

// Questions API
export const questionsApi = {
  // Get questions
  getQuestions: async (userId:string, questionsNumber = 10) => {
    const params = { userId,questionsNumber };
    if (questionsNumber) questionsNumber = questionsNumber;
    const response = await axios.post(`${dataURL}/getQuestions`, params);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (questionId:number) => {
    const response = await axios.get(`${dataURL}/question/${questionId}`);
    return response.data;
  },

  // Get questions by IDs
  getQuestionsByIds: async (questionsList:number[]) => {
    const response = await axios.post(`${dataURL}/getQuestionsById`, { questionsList });
    return response.data;
  },

  // Create question
  createQuestion: async (questionData:IQuestion) => {
    const response = await axios.post(`${dataURL}/questions`, questionData);
    return response.data;
  },

  // Update question
  updateQuestion: async (questionId:number, questionData:IQuestion) => {
    const response = await axios.put(`${dataURL}/questions/${questionId}`, questionData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (questionId:number) => {
    const response = await axios.delete(`${dataURL}/questions/${questionId}`);
    return response.data;
  },

  // Search questions
  searchQuestions: async (searchText:string, userId:string) => {
    const response = await axios.post(`${dataURL}/searchQuestions/${searchText}`, { userId });
    return response.data;
  },

  // Get questions length
  getQuestionsLength: async (userId:string) => {
    const response = await axios.post(`${dataURL}/questionsLength`, { userId });
    return response.data;
  },

  getIDs: async () => {
    const response = await axios.post(`${dataURL}/getIds`);
    return response.data;
  },
};

// Lists API
export const listsApi = {

getList: async (listName: string,userId:string) => {
  
    const response = await axios.post(`${dataURL}/getList/${listName}`, { userId });
    
    return response.data[0];
  },
  getPublicList: async (listName:string,userId:string) => {
    const response = await axios.post(`${dataURL}/getPublicList/${listName}`, { userId });
    return response.data[0];
  },


  // Get lists
  getLists: async (userId:string) => {
    const response = await axios.post(`${dataURL}/getLists`, { userId });
    return response.data;
  },

  // Get public lists
  getPublicLists: async () => {
    const response = await axios.post(`${dataURL}/getPublicLists`);
    return response.data;
  },

  // Get public lists with creator ID
  getPublicListsWithCreatorId: async (creatorId:string) => {
    const response = await axios.post(`${dataURL}/getPublicListsWithCreatorId`, { creatorId });
    return response.data;
  },

  // Create list
  createList: async (listData:IList) => {
    const response = await axios.post(`${dataURL}/lists`, listData);
    return response.data;
  },

  // Create public list
  createPublicList: async (listData:IList) => {
    const response = await axios.post(`${dataURL}/publicLists`, listData);
    return response.data;
  },

  // Update list
  updateList: async (listId:number, listData:IList) => {
    const response = await axios.put(`${dataURL}/lists/${listId}`, listData);
    return response.data;
  },

  // Update public list
  updatePublicList: async (listId:number, listData:IList) => {
    const response = await axios.put(`${dataURL}/publicList/${listId}`, listData);
    return response.data;
  },

  // Delete list
  deleteList: async (listId:number) => {
    const response = await axios.delete(`${dataURL}/lists/${listId}`);
    return response.data;
  },

  // Delete public list
  deletePublicList: async (listId:number) => {
    const response = await axios.delete(`${dataURL}/publicLists/${listId}`);
    return response.data;
  },

  // Search lists
  searchLists: async (searchText:string, userId:string) => {
    const response = await axios.post(`${dataURL}/searchLists/${searchText}`, { userId });
    return response.data;
  },

  // Search public lists
  searchPublicLists: async (searchText:string, userId:string) => {
    const response = await axios.post(`${dataURL}/searchPublicLists/${searchText}`, { userId });
    return response.data;
  },

  // Get list questions
  getListQuestions: async (listName:string, userId:string) => {
    const response = await axios.post(`${dataURL}/getListQuestions`, { 
      listName: listName.replaceAll("%20", " "), 
      userId 
    });
    return response.data;
  },

  // Get public list questions
  getPublicListQuestions: async (listName:string) => {
    const response = await axios.post(`${dataURL}/getPublicListQuestions`, {
      listName: listName.replaceAll("%20", " ")
    });
    return response.data;
  }
};

// Images API
export const imagesApi = {
  // Upload image
  uploadImage: async (questionId:number, formData:any) => {
    const response = await axios.put(`${dataURL}/upload/${questionId}`, formData);
    return response.data;
  },

  // Get image
  getImage: async (questionId:number) => {
    const response = await axios.get(`${dataURL}/questionsImg/${questionId}`);
    return response.data;
  },

  // Get image direct (as blob)
  getImageDirect: async (questionId:number) => {
    const response = await axios.get(`${dataURL}/questionsImgDirect/${questionId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (questionId:number) => {
    const response = await axios.delete(`${dataURL}/deleteImage/${questionId}`);
    return response.data;
  },
  // Upload image
  uploadImageAsQuestion: async (questionId:number, formData:any) => {
    const response = await axios.put(`${dataURL}/uploadAsQuestion/${questionId}`, formData);
    return response.data;
  },

  // Get image
  getImageAsQuestion: async (questionId:number) => {
    const response = await axios.get(`${dataURL}/questionsAsImages/${questionId}`);
    return response.data;
  },

  // Get image direct (as blob)
  getQuestionAsImageDirect: async (questionId:number) => {
    const response = await axios.get(`${dataURL}/questionsAsImagesImgDirect/${questionId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete image
  deleteQuestionAsImage: async (questionId:number) => {
    const response = await axios.delete(`${dataURL}/deleteQuestionsAsImages/${questionId}`);
    return response.data;
  }
};

// Helper function to handle errors
export const handleApiError = (error:any, defaultMessage = "An error occurred") => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data.message || defaultMessage;
  }
  return error.message || defaultMessage;
}; 
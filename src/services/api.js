import axios from 'axios';

const dataURL = import.meta.env.VITE_SRS_BE_URL;

// Questions API
export const questionsApi = {
  // Get questions
  getQuestions: async (userId, questionsNumber = null) => {
    const params = { userId };
    if (questionsNumber) params.questionsNumber = questionsNumber;
    const response = await axios.post(`${dataURL}/getQuestions`, params);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (questionId) => {
    const response = await axios.get(`${dataURL}/question/${questionId}`);
    return response.data;
  },

  // Get questions by IDs
  getQuestionsByIds: async (questionsList) => {
    const response = await axios.post(`${dataURL}/getQuestionsById`, { questionsList });
    return response.data;
  },

  // Create question
  createQuestion: async (questionData) => {
    const response = await axios.post(`${dataURL}/questions`, questionData);
    return response.data;
  },

  // Update question
  updateQuestion: async (questionId, questionData) => {
    const response = await axios.put(`${dataURL}/questions/${questionId}`, questionData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (questionId) => {
    const response = await axios.delete(`${dataURL}/questions/${questionId}`);
    return response.data;
  },

  // Search questions
  searchQuestions: async (searchText, userId) => {
    const response = await axios.post(`${dataURL}/searchQuestions/${searchText}`, { userId });
    return response.data;
  },

  // Get questions length
  getQuestionsLength: async (userId) => {
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
  // Get lists
  getLists: async (userId) => {
    const response = await axios.post(`${dataURL}/getLists`, { userId });
    return response.data;
  },

  // Get public lists
  getPublicLists: async () => {
    const response = await axios.post(`${dataURL}/getPublicLists`);
    return response.data;
  },

  // Get public lists with creator ID
  getPublicListsWithCreatorId: async (creatorId) => {
    const response = await axios.post(`${dataURL}/getPublicListsWithCreatorId`, { creatorId });
    return response.data;
  },

  // Create list
  createList: async (listData) => {
    const response = await axios.post(`${dataURL}/lists`, listData);
    return response.data;
  },

  // Create public list
  createPublicList: async (listData) => {
    const response = await axios.post(`${dataURL}/publicLists`, listData);
    return response.data;
  },

  // Update list
  updateList: async (listId, listData) => {
    const response = await axios.put(`${dataURL}/lists/${listId}`, listData);
    return response.data;
  },

  // Update public list
  updatePublicList: async (listId, listData) => {
    const response = await axios.put(`${dataURL}/publicList/${listId}`, listData);
    return response.data;
  },

  // Delete list
  deleteList: async (listId) => {
    const response = await axios.delete(`${dataURL}/lists/${listId}`);
    return response.data;
  },

  // Delete public list
  deletePublicList: async (listId) => {
    const response = await axios.delete(`${dataURL}/publicLists/${listId}`);
    return response.data;
  },

  // Search lists
  searchLists: async (searchText, userId) => {
    const response = await axios.post(`${dataURL}/searchLists/${searchText}`, { userId });
    return response.data;
  },

  // Search public lists
  searchPublicLists: async (searchText, userId) => {
    const response = await axios.post(`${dataURL}/searchPublicLists/${searchText}`, { userId });
    return response.data;
  },

  // Get list questions
  getListQuestions: async (listName, userId) => {
    const response = await axios.post(`${dataURL}/getListQuestions`, { 
      listName: listName.replaceAll("%20", " "), 
      userId 
    });
    return response.data;
  },

  // Get public list questions
  getPublicListQuestions: async (listName) => {
    const response = await axios.post(`${dataURL}/getPublicListQuestions`, {
      listName: listName.replaceAll("%20", " ")
    });
    return response.data;
  }
};

// Images API
export const imagesApi = {
  // Upload image
  uploadImage: async (questionId, formData) => {
    const response = await axios.put(`${dataURL}/upload/${questionId}`, formData);
    return response.data;
  },

  // Get image
  getImage: async (questionId) => {
    const response = await axios.get(`${dataURL}/questionsImg/${questionId}`);
    return response.data;
  },

  // Get image direct (as blob)
  getImageDirect: async (questionId) => {
    const response = await axios.get(`${dataURL}/questionsImgDirect/${questionId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (questionId) => {
    const response = await axios.delete(`${dataURL}/deleteImage/${questionId}`);
    return response.data;
  },
  // Upload image
  uploadImageAsQuestion: async (questionId, formData) => {
    const response = await axios.put(`${dataURL}/uploadAsQuestion/${questionId}`, formData);
    return response.data;
  },

  // Get image
  getImageAsQuestion: async (questionId) => {
    const response = await axios.get(`${dataURL}/questionsAsImages/${questionId}`);
    return response.data;
  },

  // Get image direct (as blob)
  getQuestionAsImageDirect: async (questionId) => {
    const response = await axios.get(`${dataURL}/questionsAsImagesImgDirect/${questionId}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete image
  deleteQuestionAsImage: async (questionId) => {
    const response = await axios.delete(`${dataURL}/deleteQuestionsAsImages/${questionId}`);
    return response.data;
  }
};

// Helper function to handle errors
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data.message || defaultMessage;
  }
  return error.message || defaultMessage;
}; 
/// <reference types="vite/client" />

interface choices {
  choice1: string;
  choice2: string;
  choice3: string;
}

export interface IQuestion {
  id?: number;
  question: string;
  difficulty: number;
  answer: string;
  genre: string;
  questionType: string;
  choices: choices;
  img?:boolean;
  userId?:string;
  nextTest?:string;
  interval?:number;
  stability?:number;
  created?:string;
  lastTested?:string
}

export interface ICurrentUser {
  uid: string;
  email?: string;
  displayName?: string;
}


export interface IList {
  id?: number;
  creatorId?: string;
  userId?: string;
  description?: string;
  listName: string;
  questions: number[];
  creator?:string;
}
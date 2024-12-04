export interface IQuestion {
  question: string;
  required: boolean;
  order_id: number;
  form_id: number;
}

export interface IResponse {
  response: string;
  user_id: number;
  question_title: string;
}

export interface IForm {
  id: number | string
  form_name: string;
  form_description: string;
  arquived: boolean;
  project_id: number;
  questions: IQuestion[];
  responses: IResponse[];
  createdAt: string
  updateddAt: string
}
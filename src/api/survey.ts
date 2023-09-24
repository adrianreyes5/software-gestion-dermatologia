import { Question } from "../../pages/survey/[id]";
import axios from "../config/interceptor";
import { handleError } from "@/utils/response-handler";

export const getSurveyQuestions = async () => {
  try {
    const response = await axios.get(`/surveys/questions`);

    if (handleError(response.status)) {
      throw new Error("Ha ocurrido un error");
    }

    return {
      status: "success",
      data: response.data,
    };
  } catch (error: any) {
    console.log(error);

    return {
      status: "error",
      message: error?.message,
    };
  }
};

export const saveQuestions = async (questions: Question[], id: string) => {
  try {
    const response = await axios.put(`/survey/${id}`, questions);

    if (handleError(response.status)) {
      throw new Error("Ha ocurrido un error");
    }

    console.log(response);

    return {
      status: "success",
      data: response.data,
    };
  } catch (error: any) {
    console.log(error);

    return {
      status: "error",
      message: error?.message,
    };
  }
};

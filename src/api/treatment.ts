import axios from "../config/interceptor";
import { handleError } from "@/utils/response-handler";

export const getDateAvailableHours = async (date: string) => {
  try {
    const response = await axios.get(`/unavailability/${date}`);

    if (handleError(response.status)) {
      throw new Error("Ha ocurrido un error");
    }

    return {
      status: "success",
      data: response.data?.unavailable_dates,
    };
  } catch (error: any) {
    console.log(error);

    return {
      status: "error",
      message: error?.message,
    };
  }
};

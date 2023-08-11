import dayjs from "dayjs";
import axios from "../config/interceptor";
import { handleError } from "@/utils/response-handler";
import { MessageResponse } from "@/utils/types";

type createAppoimentProps = {
  date: string;
  time: string;
  type: string;
  treatment: number;
};

export const createAppoiment = async (props: createAppoimentProps) => {
  try {
    const response = await axios.put(`/appointment`, props);

    if (handleError(response.status)) {
      throw new Error("Ha ocurrido un error");
    }

    return {
      status: "success",
      message: "Cita creada exitosamente",
    };
  } catch (error: any) {
    console.log(error);

    return {
      status: "error",
      message: error?.message,
    };
  }
};

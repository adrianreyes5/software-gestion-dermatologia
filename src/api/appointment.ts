import axios from "../config/interceptor";
import { handleError } from "@/utils/response-handler";

type createAppointmentProps = {
  date: string;
  time: string;
  type: string;
  treatment: number;
};

export const createAppointment = async (props: createAppointmentProps) => {
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

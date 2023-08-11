export type MessageResponse = {
  type: "success" | "error";
  open: boolean;
  message: string;
};

export type Treatment = {
  "cost": number;
  "created_at": Date;
  "description": string;
  "duration": number;
  "id": number;
  "image-url": string;
  "name": string;
  "protocols": string;
  "updated_at": Date;
};

export type Appointment = {
  id: number;
  date: string;
  doctor?: string;
  end_time?: string;
  patient: string;
  start_time?: string;
  status: string;
  treatment: string;
  type?: string;
};

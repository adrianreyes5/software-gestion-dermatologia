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

export type User = {
  id: number;
  address: string;
  birthday: string;
  created_at?: Date;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role_id: number;
  updated_at?: Date;
  "image-profile"?: string | null;
};

export type FormValues = {
  address: string;
  birthday: Date;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
};
export interface UserData {
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  birthday?: string;
  email: string;
  password?: string;
  confirm_password?: string;
  "image-profile"?: string | null;
}
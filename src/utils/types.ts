export type MessageResponse = {
  type: "success" | "error";
  open: boolean;
  message: string;
};

export type Treatment = {
  cost: number;
  created_at: string;
  description: string;
  duration: number;
  id: number;
  "image-url": string;
  name: string;
  protocols: string;
  updated_at: string;
};

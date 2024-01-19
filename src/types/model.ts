import { modelProperties } from "../__mock__/model";

export type TModelRow = {
  id: number;
  model: string;
  price: number;
  title: string;
  originalImageUrl?: string;
  code?: string;
  label?: string;
  season?: string;
  material?: string;
  tone?: string;
  febricTypes?: string;
};

type ModelType = typeof modelProperties;
export type ModelKeys = keyof ModelType;

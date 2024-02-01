import { modelProperties } from "../__mock__/model";
import { TCollarAccent, TModelNavigation } from "./accent";

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

export type TAccentRow = {
  id: number | string;
  meshName: string[];
  febric: string;
  updatedFrom: TModelNavigation;
  price: number;
  code?: string
  label?:string;
  season?:string;
  type: TCollarAccent;
};

type ModelType = typeof modelProperties;
export type ModelKeys = keyof ModelType;

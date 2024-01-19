import { ModelKeys } from "./model";

export type TCollarAccent = "default" | "all" | "innerFebric"; // can extends for cuff as well
export type TModelNavigation = "febrics" | "styles" | "accents";

export type TAccentBase = {
  id: number | string;
  meshName: string[];
  febric: string;
  updatedFrom: TModelNavigation;
  price: number;
  code?: string;
  label?: string;
  season?: string;
  type: TCollarAccent;
};

export type IModelAction = Record<ModelKeys, TAccentBase>;

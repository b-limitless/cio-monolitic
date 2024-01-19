import { IModelAction, TAccentBase } from "./accent";
import { TFebric } from "./febric";
import { TMode } from "./mode";

export type TCartBase = {
  model: IModelAction;
  accent: TAccentBase;
  modelType: TMode;
  febric: TFebric;
};

export type ICartItem = TCartBase & {
  subTotal: number;
  qty: number;
  discount?: number;
  availability: String;
  id: number;
  originalImageUrl?: string;
  deliveryTime?: string | null;
  season?: string;
};

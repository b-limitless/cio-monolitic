import { ProductType } from "../../models/types";

export const validateProductType = (value) => {
    console.log(value,Object.values(ProductType) )
    if (!Object.values(ProductType).includes(value)) {
      throw new Error('Invalid product type');
    }
    return true;
  };
  
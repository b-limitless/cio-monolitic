import mongoose from "mongoose";
import PaymentStatus from "../enum/paymentStatus";
import { PaymentTypes } from "../enum/paymentTypes";

// Creating interface
interface PaymentAttrs {
  customerId: mongoose.Schema.Types.ObjectId;
  cartId: string;
  status: PaymentStatus;
  transactId: string;
  paymentMethod: PaymentTypes;
}

// An interface descript the properties that a Payment document pass
interface PaymentDoc extends mongoose.Document {
  customerId: mongoose.Schema.Types.ObjectId;
  cartId: string;
  status: PaymentStatus;
  transactId: string;
  paymentMethod: PaymentTypes;
}

// An interface define build function is available to the model
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// Create schema
const PaymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentTypes),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Build
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

// Create mongoose model
const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  PaymentSchema
);
export { Payment };

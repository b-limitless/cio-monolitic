import mongoose from "mongoose";

// Creating interface
interface VerificationAttrs {
  userId: mongoose.Schema.Types.ObjectId;
  createAt: Date;
  verificationCode: number;
}

// An interface descript the properties that a Verification document pass
interface VerificationDoc extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  createAt: Date;
  verificationCode: number;
}

// An interface define build function is available to the model
interface VerificationModel extends mongoose.Model<VerificationDoc> {
  build(attrs: VerificationAttrs): VerificationDoc;
}

// Create schema
const VerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verificationCode: {
      type: Number,
      default: null,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: { type: Date, expires: 10 * 60 * 60 * 24 * 3 },
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
VerificationSchema.statics.build = (attrs: VerificationAttrs) => {
  return new Verification(attrs);
};

// Create mongoose model
const Verification = mongoose.model<VerificationDoc, VerificationModel>(
  "Verification",
  VerificationSchema
);
export { Verification };

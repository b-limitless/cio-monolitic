import mongoose from "mongoose";

export interface ShirtMeasurementAttrs {
  cusomerId: mongoose.Schema.Types.ObjectId;
  sleevLength: number | null;
  shoulderWidth: number | null;
  chestAround: number | null;
  stomach: number | null;
  bicepAround: number | null;
  torsoLength: number | null;
  hips: number | null;
  wrist: number | null;
  neck: number | null;
}
export interface ShirtMeasurementDoc extends mongoose.Document {
  customerId: mongoose.Types.ObjectId;
  sleevLength: number | null;
  shoulderWidth: number | null;
  chestAround: number | null;
  stomach: number | null;
  bicepAround: number | null;
  torsoLength: number | null;
  hips: number | null;
  wrist: number | null;
  neck: number | null;
}
interface ShirtMeasurementModel extends mongoose.Model<ShirtMeasurementDoc> {
  build(attrs: ShirtMeasurementAttrs): ShirtMeasurementDoc;
}
const ShirtMeasurementSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer'
    },
    sleevLength: { type: Number, default: null },
    shoulderWidth: { type: Number, default: null },
    chestAround: { type: Number, default: null },
    stomach: { type: Number, default: null },
    bicepAround: { type: Number, default: null },
    torsoLength: { type: Number, default: null },
    hips: { type: Number, default: null },
    wrist: { type: Number, default: null },
    neck: { type: Number, default: null },
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

ShirtMeasurementSchema.statics.build = (attrs: ShirtMeasurementAttrs) => {
  return new ShirtMeasurement(attrs);
};
const ShirtMeasurement = mongoose.model<
  ShirtMeasurementDoc,
  ShirtMeasurementModel
>("ShirtMeasurement", ShirtMeasurementSchema);
export { ShirtMeasurement };

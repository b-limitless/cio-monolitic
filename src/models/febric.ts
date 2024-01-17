import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface FebricAttrs {
  userId: mongoose.Schema.Types.ObjectId;
  febricId: any;
  title: string;
  price: number;
  deliveryTime: string;
  excellence: string;
  warmth: string;
  weight: string;
  season: string;
  threadStyle: string;
  brightness: string;
  superShiny: boolean;
  material: string;
  tone: string;
  threadCount: number;
  opacity: string;
  waterproof: boolean;
  stretchyText: string;
  stretchy: boolean;
  mis: string;
  type: string;
  febricTypes: string;
  febricSeasons: string;
  threadTypes: string;
  threadCounts: string;
  characters: string[];
  thumbnailImageUrl:string;
  originalImageUrl:string;
}

interface FebricDoc extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  febricId: any;
  title: string;
  price: number;
  deliveryTime: string;
  excellence: string;
  warmth: string;
  weight: string;
  season: string;
  threadStyle: string;
  brightness: string;
  superShiny: boolean;
  material: string;
  tone: string;
  threadCount: number;
  opacity: string;
  waterproof: boolean;
  stretchyText: string;
  stretchy: boolean;
  mis: string;
  type: string;
  febricTypes: string;
  febricSeasons: string;
  threadTypes: string;
  threadCounts: string;
  characters: string[];
  thumbnailImageUrl:string;
  originalImageUrl:string;
  version: number;

}

interface FebricModel extends mongoose.Model<FebricDoc> {
  build(attrs: FebricAttrs): FebricDoc;
}

const febricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    febricId: {
      type: mongoose.Schema.Types.ObjectId,
  
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    excellence: {
      type: String,
      required: true,
    },
    warmth: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    threadStyle: {
      type: String,
      required: true,
    },
    brightness: {
      type: String,
      required: true,
    },
    superShiny: {
      type: Boolean,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    threadCount: {
      type: Number,
      required: true,
    },
    opacity: {
      type: String,
      required: true,
    },
    waterproof: {
      type: Boolean,
      required: true,
    },
    stretchyText: {
      type: String,
      required: true,
    },
    stretchy: {
      type: Boolean,
      required: true,
    },
    mis: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    febricTypes: {
      type: String,
      required: true,
    },
    febricSeasons: {
      type: String,
      required: true,
    },
    threadTypes: {
      type: String,
      required: true,
    },
    threadCounts: {
      type: String,
      required: true,
    },
    characters: {
      type: [String],
      required: true,
    },
    thumbnailImageUrl: {
      type: String,
      required: true
    },

    originalImageUrl:{
      type:String,
      required:true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

febricSchema.set("versionKey", "version");
febricSchema.plugin(updateIfCurrentPlugin);
febricSchema.statics.build = (attrs: FebricAttrs) => {
  return new Febric(attrs);
};

const Febric = mongoose.model<FebricDoc, FebricModel>("Febric", febricSchema);

export { Febric };

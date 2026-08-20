import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILeadDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CLOSED"],
      default: "NEW",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret._id = ret._id?.toString();
        if (ret.organizationId) ret.organizationId = ret.organizationId.toString();
        if (ret.propertyId) ret.propertyId = ret.propertyId.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

LeadSchema.index({ organizationId: 1, createdAt: -1 });

export const Lead: Model<ILeadDocument> =
  mongoose.models.Lead || mongoose.model<ILeadDocument>("Lead", LeadSchema);

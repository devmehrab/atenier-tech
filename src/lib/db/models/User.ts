import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser, UserRole, UserStatus } from "@/lib/types";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId?: mongoose.Types.ObjectId | null;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["SYSTEM_ADMIN", "OWNER", "AGENT"],
      default: "AGENT",
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret._id = ret._id?.toString();
        if (ret.organizationId) {
          ret.organizationId = ret.organizationId.toString();
        }
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

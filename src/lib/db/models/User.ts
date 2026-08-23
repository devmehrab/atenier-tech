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
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  emailVerificationOtp?: string | null;
  emailVerificationExpires?: Date | null;
  emailVerifiedAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetOtp?: string | null;
  passwordResetExpires?: Date | null;
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
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerificationToken: {
      type: String,
      index: true,
    },
    emailVerificationOtp: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    emailVerifiedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      index: true,
    },
    passwordResetOtp: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
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
        delete ret.emailVerificationToken;
        delete ret.emailVerificationOtp;
        delete ret.passwordResetToken;
        delete ret.passwordResetOtp;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

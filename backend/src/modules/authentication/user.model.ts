import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the User document interface
export interface IUserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  toJSON(): Omit<IUserDocument, 'password'>;
}

// Define the User model interface with static methods
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  emailExists(email: string): Promise<boolean>;
}

/**
 * User Schema for MongoDB
 */
const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Index for email field for faster queries
userSchema.index({ email: 1 });

// Index for createdAt field for sorting
userSchema.index({ createdAt: -1 });

// Transform the output to remove password field by default
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to check if email exists
userSchema.statics.emailExists = function (email: string) {
  return this.exists({ email: email.toLowerCase() });
};

// Pre-save middleware to ensure email is lowercase
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Create and export the User model
export const UserModel = mongoose.model<IUserDocument, IUserModel>(
  'User',
  userSchema,
);

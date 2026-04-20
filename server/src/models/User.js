import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      trim: true,
      default: ""
    },
    interests: {
      type: [String],
      default: []
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    learningStyle: {
      type: String,
      enum: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Collaborative"],
      default: "Collaborative"
    },
    availability: {
      type: [String],
      default: []
    },
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add indexes for better query performance
userSchema.index({ interests: 1 });
userSchema.index({ skillLevel: 1 });
userSchema.index({ learningStyle: 1 });
userSchema.index({ profileCompleted: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model("User", userSchema);

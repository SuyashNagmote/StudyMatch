import jwt from "jsonwebtoken";

export const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const sanitizeUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  interests: user.interests,
  skillLevel: user.skillLevel,
  learningStyle: user.learningStyle,
  availability: user.availability,
  profileCompleted: user.profileCompleted
});

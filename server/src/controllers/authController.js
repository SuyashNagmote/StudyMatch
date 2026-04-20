import { createUser, findUserByEmail, updateUser, verifyPassword } from "../store/userStore.js";
import { createToken, sanitizeUser } from "../utils/auth.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await createUser({ email, password });

    if (!user) {
      return res.status(409).json({ message: "Email already in use" });
    }

    return res.status(201).json({
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      message: "Unable to create account",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword(user, password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      message: "Unable to log in",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const saveProfile = async (req, res) => {
  try {
    const { name, interests, skillLevel, learningStyle, availability } = req.body;

    const updatedUser = await updateUser(req.user._id, {
      name,
      interests,
      skillLevel,
      learningStyle,
      availability,
      profileCompleted: true
    });

    return res.status(200).json({ user: sanitizeUser(updatedUser) });
  } catch (error) {
    console.error("Profile save error:", error);
    return res.status(500).json({ 
      message: "Unable to save profile",
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const getCurrentUser = async (req, res) => res.status(200).json({ user: sanitizeUser(req.user) });

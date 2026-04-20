import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").trim(),
  interests: z.array(z.string().min(1, "Interest cannot be empty")).min(1, "At least one interest is required"),
  skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Invalid skill level" })
  }),
  learningStyle: z.enum(["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Collaborative"], {
    errorMap: () => ({ message: "Invalid learning style" })
  }),
  availability: z.array(z.string().min(1, "Availability slot cannot be empty")).default([])
});

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.map((entry) => ({
          field: entry.path.join("."),
          message: entry.message
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors: fieldErrors
        });
      }

      return res.status(400).json({ message: "Invalid input data" });
    }
  };
};

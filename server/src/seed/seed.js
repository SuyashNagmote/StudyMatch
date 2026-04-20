import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { seedUsers } from "./seedData.js";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const runSeed = async () => {
  await connectDB();
  
  for (const seedUser of seedUsers) {
    const existingUser = await User.findOne({ email: seedUser.email.toLowerCase() });

    if (existingUser) {
      existingUser.name = seedUser.name;
      existingUser.password = seedUser.password;
      existingUser.interests = seedUser.interests;
      existingUser.skillLevel = seedUser.skillLevel;
      existingUser.learningStyle = seedUser.learningStyle;
      existingUser.availability = seedUser.availability;
      existingUser.profileCompleted = seedUser.profileCompleted;
      await existingUser.save();
    } else {
      await User.create(seedUser);
    }
  }

  console.log(`Seeded ${seedUsers.length} realistic demo users`);
  process.exit(0);
};

runSeed().catch((error) => {
  console.error("Seed failed", error.message);
  process.exit(1);
});

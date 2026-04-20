import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { seedUsers } from "../seed/seedData.js";

const dataDirectory = new URL("../data/", import.meta.url);
const dataFile = new URL("../data/users.json", import.meta.url);

let usersCache = null;
let loadPromise = null;

const normalizeUser = (user) => ({
  _id: user._id?.toString() || randomUUID(),
  email: String(user.email || "").toLowerCase().trim(),
  password: user.password,
  name: user.name || "",
  interests: Array.isArray(user.interests) ? user.interests : [],
  skillLevel: user.skillLevel || "Beginner",
  learningStyle: user.learningStyle || "Collaborative",
  availability: Array.isArray(user.availability) ? user.availability : [],
  profileCompleted: Boolean(user.profileCompleted),
  createdAt: user.createdAt || new Date().toISOString(),
  updatedAt: user.updatedAt || new Date().toISOString()
});

const cloneUser = (user) => (user ? { ...user } : null);

const persistUsers = async () => {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, JSON.stringify(usersCache, null, 2), "utf8");
};

const createSeedUsers = async () =>
  Promise.all(
    seedUsers.map(async (user) =>
      normalizeUser({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      })
    )
  );

const ensureUsersLoaded = async () => {
  if (usersCache) {
    return usersCache;
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const content = await readFile(dataFile, "utf8");
        usersCache = JSON.parse(content).map(normalizeUser);
      } catch {
        usersCache = await createSeedUsers();
        await persistUsers();
      }

      return usersCache;
    })();
  }

  return loadPromise;
};

const updateStoredUser = async (userId, updater) => {
  const users = await ensureUsersLoaded();
  const index = users.findIndex((user) => user._id === userId.toString());

  if (index === -1) {
    return null;
  }

  const updatedUser = normalizeUser({
    ...users[index],
    ...updater(users[index]),
    updatedAt: new Date().toISOString()
  });

  users[index] = updatedUser;
  await persistUsers();
  return cloneUser(updatedUser);
};

export const findUserByEmail = async (email) => {
  const users = await ensureUsersLoaded();
  return cloneUser(users.find((user) => user.email === email.toLowerCase().trim()));
};

export const findUserById = async (userId) => {
  const users = await ensureUsersLoaded();
  return cloneUser(users.find((user) => user._id === userId.toString()));
};

export const verifyPassword = async (user, candidatePassword) => bcrypt.compare(candidatePassword, user.password);

export const createUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return null;
  }

  const users = await ensureUsersLoaded();
  const user = normalizeUser({
    _id: randomUUID(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10)
  });

  users.push(user);
  await persistUsers();
  return cloneUser(user);
};

export const updateUser = async (userId, updates) =>
  updateStoredUser(userId, () => ({
    ...updates
  }));

export const findCandidateUsers = async (targetUser, limit = 50) => {
  const users = await ensureUsersLoaded();

  return users
    .filter(
      (user) =>
        user._id !== targetUser._id &&
        user.profileCompleted &&
        (user.interests.some((interest) => targetUser.interests.includes(interest)) ||
          user.skillLevel === targetUser.skillLevel ||
          user.learningStyle === targetUser.learningStyle)
    )
    .slice(0, limit)
    .map(cloneUser);
};

export const findRecentUsers = async (targetUser, limit = 20) => {
  const users = await ensureUsersLoaded();

  return users
    .filter((user) => user._id !== targetUser._id && user.profileCompleted)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, limit)
    .map(cloneUser);
};

export const findPeerUsers = async (targetUser, limit = 29) => {
  const users = await ensureUsersLoaded();

  return users
    .filter((user) => user._id !== targetUser._id && user.profileCompleted)
    .slice(0, limit)
    .map(cloneUser);
};

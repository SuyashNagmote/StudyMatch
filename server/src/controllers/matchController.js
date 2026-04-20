import { buildGraphForUser } from "../services/graphService.js";
import { getTopMatches, suggestGroup } from "../services/matchingService.js";
import { findCandidateUsers, findPeerUsers, findRecentUsers, findUserById } from "../store/userStore.js";
import { sanitizeUser } from "../utils/auth.js";

export const getMatches = async (req, res) => {
  try {
    const targetUser = await findUserById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.profileCompleted) {
      return res.status(400).json({ message: "Complete your profile to view matches" });
    }

    const candidateUsers = await findCandidateUsers(targetUser, 50);

    const users =
      candidateUsers.length > 0
        ? candidateUsers
        : await findRecentUsers(targetUser, 20);

    return res.status(200).json({
      user: sanitizeUser(targetUser),
      matches: getTopMatches(targetUser, users, 5),
      suggestedGroup: suggestGroup(targetUser, users, 4)
    });
  } catch (error) {
    console.error("Error generating matches:", error);
    return res.status(500).json({
      message: "Unable to generate matches",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  }
};

export const getGraph = async (req, res) => {
  try {
    const targetUser = await findUserById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!targetUser.profileCompleted) {
      return res.status(400).json({ message: "Complete your profile to view your graph" });
    }

    const peers = await findPeerUsers(targetUser, 29);

    return res.status(200).json(buildGraphForUser(targetUser, [targetUser, ...peers]));
  } catch (error) {
    console.error("Error building graph:", error);
    return res.status(500).json({
      message: "Unable to build graph",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  }
};

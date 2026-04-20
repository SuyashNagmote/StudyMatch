const skillRank = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3
};

const normalizeInterests = (interests = []) =>
  interests.map((interest) => interest.trim().toLowerCase()).filter(Boolean);

export const calculateInterestSimilarity = (userA, userB) => {
  const interestsA = new Set(normalizeInterests(userA.interests));
  const interestsB = new Set(normalizeInterests(userB.interests));

  if (interestsA.size === 0 && interestsB.size === 0) {
    return 0;
  }

  const intersectionCount = [...interestsA].filter((interest) => interestsB.has(interest)).length;
  const unionCount = new Set([...interestsA, ...interestsB]).size;

  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

export const calculateSkillBalance = (userA, userB) => {
  const diff = Math.abs(skillRank[userA.skillLevel] - skillRank[userB.skillLevel]);

  if (diff === 1) {
    return 1;
  }

  if (diff === 0) {
    return 0.65;
  }

  return 0.75;
};

export const calculateLearningStyleScore = (userA, userB) =>
  userA.learningStyle === userB.learningStyle ? 1 : 0.3;

export const calculateAvailabilityOverlap = (userA, userB) => {
  const availabilityA = new Set(userA.availability || []);
  const availabilityB = new Set(userB.availability || []);

  if (availabilityA.size === 0 && availabilityB.size === 0) {
    return 0.5; // Neutral score when both have no availability set
  }

  const intersectionCount = [...availabilityA].filter(slot => availabilityB.has(slot)).length;
  const unionCount = new Set([...availabilityA, ...availabilityB]).size;

  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

export const calculateMatchScore = (userA, userB) => {
  const interestSimilarity = calculateInterestSimilarity(userA, userB);
  const skillBalance = calculateSkillBalance(userA, userB);
  const learningStyle = calculateLearningStyleScore(userA, userB);
  const availabilityOverlap = calculateAvailabilityOverlap(userA, userB);

  const score = 0.4 * interestSimilarity + 0.25 * skillBalance + 0.2 * learningStyle + 0.15 * availabilityOverlap;

  return {
    score: Number(score.toFixed(3)),
    breakdown: {
      interestSimilarity: Number(interestSimilarity.toFixed(3)),
      skillBalance: Number(skillBalance.toFixed(3)),
      learningStyle: Number(learningStyle.toFixed(3)),
      availabilityOverlap: Number(availabilityOverlap.toFixed(3))
    }
  };
};

const pairKey = (idA, idB) => [idA.toString(), idB.toString()].sort().join(":");

export const buildPairwiseMap = (users) => {
  const map = new Map();

  for (let index = 0; index < users.length; index += 1) {
    for (let inner = index + 1; inner < users.length; inner += 1) {
      map.set(pairKey(users[index]._id, users[inner]._id), calculateMatchScore(users[index], users[inner]));
    }
  }

  return map;
};

export const getTopMatches = (targetUser, users, limit = 5) =>
  users
    .filter((candidate) => candidate._id.toString() !== targetUser._id.toString())
    .map((candidate) => {
      const result = calculateMatchScore(targetUser, candidate);

      return {
        id: candidate._id.toString(),
        name: candidate.name,
        email: candidate.email,
        interests: candidate.interests,
        skillLevel: candidate.skillLevel,
        learningStyle: candidate.learningStyle,
        availability: candidate.availability,
        score: result.score,
        breakdown: result.breakdown
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

export const suggestGroup = (targetUser, users, desiredGroupSize = 4) => {
  const others = users.filter((candidate) => candidate._id.toString() !== targetUser._id.toString());
  const pairwise = buildPairwiseMap(users);
  const selected = [targetUser];
  const maxGroupSize = Math.min(desiredGroupSize, others.length + 1);

  while (selected.length < maxGroupSize) {
    let bestCandidate = null;
    let bestAverage = -1;

    others.forEach((candidate) => {
      if (selected.some((member) => member._id.toString() === candidate._id.toString())) {
        return;
      }

      const average =
        selected.reduce((sum, member) => {
          const key = pairKey(member._id, candidate._id);
          return sum + (pairwise.get(key)?.score ?? calculateMatchScore(member, candidate).score);
        }, 0) / selected.length;

      if (average > bestAverage) {
        bestAverage = average;
        bestCandidate = candidate;
      }
    });

    if (!bestCandidate) {
      break;
    }

    selected.push(bestCandidate);
  }

  const groupScores = [];

  for (let index = 0; index < selected.length; index += 1) {
    for (let inner = index + 1; inner < selected.length; inner += 1) {
      const key = pairKey(selected[index]._id, selected[inner]._id);
      groupScores.push(pairwise.get(key)?.score ?? calculateMatchScore(selected[index], selected[inner]).score);
    }
  }

  return {
    members: selected.map((member) => ({
      id: member._id.toString(),
      name: member.name,
      interests: member.interests,
      skillLevel: member.skillLevel,
      learningStyle: member.learningStyle,
      availability: member.availability
    })),
    groupScore:
      groupScores.length > 0
        ? Number((groupScores.reduce((sum, score) => sum + score, 0) / groupScores.length).toFixed(3))
        : 0
  };
};

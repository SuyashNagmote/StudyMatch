import { calculateMatchScore } from "./matchingService.js";

const primaryInterest = (user) => user.interests?.[0] || "General";
const domainKeywords = {
  AI: ["ai", "machine learning", "deep learning", "computer vision", "generative ai"],
  Data: ["data science", "statistics", "analytics", "data visualization", "data engineering", "sql"],
  Backend: ["backend", "node.js", "apis", "java", "microservices", "system design", "databases"],
  Frontend: ["frontend", "react", "typescript", "ui engineering", "design systems"],
  Design: ["ui/ux", "product design", "accessibility", "product management"],
  Mobile: ["mobile", "flutter", "android", "kotlin", "ios", "swift"],
  Cloud: ["cloud", "devops", "docker", "kubernetes"],
  Security: ["cybersecurity", "networks", "linux"]
};

const resolveDomain = (user) => {
  const interests = (user.interests || []).map((interest) => interest.toLowerCase());

  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (interests.some((interest) => keywords.some((keyword) => interest.includes(keyword)))) {
      return domain;
    }
  }

  return primaryInterest(user);
};

export const buildGraphForUser = (targetUser, users) => {
  const nodes = users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    interests: user.interests || [],
    group: primaryInterest(user),
    domain: resolveDomain(user),
    isCurrentUser: user._id.toString() === targetUser._id.toString(),
    skillLevel: user.skillLevel,
    learningStyle: user.learningStyle
  }));
  const domainById = new Map(nodes.map((node) => [node.id, node.domain]));

  const edges = [];

  for (let index = 0; index < users.length; index += 1) {
    for (let inner = index + 1; inner < users.length; inner += 1) {
      const { score } = calculateMatchScore(users[index], users[inner]);

      if (
        score >= 0.45 ||
        users[index]._id.toString() === targetUser._id.toString() ||
        users[inner]._id.toString() === targetUser._id.toString()
      ) {
        edges.push({
          source: users[index]._id.toString(),
          target: users[inner]._id.toString(),
          weight: score
        });
      }
    }
  }

  const domainStats = nodes.reduce((stats, node) => {
    if (!stats.has(node.domain)) {
      stats.set(node.domain, {
        domain: node.domain,
        peopleCount: 0,
        connectionCount: 0
      });
    }

    stats.get(node.domain).peopleCount += 1;
    return stats;
  }, new Map());

  edges.forEach((edge) => {
    const sourceDomain = domainById.get(edge.source);
    const targetDomain = domainById.get(edge.target);

    if (sourceDomain && domainStats.has(sourceDomain)) {
      domainStats.get(sourceDomain).connectionCount += 1;
    }

    if (targetDomain && targetDomain !== sourceDomain && domainStats.has(targetDomain)) {
      domainStats.get(targetDomain).connectionCount += 1;
    }
  });

  return {
    userId: targetUser._id.toString(),
    nodes,
    edges,
    domainStats: [...domainStats.values()].sort((left, right) => right.peopleCount - left.peopleCount)
  };
};

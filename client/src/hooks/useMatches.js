import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { matchApi } from "../api/client";

const normalizeMatches = (data) => ({
  ...data,
  matches:
    data.matches?.map((match) => ({
      ...match,
      score: Number(match.score || 0),
      breakdown: match.breakdown || {}
    })) || []
});

const normalizeGraph = (data) => ({
  ...data,
  nodes:
    data.nodes?.map((node) => ({
      ...node,
      id: node.id.toString()
    })) || [],
  edges:
    data.edges?.map((edge) => ({
      ...edge,
      source: edge.source.toString(),
      target: edge.target.toString(),
      weight: Number(edge.weight || 0)
    })) || []
});

export const useMatches = (token) =>
  useQuery({
    queryKey: ["matches", token],
    queryFn: () => matchApi.getMatches(token),
    enabled: Boolean(token),
    staleTime: 2 * 60 * 1000,
    retry: 1,
    select: normalizeMatches,
    onError: () => {
      toast.error("Failed to load matches");
    }
  });

export const useGraph = (token) =>
  useQuery({
    queryKey: ["graph", token],
    queryFn: () => matchApi.getGraph(token),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: normalizeGraph,
    onError: () => {
      toast.error("Failed to load graph data");
    }
  });

export const useDashboardData = (token) => {
  const matchesQuery = useMatches(token);
  const graphQuery = useGraph(token);

  return {
    matches: matchesQuery.data,
    graph: graphQuery.data,
    isLoading: matchesQuery.isLoading || graphQuery.isLoading,
    error: matchesQuery.error || graphQuery.error,
    refetch: () => {
      matchesQuery.refetch();
      graphQuery.refetch();
    }
  };
};

import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authApi } from "../api/client";

export const useSignup = () => {
  return useMutation({
    mutationFn: (payload) => authApi.signup(payload),
    onSuccess: (data) => {
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      toast.success("Welcome back!");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials");
    },
  });
};

export const useCurrentUser = (token) => {
  return useQuery({
    queryKey: ["currentUser", token],
    queryFn: () => authApi.me(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSaveProfile = () => {
  return useMutation({
    mutationFn: ({ token, payload }) => authApi.saveProfile(token, payload),
    onSuccess: (data) => {
      toast.success("Profile saved successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save profile");
    },
  });
};

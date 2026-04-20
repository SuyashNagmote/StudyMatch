import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import { useSignup, useLogin } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/LoadingSkeleton";

const AuthPage = () => {
  const navigate = useNavigate();
  const { persistSession, user } = useAuth();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const signupMutation = useSignup();
  const loginMutation = useLogin();

  if (user) {
    return <Navigate to={user.profileCompleted ? "/dashboard" : "/profile"} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const mutation = mode === "signup" ? signupMutation : loginMutation;

    try {
      const response = await mutation.mutateAsync(form);
      persistSession(response.token, response.user);
      navigate(response.user.profileCompleted ? "/dashboard" : "/profile");
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const loading = signupMutation.isPending || loginMutation.isPending;

  return (
    <AuthShell
      title={mode === "signup" ? "Create your account" : "Welcome back"}
      subtitle="Start with auth, complete your profile, then explore graph-powered study group recommendations."
    >
      <div className="mb-6 inline-flex rounded-full bg-slate-100 p-1">
        {["signup", "login"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              mode === option ? "bg-ink text-white" : "text-slate-500"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
            placeholder="you@college.edu"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
            placeholder="At least 6 characters"
          />
        </label>
        {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              Please wait...
            </>
          ) : (
            mode === "signup" ? "Create account" : "Log in"
          )}
        </button>
      </form>
      <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">
        Seed login: <span className="font-semibold text-slate-700">alice@campus.edu / password123</span>
      </div>
    </AuthShell>
  );
};

export default AuthPage;

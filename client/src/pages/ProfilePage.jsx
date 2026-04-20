import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { useSaveProfile } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/LoadingSkeleton";

const learningStyles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Collaborative"];
const skillLevels = ["Beginner", "Intermediate", "Advanced"];
const availabilityOptions = [
  "Mon Evening",
  "Tue Afternoon",
  "Tue Evening",
  "Wed Afternoon",
  "Wed Evening",
  "Thu Afternoon",
  "Thu Evening",
  "Fri Evening",
  "Sat Morning",
  "Sun Morning"
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token, user, setUser, logout } = useAuth();
  const saveProfileMutation = useSaveProfile();
  const [form, setForm] = useState({
    name: user?.name || "",
    interests: user?.interests?.join(", ") || "",
    skillLevel: user?.skillLevel || "Beginner",
    learningStyle: user?.learningStyle || "Collaborative",
    availability: user?.availability || []
  });
  const [error, setError] = useState("");

  const toggleAvailability = (slot) => {
    setForm((current) => ({
      ...current,
      availability: current.availability.includes(slot)
        ? current.availability.filter((item) => item !== slot)
        : [...current.availability, slot]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await saveProfileMutation.mutateAsync({
        token,
        payload: {
          ...form,
          interests: form.interests.split(",").map((interest) => interest.trim()).filter(Boolean)
        }
      });
      setUser(response.user);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const loading = saveProfileMutation.isPending;

  return (
    <PageShell
      title="Profile Setup"
      subtitle="Tell StudyMatch how you learn so the graph engine can recommend strong study partners and balanced groups."
      actions={
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Log out
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-soft lg:grid-cols-[1fr_0.9fr]">
        <section className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
              placeholder="Your full name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Interests</span>
            <input
              type="text"
              required
              value={form.interests}
              onChange={(event) => setForm({ ...form, interests: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
              placeholder="AI, DSA, Data Science"
            />
            <span className="mt-2 block text-xs text-slate-400">
              Use comma-separated tags so the matching engine can compute Jaccard similarity.
            </span>
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">Skill level</span>
              <select
                value={form.skillLevel}
                onChange={(event) => setForm({ ...form, skillLevel: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
              >
                {skillLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">Learning style</span>
              <select
                value={form.learningStyle}
                onChange={(event) => setForm({ ...form, learningStyle: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-ocean"
              >
                {learningStyles.map((style) => (
                  <option key={style}>{style}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
        <section className="rounded-[1.75rem] bg-slate-50 p-5">
          <h2 className="text-lg font-semibold text-ink">Availability</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick the time blocks you usually prefer for collaborative study sessions.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {availabilityOptions.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => toggleAvailability(slot)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  form.availability.includes(slot) ? "bg-ink text-white" : "bg-white text-slate-500"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-3xl bg-white p-4 text-sm text-slate-600">
            The API stores profile data independently from visualization so future graph layers can reuse the same endpoints.
          </div>
          {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
          <button type="submit" disabled={loading} className="mt-6 w-full rounded-2xl bg-coral px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Saving profile...
              </>
            ) : (
              "Continue to dashboard"
            )}
          </button>
        </section>
      </form>
    </PageShell>
  );
};

export default ProfilePage;

import GraphPreview from "../components/GraphPreview";
import MatchCard from "../components/MatchCard";
import PageShell from "../components/PageShell";
import { DashboardSectionSkeleton, GraphSkeleton, LoadingSpinner } from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useMatches";

const getNetworkHighlights = (graph) => {
  const domainStats = graph?.domainStats || [];

  if (!domainStats.length) {
    return [];
  }

  return [
    {
      label: "Strongest domain",
      value: domainStats[0].domain,
      meta: `${domainStats[0].peopleCount} students`
    },
    {
      label: "Total students",
      value: String(graph?.nodes?.length || 0),
      meta: "in this network"
    },
    {
      label: "Visible connections",
      value: String(graph?.edges?.length || 0),
      meta: "between profiles"
    }
  ];
};

const PersonCard = ({ member }) => (
  <div className="rounded-3xl border border-slate-200 p-4">
    <p className="font-semibold text-ink">{member.name}</p>
    <p className="mt-1 text-sm text-slate-500">
      {[member.skillLevel, member.learningStyle].filter(Boolean).join(" | ")}
    </p>
  </div>
);

const DashboardPage = () => {
  const { token, user, logout } = useAuth();
  const { matches, graph, isLoading, error, refetch } = useDashboardData(token);
  const highlights = getNetworkHighlights(graph);

  return (
    <PageShell
      title={`Welcome, ${user.name}`}
      subtitle="Review your strongest teammate matches, your suggested study squad, and the live network around your learning domains."
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
      {isLoading ? (
        <div className="grid gap-6">
          <DashboardSectionSkeleton />
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <GraphSkeleton />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-white p-10 text-center text-red-500 shadow-soft">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="large" className="mb-4" />
            <p className="mb-4">{error.message || "Failed to load dashboard data"}</p>
            <button
              type="button"
              onClick={refetch}
              className="flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              <LoadingSpinner size="small" />
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] bg-white p-6 shadow-soft">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold text-ink">Top 5 teammates</h2>
                <p className="text-sm text-slate-500">
                  Ranked with weighted compatibility scores across interest, skill, style, and availability.
                </p>
              </div>
              <div className="grid gap-4">
                {matches?.matches?.length ? (
                  matches.matches.map((match) => <MatchCard key={match.id} match={match} />)
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                    No strong matches yet. Add more students or broaden interests to improve recommendations.
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-semibold text-ink">Suggested group</h2>
                <p className="mt-1 text-sm text-slate-500">A balanced 3-4 person cluster based on pairwise compatibility.</p>
                <div className="mt-5 space-y-3">
                  {matches?.suggestedGroup?.members?.length ? (
                    matches.suggestedGroup.members.map((member) => <PersonCard key={member.id} member={member} />)
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      No group suggestion is available yet.
                    </div>
                  )}
                </div>
                <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Group compatibility score</p>
                  <p className="mt-1 text-3xl font-bold text-ink">
                    {(((matches?.suggestedGroup?.groupScore) || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink">Network snapshot</h2>
                <p className="mt-1 text-sm text-slate-500">A quick read on where the strongest student clusters are forming.</p>
                <div className="mt-4 space-y-3">
                  {highlights.map((item) => (
                    <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold text-ink">{item.value}</p>
                      <p className="text-xs text-slate-500">{item.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-soft">
            <GraphPreview graph={graph} />
          </section>
        </div>
      )}
    </PageShell>
  );
};

export default DashboardPage;

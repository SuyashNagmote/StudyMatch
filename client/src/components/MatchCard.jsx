const MatchCard = ({ match }) => {
  const details = [match.skillLevel, match.learningStyle].filter(Boolean).join(" | ");
  const interests = Array.isArray(match.interests) ? match.interests : [];
  const breakdown = match.breakdown || {};

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">{match.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{details || "Profile details unavailable"}</p>
        </div>
        <div className="rounded-full bg-ocean/10 px-3 py-1 text-sm font-semibold text-ocean">
          {(Number(match.score || 0) * 100).toFixed(0)}%
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {interests.map((interest) => (
          <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {interest}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-400">Interests</p>
          <p className="mt-1 font-semibold text-ink">{(Number(breakdown.interestSimilarity || 0) * 100).toFixed(0)}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-400">Skill</p>
          <p className="mt-1 font-semibold text-ink">{(Number(breakdown.skillBalance || 0) * 100).toFixed(0)}%</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-400">Style</p>
          <p className="mt-1 font-semibold text-ink">{(Number(breakdown.learningStyle || 0) * 100).toFixed(0)}%</p>
        </div>
      </div>
    </article>
  );
};

export default MatchCard;

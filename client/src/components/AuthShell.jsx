const AuthShell = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.3),_transparent_35%),linear-gradient(135deg,#020617,#0f172a_55%,#1e293b)] px-4 py-10 text-white">
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur">
        <span className="inline-flex rounded-full bg-coral/20 px-4 py-1 text-sm font-semibold text-coral">
          Graph-native study groups
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-wheat md:text-5xl">
          Build better study squads from shared goals, balanced skills, and compatible learning styles.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          StudyMatch models each student as a graph node so recommendations stay reusable for future 3D visualization.
        </p>
      </section>
      <section className="rounded-[2rem] bg-white p-8 text-ink shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-ocean">StudyMatch MVP</p>
        <h2 className="mt-3 text-3xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  </div>
);

export default AuthShell;

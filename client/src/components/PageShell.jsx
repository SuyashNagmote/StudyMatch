const PageShell = ({ title, subtitle, actions, children }) => (
  <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_35%,#f8fafc_100%)] px-4 py-8 text-ink">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#164e63)] p-8 text-white shadow-soft lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">StudyMatch</p>
          <h1 className="mt-3 text-4xl font-bold">{title}</h1>
          <p className="mt-2 max-w-2xl text-slate-200">{subtitle}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </div>
  </div>
);

export default PageShell;

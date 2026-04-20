import React from 'react';

// Skeleton shimmer animation
const shimmer = `
@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 468px 104px;
  animation: shimmer 1.5s infinite linear;
}
`;

// Match Card Skeleton
export const MatchCardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 p-4 bg-white">
    <div className="flex items-center justify-between mb-3">
      <div className="skeleton h-6 w-32 rounded"></div>
      <div className="skeleton h-8 w-16 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-4 w-3/4 rounded"></div>
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-6 w-20 rounded-full"></div>
        <div className="skeleton h-6 w-24 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Graph Skeleton
export const GraphSkeleton = () => (
  <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] p-4">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="skeleton h-6 w-32 rounded mb-2"></div>
        <div className="skeleton h-4 w-64 rounded"></div>
      </div>
      <div className="skeleton h-8 w-20 rounded-full"></div>
    </div>
    <div className="skeleton h-[360px] w-full rounded-3xl bg-white"></div>
  </div>
);

// Dashboard Section Skeleton
export const DashboardSectionSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="rounded-[2rem] bg-white p-6 shadow-soft">
      <div className="mb-5">
        <div className="skeleton h-8 w-40 rounded mb-2"></div>
        <div className="skeleton h-4 w-48 rounded"></div>
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => <MatchCardSkeleton key={i} />)}
      </div>
    </div>
    <aside className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="skeleton h-8 w-32 rounded mb-3"></div>
        <div className="skeleton h-4 w-56 rounded mb-5"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-200 p-4">
              <div className="skeleton h-5 w-24 rounded mb-2"></div>
              <div className="skeleton h-4 w-32 rounded"></div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <div className="skeleton h-4 w-40 rounded mb-2"></div>
          <div className="skeleton h-10 w-16 rounded"></div>
        </div>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-soft">
        <div className="skeleton h-6 w-28 rounded mb-3"></div>
        <div className="skeleton h-4 w-64 rounded mb-4"></div>
        <div className="skeleton h-64 w-full rounded-3xl bg-slate-950"></div>
      </div>
    </aside>
  </div>
);

// Profile Form Skeleton
export const ProfileFormSkeleton = () => (
  <div className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-soft lg:grid-cols-[1fr_0.9fr]">
    <section className="space-y-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="block">
          <div className="skeleton h-4 w-24 rounded mb-2"></div>
          <div className="skeleton h-12 w-full rounded-2xl"></div>
        </div>
      ))}
    </section>
    <aside className="space-y-5">
      <div>
        <div className="skeleton h-5 w-32 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="skeleton h-10 w-full rounded-2xl"></div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="skeleton h-12 w-32 rounded-2xl"></div>
        <div className="skeleton h-12 w-24 rounded-2xl"></div>
      </div>
    </aside>
  </div>
);

// Auth Form Skeleton
export const AuthFormSkeleton = () => (
  <div className="w-full max-w-md">
    <div className="space-y-4">
      <div className="skeleton h-12 w-full rounded-2xl"></div>
      <div className="skeleton h-12 w-full rounded-2xl"></div>
      <div className="skeleton h-12 w-full rounded-2xl"></div>
    </div>
  </div>
);

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <svg className="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

// Global loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center">
      <LoadingSpinner size="large" className="mb-4" />
      <p className="text-slate-700 font-medium">{message}</p>
    </div>
  </div>
);

// Add shimmer styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmer;
  document.head.appendChild(style);
}

export default {
  MatchCardSkeleton,
  GraphSkeleton,
  DashboardSectionSkeleton,
  ProfileFormSkeleton,
  AuthFormSkeleton,
  LoadingSpinner,
  LoadingOverlay
};

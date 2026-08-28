export default function FindTutorsLoading() {
  return (
    <main className="status-page" role="status" aria-live="polite">
      <div className="status-content">
        <svg
          className="status-icon status-icon--pulse"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
          <path d="M4 5.5v16M8 7h8M8 11h8" />
        </svg>
        <p className="status-text">Getting you the best tutors…</p>
      </div>
    </main>
  );
}

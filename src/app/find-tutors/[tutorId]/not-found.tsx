import Link from "next/link";

export default function TutorNotFound() {
  return (
    <main className="status-page">
      <div className="status-content">
        <svg
          className="status-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6M9 9l6 6" />
        </svg>
        <h1 className="status-heading">Tutor Not Found</h1>
        <p className="status-text">
          We couldn't find the tutor profile you're looking for. They may have updated their availability or the link is incorrect.
        </p>
        <Link href="/find-tutors" className="status-link">
          Browse Tutors
        </Link>
      </div>
    </main>
  );
}

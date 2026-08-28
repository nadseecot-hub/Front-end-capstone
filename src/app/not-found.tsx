import Link from "next/link";

export default function NotFound() {
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
        <h1 className="status-heading">Page Not Found</h1>
        <p className="status-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="status-link">
          Go to Home
        </Link>
      </div>
    </main>
  );
}

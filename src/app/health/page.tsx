import { searchTutors } from "@/services/tutorService";

export default async function HealthPage() {
  const tutors = await searchTutors();

  return (
    <section className="page">
      <h1>Health Check</h1>
      <p>End-to-end data fetch from tutorService through the App Router.</p>
      <ul className="health-list">
        {tutors.map((tutor) => (
          <li key={tutor.id}>
            <strong>{tutor.name}</strong> — {tutor.subject} ({tutor.level}) — ${tutor.price}/hr
          </li>
        ))}
      </ul>
    </section>
  );
}

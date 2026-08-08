type TutorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TutorDetailPage({ params }: TutorDetailPageProps) {
  const { id } = await params;

  return (
    <section className="page">
      <h1>Tutor Detail</h1>
      <p>View profile, availability, and fit details for tutor {id}.</p>
    </section>
  );
}

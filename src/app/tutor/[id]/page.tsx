import { Metadata } from "next";
import TutorDetailsView from "@/features/TutorDetails/TutorDetailsView";
import { getTutorProfile } from "@/features/TutorDetails/TutorDetailsModel";

type TutorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TutorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutorProfile(id);

  if (!tutor) {
    return {
      title: "Tutor Not Found | TutorFinder",
      description: "The tutor profile you're looking for doesn't exist.",
    };
  }

  return {
    title: `${tutor.name} - ${tutor.subject} Tutor | TutorFinder`,
    description: tutor.bio,
    openGraph: {
      title: `${tutor.name} - ${tutor.subject} Tutor`,
      description: tutor.bio,
      type: "profile",
    },
  };
}

export default async function TutorDetailPage({ params }: TutorDetailPageProps) {
  const { id } = await params;

  return <TutorDetailsView tutorId={id} />;
}

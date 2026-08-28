import { Metadata } from "next";
import TutorDetailsView from "@/features/TutorDetails/TutorDetailsView";
import { getTutorProfile } from "@/features/TutorDetails/TutorDetailsModel";

type TutorDetailsPageProps = {
  params: Promise<{ tutorId: string }>;
};

export async function generateMetadata({ params }: TutorDetailsPageProps): Promise<Metadata> {
  const { tutorId } = await params;
  const tutor = await getTutorProfile(tutorId);

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

export default async function TutorDetailsPage({ params }: TutorDetailsPageProps) {
  const { tutorId } = await params;
  return <TutorDetailsView tutorId={tutorId} />;
}

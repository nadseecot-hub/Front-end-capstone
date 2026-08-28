import React from "react";
import Link from "next/link";
import { useSavedTutorsViewModel } from "./useSavedTutorsViewModel";
import TutorCard from "../../components/TutorCard/TutorCard";
import { Tutor } from "../../services/tutorService";
import "./SavedTutorsView.css";

/* ==========================================================================
   SavedTutorsView
   --------------------------------------------------------------------------
   Pure JSX. All state, loading, and error handling come from
   useSavedTutorsViewModel. All Firebase access lives behind the
   SavedTutorsModel — this file imports neither the model nor the
   firebaseService directly.
   ========================================================================== */

const SavedTutorsView: React.FC = () => {
  const { savedTutors, loading, error, removeTutor } = useSavedTutorsViewModel();

  return (
    <div className="saved-tutors-view">
      {/* ---- Page header ------------------------------------------------- */}
      <header className="saved-tutors-view__header">
        <h1 className="saved-tutors-view__heading">Saved Tutors</h1>
        <p className="saved-tutors-view__subtext">
          Tutors you've saved for later. Remove any tutor when you're done.
        </p>
      </header>

      {/* ---- Loading / Error / Empty / Results --------------------------- */}
      {loading && (
        <p className="saved-tutors-view__loading">Loading saved tutors…</p>
      )}

      {error && !loading && (
        <p className="saved-tutors-view__error">Error: {error}</p>
      )}

      {!loading && !error && savedTutors.length === 0 && (
        <div className="saved-tutors-view__empty">
          <p className="saved-tutors-view__empty-title">
            You haven't saved any tutors yet.
          </p>
          <p className="saved-tutors-view__empty-body">
            Browse tutors on the home page and tap{" "}
            <strong>Save</strong> to keep track of the ones you like.
          </p>
          <Link href="/" className="saved-tutors-view__empty-cta">
            Find a tutor
          </Link>
        </div>
      )}

      {!loading && !error && savedTutors.length > 0 && (
        <>
          <p className="saved-tutors-view__count">
            {savedTutors.length} saved tutor
            {savedTutors.length === 1 ? "" : "s"}
          </p>
          <div className="saved-tutors-view__grid">
            {savedTutors.map((tutor: Tutor) => (
              <div className="saved-tutors-view__item" key={tutor.id}>
                <TutorCard tutor={tutor} />
                <button
                  type="button"
                  className="saved-tutors-view__remove"
                  onClick={() => removeTutor(tutor.id)}
                  aria-label={`Remove ${tutor.name} from saved tutors`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedTutorsView;

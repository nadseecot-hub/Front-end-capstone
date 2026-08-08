import React from 'react';
import { useHomeViewModel } from './useHomeViewModel';
import TutorCard from '../../components/TutorCard/TutorCard';
import './HomeView.css';

const HomeView: React.FC = () => {
  const {
    subject,
    setSubject,
    level,
    setLevel,
    maxPrice,
    setMaxPrice,
    tutors,
    loading,
    error,
    handleSearch,
    savingId,
    saveError,
    savedIds,
    handleSaveTutor,
  } = useHomeViewModel();

  return (
    <div className="home-view">
      {/* ---- Hero: heading + supporting copy + elevated search card ---- */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__inner">
          <h1 id="hero-heading" className="hero__heading">
            Find a Tutor
          </h1>
          <p className="hero__subtext">
            We help students find a tutor who fits how they learn, and help
            parents feel confident about who’s teaching them.
          </p>

          <form
            className="search-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="search-card__field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Math"
              />
            </div>

            <div className="search-card__field">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
              >
                <option value="">Any level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="search-card__field">
              <label htmlFor="maxPrice">Max price ($/hr)</label>
              <input
                id="maxPrice"
                type="number"
                value={maxPrice !== undefined ? maxPrice : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxPrice(value === '' ? undefined : Number(value));
                }}
                placeholder="e.g., 50"
                min={0}
              />
            </div>

            <button
              type="submit"
              className="search-card__submit"
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Search Tutors'}
            </button>
          </form>
        </div>
      </section>

      {/* ---- Results -------------------------------------------------------- */}
      {loading && <p className="loading">Loading tutors…</p>}
      {error && <p className="error">Error: {error}</p>}
      {saveError && (
        <p className="error" role="alert">
          Couldn’t save tutor: {saveError}
        </p>
      )}

      {!loading && tutors.length > 0 && (
        <div className="tutor-list">
          <p className="tutor-list__count">
            Found {tutors.length} tutor{tutors.length === 1 ? '' : 's'}
          </p>
          <div className="tutor-list__grid">
            {tutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                tutor={tutor}
                onSave={handleSaveTutor}
                saving={savingId === tutor.id}
                isSaved={savedIds.has(tutor.id)}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && tutors.length === 0 && !error && (
        <p className="no-results">No tutors found matching your criteria.</p>
      )}
    </div>
  );
};

export default HomeView;

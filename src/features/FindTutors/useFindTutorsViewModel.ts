"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getFindTutors, priceBounds, type FindTutor } from "./FindTutorsModel";

export type SortOption = "Most Relevant" | "Highest Rated" | "Lowest Price";
export type ViewMode = "grid" | "list";
type Filters = { subjects: string[]; region: string; experience: string; minPrice: number; maxPrice: number };
const defaultFilters: Filters = { subjects: [], region: "Any region", experience: "All Experience", minPrice: priceBounds.min, maxPrice: priceBounds.max };

export function useFindTutorsViewModel() {
  const [tutors, setTutors] = useState<FindTutor[]>([]);
  const [draftFilters, setDraftFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>("Most Relevant");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => { getFindTutors().then(setTutors).catch(() => setError("We couldn't load tutors right now.")).finally(() => setLoading(false)); }, []);

  const toggleSubject = useCallback((subject: string) => {
    setDraftFilters((current) => ({ ...current, subjects: subject === "All Subjects" ? [] : current.subjects.includes(subject) ? current.subjects.filter((item) => item !== subject) : [...current.subjects, subject] }));
  }, []);
  const setDraftFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => setDraftFilters((current) => ({ ...current, [key]: value })), []);
  const applyFilters = useCallback(() => { setAppliedFilters(draftFilters); setCurrentPage(1); setMobileFiltersOpen(false); }, [draftFilters]);
  const resetFilters = useCallback(() => { setDraftFilters(defaultFilters); setAppliedFilters(defaultFilters); setCurrentPage(1); }, []);

  const filteredTutors = useMemo(() => {
    const filtered = tutors.filter((tutor) => {
      const subjectMatch = appliedFilters.subjects.length === 0 || appliedFilters.subjects.some((subject) => tutor.subject.toLowerCase().includes(subject.toLowerCase()));
      const experienceMatch = appliedFilters.experience === "All Experience" || tutor.experienceYears >= Number.parseInt(appliedFilters.experience, 10);
      return subjectMatch && tutor.region === (appliedFilters.region === "Any region" ? tutor.region : appliedFilters.region) && tutor.price >= appliedFilters.minPrice && tutor.price <= appliedFilters.maxPrice && experienceMatch;
    });
    return filtered.sort((a, b) => sortBy === "Highest Rated" ? b.rating - a.rating : sortBy === "Lowest Price" ? a.price - b.price : b.rating - a.rating);
  }, [appliedFilters, sortBy, tutors]);
  const pageCount = Math.max(1, Math.ceil(filteredTutors.length / pageSize));
  const visibleTutors = filteredTutors.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const setPage = useCallback((page: number) => setCurrentPage(Math.max(1, Math.min(page, pageCount))), [pageCount]);

  return { tutors, filteredTutors, visibleTutors, draftFilters, sortBy, setSortBy, viewMode, setViewMode, currentPage, pageCount, setPage, toggleSubject, setDraftFilter, applyFilters, resetFilters, mobileFiltersOpen, setMobileFiltersOpen, loading, error };
}

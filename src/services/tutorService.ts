// This file contains a local mock dataset of tutors
// and functions to search/filter them.

// Types are defined in src/types — imported and re-exported here for
// backwards compatibility with any code that imports from this module.
export type { Tutor, TutorSearchFilters } from '../types';
import type { Tutor, TutorSearchFilters } from '../types';

// Mock dataset of 15 tutors
const MOCK_TUTORS: Tutor[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    subject: 'Mathematics',
    level: 'intermediate',
    bio: 'Experienced math tutor with 5 years of teaching algebra and calculus.',
    price: 30,
    rating: 4.8,
    availability: 'Weekdays 4pm-8pm, Weekends 10am-2pm'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    subject: 'Science',
    level: 'beginner',
    bio: 'Passionate about making science fun and accessible for all ages.',
    price: 25,
    rating: 4.9,
    availability: 'Mondays, Wednesdays, Fridays 3pm-7pm'
  },
  {
    id: '3',
    name: 'David Chen',
    subject: 'English Literature',
    level: 'advanced',
    bio: 'Published author and former university lecturer specializing in literary analysis.',
    price: 40,
    rating: 4.7,
    availability: 'Tuesdays and Thursdays 5pm-9pm'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    subject: 'History',
    level: 'intermediate',
    bio: 'History enthusiast with a focus on making historical events relevant to today.',
    price: 28,
    rating: 4.6,
    availability: 'Weekends 9am-5pm'
  },
  {
    id: '5',
    name: 'James Wilson',
    subject: 'Physics',
    level: 'advanced',
    bio: 'PhD in Physics with experience tutoring high school and college students.',
    price: 45,
    rating: 4.9,
    availability: 'Weekdays 6pm-9pm'
  },
  {
    id: '6',
    name: 'Lisa Brown',
    subject: 'Chemistry',
    level: 'intermediate',
    bio: 'Chemistry tutor who emphasizes practical experiments and real-world applications.',
    price: 32,
    rating: 4.8,
    availability: 'Mondays and Wednesdays 4pm-8pm'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    subject: 'Mathematics',
    level: 'beginner',
    bio: 'Patient and encouraging tutor for students building foundational math skills.',
    price: 22,
    rating: 4.5,
    availability: 'Tuesdays and Thursdays 3pm-7pm'
  },
  {
    id: '8',
    name: 'Amanda Lee',
    subject: 'Biology',
    level: 'beginner',
    bio: 'Making biology engaging through interactive lessons and visual aids.',
    price: 26,
    rating: 4.7,
    availability: 'Weekends 11am-3pm'
  },
  {
    id: '9',
    name: 'Michael Davis',
    subject: 'Computer Science',
    level: 'intermediate',
    bio: 'Software engineer teaching programming concepts from basics to advanced algorithms.',
    price: 38,
    rating: 4.9,
    availability: 'Weekdays 5pm-8pm'
  },
  {
    id: '10',
    name: 'Jessica Martinez',
    subject: 'Spanish',
    level: 'intermediate',
    bio: 'Native Spanish speaker with experience teaching all age groups.',
    price: 28,
    rating: 4.8,
    availability: 'Mondays, Wednesdays, Fridays 4pm-7pm'
  },
  {
    id: '11',
    name: 'Christopher Clark',
    subject: 'Mathematics',
    level: 'advanced',
    bio: 'Specializing in SAT/ACT math prep and advanced problem-solving techniques.',
    price: 42,
    rating: 4.9,
    availability: 'Tuesdays and Thursdays 6pm-9pm'
  },
  {
    id: '12',
    name: 'Emily White',
    subject: 'English',
    level: 'beginner',
    bio: 'Helping students improve reading comprehension and writing skills.',
    price: 24,
    rating: 4.6,
    availability: 'Weekends 10am-2pm'
  },
  {
    id: '13',
    name: 'Daniel Lewis',
    subject: 'Science',
    level: 'intermediate',
    bio: 'Focused on hands-on experiments and connecting science to everyday life.',
    price: 30,
    rating: 4.7,
    availability: 'Mondays and Wednesdays 5pm-8pm'
  },
  {
    id: '14',
    name: 'Olivia Walker',
    subject: 'History',
    level: 'advanced',
    bio: 'Expert in world history with a passion for storytelling through historical events.',
    price: 35,
    rating: 4.8,
    availability: 'Tuesdays and Thursdays 4pm-7pm'
  },
  {
    id: '15',
    name: 'Benjamin Hall',
    subject: 'Art',
    level: 'beginner',
    bio: 'Encouraging creativity and teaching various art techniques and mediums.',
    price: 20,
    rating: 4.5,
    availability: 'Saturdays 9am-12pm'
  }
];

/**
 * Search for tutors based on provided filters.
 * @param filters - Optional filters for subject, level, and maxPrice
 * @returns Promise resolving to filtered array of tutors
 */
export const searchTutors = async (filters: TutorSearchFilters = {}): Promise<Tutor[]> => {
  // Simulate API delay (optional, but good practice for consistency with real API)
  // We'll use a short timeout to simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = MOCK_TUTORS;

      if (filters.subject) {
        const searchTerm = filters.subject.toLowerCase();
        filtered = filtered.filter(tutor =>
          tutor.subject.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.level) {
        filtered = filtered.filter(tutor => tutor.level === filters.level);
      }

      const { maxPrice } = filters;
      if (maxPrice !== undefined) {
        filtered = filtered.filter(tutor => tutor.price <= maxPrice);
      }

      resolve(filtered);
    }, 300); // 300ms delay to simulate network
  });
};
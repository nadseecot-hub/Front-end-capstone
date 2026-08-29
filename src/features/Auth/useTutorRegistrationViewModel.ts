import { useState, useCallback, useMemo, useRef } from "react";
import { type User } from "firebase/auth";
import { AuthModel } from "./AuthModel";

export type TutorRegistrationStep =
  | "info"
  | "password"
  | "bio-education"
  | "review"
  | "processing"
  | "complete";

export interface TutorRegistrationFormData {
  name: string;
  email: string;
  subjects: string;
  password: string;
  confirmPassword: string;
  bio?: string;
  experience?: string;
  education?: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    year?: string;
  };
}

export interface UseTutorRegistrationViewModelReturn {
  // Form data
  formData: TutorRegistrationFormData;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setSubjects: (subjects: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setBio: (bio: string) => void;
  setExperience: (experience: string) => void;
  setEducation: (
    education: TutorRegistrationFormData["education"]
  ) => void;

  // Step management
  currentStep: TutorRegistrationStep;
  goToStep: (step: TutorRegistrationStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Validation & submission
  loading: boolean;
  error: string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<User | null>;
  canProceed: boolean;
  processingMessages: string[];
  currentProcessingMessageIndex: number;

  // Completion
  isComplete: boolean;
  reset: () => void;
}

export const useTutorRegistrationViewModel = (
): UseTutorRegistrationViewModelReturn => {
  // Form data
  const [formData, setFormData] = useState<TutorRegistrationFormData>({
    name: "",
    email: "",
    subjects: "",
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState<TutorRegistrationStep>(
    "info"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Processing messages for step 5
  const [processingMessages, setProcessingMessages] =
    useState<string[]>([
      "Preparing your profile...",
      "Setting up your tutor dashboard...",
      "Organizing your teaching preferences...",
      "Finalizing your tutor profile...",
    ]);
  const [currentProcessingMessageIndex, setCurrentProcessingMessageIndex] =
    useState<number>(0);
  const processingCleanup = useRef<(() => void) | null>(null);

  // Setters for form data
  const setName = useCallback((name: string) => {
    setFormData((prev) => ({ ...prev, name }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setFormData((prev) => ({ ...prev, email }));
  }, []);

  const setSubjects = useCallback((subjects: string) => {
    setFormData((prev) => ({ ...prev, subjects }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setFormData((prev) => ({ ...prev, password }));
  }, []);

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    setFormData((prev) => ({ ...prev, confirmPassword }));
  }, []);

  const setBio = useCallback((bio: string) => {
    setFormData((prev) => ({ ...prev, bio }));
  }, []);
  const setExperience = useCallback((experience: string) => {
    setFormData((prev) => ({ ...prev, experience }));
  }, []);

  const setEducation = useCallback(
    (education: TutorRegistrationFormData["education"]) => {
      setFormData((prev) => ({ ...prev, education }));
    },
    []
  );

  // Step navigation
  const goToStep = useCallback((step: TutorRegistrationStep) => {
    setCurrentStep(step);
    // Reset error when changing steps
    setError(null);
  }, []);

  const nextStep = useCallback(() => {
    setError(null);
    switch (currentStep) {
      case "info":
        setCurrentStep("password");
        break;
      case "password":
        setCurrentStep("bio-education");
        break;
      case "bio-education":
        setCurrentStep("review");
        break;
      case "review":
        setCurrentStep("processing");
        // Start processing sequence
        startProcessingSequence();
        break;
      default:
        break;
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    setError(null);
    switch (currentStep) {
      case "password":
        setCurrentStep("info");
        break;
      case "bio-education":
        setCurrentStep("password");
        break;
      case "review":
        setCurrentStep("bio-education");
        break;
      case "processing":
        // Stay in processing or go to review?
        setCurrentStep("review");
        break;
      default:
        break;
    }
  }, [currentStep]);

  // Validation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "info":
        return !!formData.name && !!formData.email && !!formData.subjects;
      case "password":
        return (
          formData.password.length >= 6 &&
          formData.confirmPassword === formData.password
        );
      case "bio-education":
        // Always can proceed (optional fields)
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  // Form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent): Promise<User | null> => {
      if (e) {
        e.preventDefault();
      }

      setError(null);
      setLoading(true);

      try {
        // Validate required fields
        if (!formData.name.trim()) {
          setError("Enter your name");
          return null;
        }

        if (!formData.email.trim()) {
          setError("Enter a valid email address");
          return null;
        }

        if (!formData.subjects.trim()) {
          setError("Enter at least one subject");
          return null;
        }

        if (!formData.password || formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return null;
        }

        if (formData.confirmPassword !== formData.password) {
          setError("Passwords do not match");
          return null;
        }

        try {
          setCurrentStep("processing");
          startProcessingSequence();
          const user = await AuthModel.registerTutor(formData);
          return user;
        } catch (registrationError) {
          // Keep the processing UI honest: persistence failures are shown to the user.
          const message =
            registrationError instanceof Error
              ? registrationError.message
              : String(registrationError);
          setError(message);
          processingCleanup.current?.();
          processingCleanup.current = null;
          setIsComplete(false);
          setCurrentStep("review");
          return null;
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : String(err);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  // Processing sequence
  const startProcessingSequence = useCallback(() => {
    processingCleanup.current?.();
    let index = 0;
    setCurrentProcessingMessageIndex(index);

    const interval = setInterval(() => {
      index++;
      if (index >= processingMessages.length) {
        clearInterval(interval);
        // Transition to complete after a brief pause
        setTimeout(() => {
          setIsComplete(true);
        }, 1500);
      } else {
        setCurrentProcessingMessageIndex(index);
      }
    }, 2500); // Change message every 2.5 seconds

    // Cleanup on unmount or if we leave processing step
    const cleanup = () => clearInterval(interval);
    processingCleanup.current = cleanup;
    return cleanup;
  }, [processingMessages]);

  // Reset function
  const reset = useCallback(() => {
    processingCleanup.current?.();
    processingCleanup.current = null;
    setFormData({
      name: "",
      email: "",
      subjects: "",
      password: "",
      confirmPassword: "",
    });
    setCurrentStep("info");
    setLoading(false);
    setError(null);
    setIsComplete(false);
    setCurrentProcessingMessageIndex(0);
  }, []);

  return {
    // Form data
    formData,
    setName,
    setEmail,
    setSubjects,
    setPassword,
    setConfirmPassword,
    setBio,
    setExperience,
    setEducation,

    // Step management
    currentStep,
    goToStep,
    nextStep,
    prevStep,

    // Validation & submission
    loading,
    error,
    handleSubmit,
    canProceed,
    processingMessages,
    currentProcessingMessageIndex,

    // Completion
    isComplete,
    reset,
  };
};

export default useTutorRegistrationViewModel;

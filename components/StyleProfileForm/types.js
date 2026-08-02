// Step descriptor + validation rules for the Style Profile form.
// One file, no schema library. The form state is plain useState.

export const STEPS = [
  {
    name: "preferredStyle",
    label: "What's your preferred style?",
    help: "We'll start recommendations here.",
    kind: "select",
    options: [
      { value: "casual", label: "Casual" },
      { value: "formal", label: "Formal" },
      { value: "streetwear", label: "Streetwear" },
    ],
  },
  {
    name: "beltSize",
    label: "What's your belt size (inches)?",
    help: "Measure an existing belt from buckle to hole.",
    kind: "number",
    min: 20,
    max: 60,
    step: 1,
  },
  {
    name: "watchFaceSize",
    label: "Watch face size (mm)",
    help: "Most men land between 38 and 46 mm.",
    kind: "number",
    min: 20,
    max: 60,
    step: 1,
  },
  {
    name: "budgetMin",
    label: "Minimum budget",
    help: "Lower end of your spend range.",
    kind: "number",
    min: 0,
    step: 1,
  },
  {
    name: "budgetMax",
    label: "Maximum budget",
    help: "Should be higher than your minimum.",
    kind: "number",
    min: 0,
    step: 1,
  },
  {
    name: "email",
    label: "Email address",
    help: "We'll send your picks here.",
    kind: "email",
  },
  {
    name: "notifyDrops",
    label: "Notifications",
    help: "Notify me when new accessories drop in my style.",
    kind: "checkbox",
  },
];

export const INITIAL_VALUES = {
  preferredStyle: "casual",
  beltSize: "",
  watchFaceSize: "",
  budgetMin: "",
  budgetMax: "",
  email: "",
  notifyDrops: false,
};

// Validate one field. Returns an error message string or null.
// `values` is the whole form so cross-field rules (budgetMax vs budgetMin) can be checked.
export function validateField(step, values) {
  const raw = values[step.name];

  switch (step.kind) {
    case "select": {
      if (!raw) return "Choose a style";
      const allowed = (step.options || []).map((o) => o.value);
      if (!allowed.includes(raw)) return "Choose a style";
      return null;
    }
    case "number": {
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n)) return "Enter a number";
      if (step.name === "beltSize") {
        if (!Number.isInteger(n)) return "Whole numbers only";
        if (n <= 0) return "Belt size must be positive";
        if (n > 60) return "Enter a realistic belt size";
      }
      if (step.name === "watchFaceSize") {
        if (n <= 0) return "Watch face size must be positive";
        if (n > 60) return "Too large for a watch face";
      }
      if (step.name === "budgetMin" || step.name === "budgetMax") {
        if (n < 0) return "Must be zero or more";
      }
      // Cross-field: when validating budgetMax, also check it exceeds budgetMin.
      if (step.name === "budgetMax") {
        const min = Number(values.budgetMin);
        if (!Number.isNaN(min) && n <= min) return "Max must be higher than min";
      }
      return null;
    }
    case "email": {
      const v = String(raw || "").trim();
      if (!v) return "Enter an email";
      // Pragmatic email check, no regex library needed.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email";
      return null;
    }
    case "checkbox": {
      // The checkbox is always valid — opting in is optional.
      return null;
    }
    default:
      return null;
  }
}

// Run validation across every step. Returns an object of {fieldName: message}.
export function validateAll(values) {
  const errors = {};
  for (const step of STEPS) {
    const msg = validateField(step, values);
    if (msg) errors[step.name] = msg;
  }
  return errors;
}
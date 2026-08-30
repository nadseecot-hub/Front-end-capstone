import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BecomeATutorModal from "@/components/BecomeATutorModal";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: null, role: null }),
}));

vi.mock("@/features/Auth/AuthModel", () => ({
  AuthModel: {
    registerTutor: vi.fn(),
  },
}));

describe("Become a Tutor password step", () => {
  it("shows the mismatch error and enables Continue only when passwords match", async () => {
    const user = userEvent.setup();
    render(<BecomeATutorModal open onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Name"), "Alex Johnson");
    await user.type(screen.getByLabelText("Email"), "alex@example.com");
    await user.type(screen.getByLabelText("Subject(s)"), "Mathematics");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Password"), "secure-pass");
    await user.type(screen.getByLabelText("Confirm Password"), "different-pass");

    expect(screen.getByRole("alert")).toHaveTextContent("Passwords don’t match.");
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(screen.getByText("Secure your account")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Confirm Password"));
    await user.type(screen.getByLabelText("Confirm Password"), "secure-pass");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  });
});

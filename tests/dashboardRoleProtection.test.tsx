import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardSidebar } from "@/features/Dashboard/DashboardControls";
import { useAuth } from "@/context/AuthContext";

const replace = vi.fn();

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace }),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("tutor dashboard role protection", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  it("allows an authenticated tutor role to remain on /dashboard", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "tutor-1" } as never,
      role: "tutor",
      authLoading: false,
      logout: vi.fn(),
      profile: null,
      refreshProfile: vi.fn(),
    });

    const { getByRole } = render(<DashboardSidebar />);

    expect(getByRole("complementary", { name: /tutor dashboard navigation/i })).toBeInTheDocument();
    await waitFor(() => expect(replace).not.toHaveBeenCalled());
  });

  it("redirects a parent/student role away from the tutor dashboard", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "student-1" } as never,
      role: "parent",
      authLoading: false,
      logout: vi.fn(),
      profile: null,
      refreshProfile: vi.fn(),
    });

    render(<DashboardSidebar />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
  });
});

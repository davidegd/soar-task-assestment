import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { Metadata } from "next";

jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock("@/context/app-context", () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  ),
}));

jest.mock("@/components/layout/header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

jest.mock("@/components/layout/sidebar", () => ({
  Sidebar: () => <aside data-testid="sidebar">Sidebar</aside>,
}));

jest.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe("RootLayout Component", () => {
  it("renders layout structure correctly", () => {
    render(
      <RootLayout>
        <div data-testid="content">Main Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("app-provider")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("should have correct metadata", () => {
    const expectedMetadata: Metadata = {
      title: "Soar Task - Financial Dashboard",
      description: "A financial dashboard for managing your finances",
    };

    expect(expectedMetadata.title).toBe("Soar Task - Financial Dashboard");
    expect(expectedMetadata.description).toBe(
      "A financial dashboard for managing your finances"
    );
  });
});

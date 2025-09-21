import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminDashboard from "../src/pages/Admin/AdminDashboard";

// Mock service supaya tidak panggil API asli
jest.mock("../src/services/memberService", () => ({
  getDashboardData: jest.fn(() =>
    Promise.resolve({
      data: {
        totalMembers: 5,
        activeMembers: 3,
        expiredMembers: 2,
      },
    })
  ),
}));

describe("AdminDashboard", () => {
  test("render judul dashboard", async () => {
    render(<AdminDashboard />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test("menampilkan data dari service", async () => {
    render(<AdminDashboard />);

    await waitFor(() =>
      expect(screen.getByText(/Total Members/i)).toBeInTheDocument()
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

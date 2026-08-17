import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  it("shows 'Name is required' when submitting an empty name", async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSave={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/name is required/i)
    ).toBeInTheDocument();
  });

  it("shows 'Enter a valid email' for a malformed email", async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSave={vi.fn()} />);

    await user.type(screen.getByLabelText(/^display name$/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/enter a valid email/i)
    ).toBeInTheDocument();
  });

  it("calls onSave with form data and shows a success toast on valid submit", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/^display name$/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          displayName: "Ada Lovelace",
          email: "ada@example.com",
          notifications: true,
        })
      )
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      /settings saved/i
    );
  });

  it("notification toggle defaults to checked and can be turned off", async () => {
    const user = userEvent.setup();
    render(<SettingsForm onSave={vi.fn()} />);

    const toggle = screen.getByLabelText(/notify me by email/i);
    expect(toggle).toBeChecked();

    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });
});

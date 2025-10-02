/* eslint-disable @typescript-eslint/consistent-type-imports */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import GoHomeButton from "./GoHomeButton"

// Mock react-router's useNavigate to observe navigation calls
const mockNavigate = vi.fn()
vi.mock("react-router", async () => {
  const actual: typeof import("react-router") = await vi.importActual<typeof import("react-router")>(
    "react-router",
  )
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("GoHomeButton", () => {
  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it("renders the button with the expected text", () => {
    render(<GoHomeButton />)
    expect(
      screen.getByRole("button", { name: /try going to home page/i }),
    ).toBeInTheDocument()
  })

  it("navigates to root when clicked", async () => {
    const user = userEvent.setup()
    render(<GoHomeButton />)

    const btn = screen.getByRole("button", { name: /try going to home page/i })
    await user.click(btn)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/")
  })
})

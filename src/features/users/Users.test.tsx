/* eslint-disable @typescript-eslint/consistent-type-imports */
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Users } from "./Users"
import type { User } from "./usersApiSlice.ts"

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

// Mock UserForm to keep test focused on Users behavior
vi.mock("./UserForm.tsx", () => ({
  UserForm: ({ user }: { user: { id: number; name: string } }) => (
    <div data-testid={`mock-user-form-${user.id.toString(10)}`}>MockUserForm: {user.name}</div>
  ),
}))

describe("Users", () => {
  const users = [
    { id: 1, name: "Leanne Graham" },
    { id: 2, name: "Ervin Howell" },
  ] as User[]

  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it("renders a collapse item for each user with their name as the header", () => {
    render(<Users users={users} isLoading={false} />)

    // The usernames should appear as the panel headers
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument()
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument()

    // Mocked forms should not be visible until panels are expanded
    expect(screen.queryByTestId("mock-user-form-1")).not.toBeInTheDocument()
    expect(screen.queryByTestId("mock-user-form-2")).not.toBeInTheDocument()
  })

  it("expands a panel when its header is clicked and renders the UserForm for that user", async () => {
    const user = userEvent.setup()
    render(<Users users={users} isLoading={false} />)

    // Click the first panel header
    await user.click(screen.getByText("Leanne Graham"))

    // The mocked form for user 1 should now be rendered
    expect(screen.getByTestId("mock-user-form-1")).toBeInTheDocument()

    // The second user's form should still be hidden
    expect(screen.queryByTestId("mock-user-form-2")).not.toBeInTheDocument()
  })

  it("navigates to posts when clicking 'See Posts' without toggling the panel", async () => {
    const user = userEvent.setup()
    render(<Users users={users} isLoading={false} />)

    // Find the second panel container via its header then find its extra button inside
    const secondHeader = screen.getByText("Ervin Howell")

    // Find the nearest collapse item region to scope the search for the button
    const itemContainer: HTMLElement = secondHeader.closest(".ant-collapse-item") ?? document.body

    const seePostsBtn = within(itemContainer).getAllByRole("button", {
      name: /see posts/i,
    })

    await user.click(seePostsBtn[1])

    // Navigation should have been triggered to the posts route for user 2
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith("/posts/2")

    // Clicking the extra button should not have expanded the panel
    expect(screen.queryByTestId("mock-user-form-2")).not.toBeInTheDocument()
  })
})

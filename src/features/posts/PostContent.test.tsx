/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* // eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { PostContent } from "./PostContent"
import type { Post } from "./postsApiSlice"


vi.mock("react-router", async () => {
  const actual: typeof import("react-router") =
    await vi.importActual("react-router")
  return {
    ...actual,
    useParams: () => ({ userId: "5" }),
  }
})


const mockConfirm = vi.fn()
const mockMessageError = vi.fn()
vi.mock("antd", async () => {
  const actual: typeof import("antd") = await vi.importActual("antd")
  return {
    ...actual,
    Modal: { ...actual.Modal, confirm: (opts: any) => mockConfirm(opts) },
    message: {
      ...actual.message,

      error: (...args: any[]) => mockMessageError(...args),
    },
  }
})


vi.mock("./EditPostModal.tsx", () => ({
  EditPostModal: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-edit-post-modal">
      EditPostModal open: {String(isOpen)}
    </div>
  ),
}))


const mockDeleteFn = vi.fn().mockReturnValue(Promise.resolve({}))
let mockError: unknown = undefined
vi.mock("./postsApiSlice.ts", async () => {
  const actual: typeof import("./postsApiSlice") =
    await vi.importActual("./postsApiSlice")
  return {
    ...actual,
    useDeletePostMutation: () => [mockDeleteFn, { error: mockError }] as const,
  }
})

describe("PostContent", () => {
  const post: Post = {
    id: 10,
    userId: 5,
    title: "Test Post",
    body: "This is a post body",
  }

  it("renders title and body", () => {
    render(<PostContent post={post} isLoading={false} />)

    expect(screen.getByText("Test Post")).toBeInTheDocument()
    expect(screen.getByText("This is a post body")).toBeInTheDocument()
  })

  it("opens the edit modal when clicking the edit icon", async () => {
    const user = userEvent.setup()
    render(<PostContent post={post} isLoading={false} />)


    const editIcon = screen.getByLabelText(/edit/i)
    await user.click(editIcon)


    expect(screen.getByTestId("mock-edit-post-modal")).toHaveTextContent(
      "open: true",
    )
  })

  it("confirms and deletes the post when clicking the delete icon", async () => {
    const user = userEvent.setup()


    mockConfirm.mockImplementation(({ onOk }) => {
      if (typeof onOk === "function") onOk()
    })

    render(<PostContent post={post} isLoading={false} />)

    const deleteIcon = screen.getByLabelText(/delete/i)
    await user.click(deleteIcon)


    expect(mockConfirm).toHaveBeenCalled()


    expect(mockDeleteFn).toHaveBeenCalledWith({ postId: 10, userId: 5 })
  })

  it("shows an error message when delete mutation has an error", () => {
    mockError = { status: 500 }

    render(<PostContent post={post} isLoading={false} />)

    expect(mockMessageError).toHaveBeenCalledWith("Could not delete Post")
  })
})

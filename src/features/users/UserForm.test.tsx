/* eslint-disable @typescript-eslint/consistent-type-imports */
import { afterEach, describe, expect, it, vi } from "vitest"
import { renderWithProviders } from "../../utils/test-utils"
import { screen } from "@testing-library/react"
import { UserForm } from "./UserForm"
import { User } from "./usersApiSlice"
import { message } from "antd"

const baseUser: User = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: { lat: "-37.3159", lng: "81.1496" },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered",
    bs: "e-enable",
  },
}

const mockUpdate = vi.fn().mockReturnValue(Promise.resolve({}))

const mocks = vi.hoisted(() => {
  return {
    useUpdateUserMutation: () => [mockUpdate, { error: undefined }] as const,
  }
})

vi.mock("./usersApiSlice.ts", async () => {
  const actual: typeof import("./usersApiSlice") =
    await vi.importActual("./usersApiSlice")
  return {
    ...actual,
    useUpdateUserMutation: mocks.useUpdateUserMutation
  }
})

describe("UserForm", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders a loading skeleton when isLoading is true", () => {
    const { container } = renderWithProviders(
      <UserForm user={baseUser} isLoading={true} />,
    )

    // AntD Skeleton uses the `ant-skeleton` class
    expect(container.querySelector(".ant-skeleton")).toBeTruthy()

    // Form inputs should not be present
    expect(screen.queryByLabelText(/user name/i)).not.toBeInTheDocument()
  })

  it("disables Submit and Reset until a field is touched, then enables them", async () => {
    const { user } = renderWithProviders(
      <UserForm user={baseUser} isLoading={false} />,
    )

    const username: HTMLInputElement = screen.getByLabelText(/user name/i)
    const submitBtn = screen.getByRole("button", { name: /submit/i })
    const resetBtn = screen.getByRole("button", { name: /reset/i })

    expect(submitBtn).toBeDisabled()
    expect(resetBtn).toBeDisabled()

    await user.type(username, "X")

    expect(submitBtn).toBeEnabled()
    expect(resetBtn).toBeEnabled()
  })

  it("resets the form to initial values and disables buttons after Reset", async () => {
    const { user } = renderWithProviders(
      <UserForm user={baseUser} isLoading={false} />,
    )

    const username: HTMLInputElement = screen.getByLabelText(/user name/i)
    const submitBtn = screen.getByRole("button", { name: /submit/i })
    const resetBtn = screen.getByRole("button", { name: /reset/i })

    // change value
    await user.clear(username)
    await user.type(username, "NewName")

    expect(submitBtn).toBeEnabled()
    expect(resetBtn).toBeEnabled()
    expect(username.value).toBe("NewName")

    await user.click(resetBtn)

    // original value should be restored
    expect(username.value).toBe(baseUser.username)
    expect(submitBtn).toBeDisabled()
    expect(resetBtn).toBeDisabled()
  })

  it("submits updated values using useUpdateUserMutation with correct args", async () => {
    const { user } = renderWithProviders(
      <UserForm user={baseUser} isLoading={false} />,
    )

    const username = screen.getByLabelText(/user name/i)
    await user.type(username, "_updated")

    await user.click(screen.getByRole("button", { name: /submit/i }))

    expect(mockUpdate).toHaveBeenCalledTimes(1)

    const callArg = mockUpdate.mock.calls[0][0]
    expect(callArg.id).toBe(baseUser.id)
    expect(callArg.body.username).toBe("Bret_updated")
    // sanity check: a few nested fields are preserved in payload
    expect(callArg.body.address.city).toBe(baseUser.address.city)
  })

  it("shows a generic error message when validation fails with multiple errors", async () => {
    const errorSpy = vi
      .spyOn(message, "error")
      .mockResolvedValue(undefined as unknown as void)

    const { user } = renderWithProviders(
      <UserForm user={baseUser} isLoading={false} />,
    )

    // Clear two required fields to trigger multiple validation errors
    await user.clear(screen.getByLabelText(/email/i))
    await user.clear(screen.getByLabelText(/city/i))

    await user.click(screen.getByRole("button", { name: /submit/i }))

    expect(errorSpy).toHaveBeenCalled()
    expect(
      errorSpy.mock.calls.some(args =>
        /please fill all required fields/i.test(String(args[0])),
      ),
    ).toBe(true)

    // Should not call the update mutation when validation fails
    expect(mockUpdate).not.toHaveBeenCalled()
  })

})

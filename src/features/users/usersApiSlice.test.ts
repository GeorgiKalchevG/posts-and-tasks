import type { RootState } from "../../app/store"
import { makeStore } from "../../app/store"
import { selectTodoIds, User, useUpdateUserMutation } from "./usersApiSlice"

describe("usersApiSlice selectTodoIds selector", () => {
  it("returns empty object when getUsers query is missing", () => {
    // Preload store with no queries under userApi
    const preloaded = {
      userApi: {
        queries: {},
      },
    } as Partial<RootState>

    const store = makeStore(preloaded)

    expect(selectTodoIds(store.getState())).toStrictEqual({})
  })

  it("returns empty object when getUsers query is rejected", () => {
    const preloaded = {
      userApi: {
        queries: {
          "getUsers(undefined)": {
            status: "rejected",
            data: [],
          },
        },
      },
    } as unknown as Partial<RootState>

    const store = makeStore(preloaded)

    expect(selectTodoIds(store.getState())).toStrictEqual({})
  })

  it("maps user ids to names when getUsers is fulfilled", () => {
    const users: User[] = [
      {
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
          catchPhrase: "Multi-layered client-server neural-net",
          bs: "harness real-time e-markets",
        },
      },
      {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
        address: {
          street: "Victor Plains",
          suite: "Suite 879",
          city: "Wisokyburgh",
          zipcode: "90566-7771",
          geo: { lat: "-43.9509", lng: "-34.4618" },
        },
        phone: "010-692-6593 x09125",
        website: "anastasia.net",
        company: {
          name: "Deckow-Crist",
          catchPhrase: "Proactive didactic contingency",
          bs: "synergize scalable supply-chains",
        },
      },
    ]

    const preloaded = {
      userApi: {
        queries: {
          "getUsers(undefined)": {
            status: "fulfilled",
            data: users,
          },
        },
      },
    } as unknown as Partial<RootState>

    const store = makeStore(preloaded)
    expect(selectTodoIds(store.getState())).toStrictEqual({
      1: "Leanne Graham",
      2: "Ervin Howell",
    })
  })
})

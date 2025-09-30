// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Task = {
  userId: number
  id: number
  title: string
  completed: boolean
  username?: string
}

// Define a service using a base URL and expected endpoints
export const tasksApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/todos",
  }),
  reducerPath: "tasksApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Tasks"],
  endpoints: build => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getTasks: build.query<Task[], void>({
      query: () => "/",
      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: () => {
        return [{ type: "Tasks" }]
      },
    }),
    updateTask: build.mutation<Task, Task>({
      query: (task) => ({
        url: `/${task.id.toString(10)}`,
        method: "PUT",
        body: task,
      }),

      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApiSlice.util.updateQueryData(
            "getTasks",
            undefined,
            (draft: Task[]) => {
              const index = draft.findIndex(e => e.id === task.id)
              if (index !== -1) {
                draft[index] = task
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()

          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
    }),
  }),
})

export const { useGetTasksQuery, useUpdateTaskMutation } = tasksApiSlice

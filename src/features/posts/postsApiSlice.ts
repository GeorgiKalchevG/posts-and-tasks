// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Post = {
  userId: number
  id: number
  title: string
  body: string
}

// Define a service using a base URL and expected endpoints
export const postsApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/posts",
  }),
  reducerPath: "postsApi",
  // Tag types are used for caching and invalidation.
  tagTypes: ["Posts"],
  endpoints: build => ({
    // Supply generics for the return type (in this case `QuotesApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getPosts: build.query<Post[], number>({
      query: userId => `?userId=${userId.toString()}`,
      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (_result, _error, arg) => {
        return [{ type: "Posts", id: arg }]
      },
    }),
    updatePost: build.mutation<Post, Post>({
      query: post => ({
        url: `/${post.id.toString(10)}`,
        method: "PUT",
        body: post,
      }),
      async onQueryStarted(post, { dispatch, queryFulfilled }) {
        const { id, userId } = post
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData(
            "getPosts",
            userId,
            (draft: Post[]) => {
              const index = draft.findIndex(e => e.id === id)
              if (index !== -1) {
                draft[index] = post
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    deletePost: build.mutation<void, { postId: number; userId: number }>({
      query: ({ postId }) => ({
        url: `/${postId.toString(10)}`,
        method: "DELETE",
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData(
            "getPosts",
            userId,
            (draft: Post[]) => {
              const index = draft.findIndex(e => e.id === postId)
              if (index !== -1) {
                draft.splice(index, 1)
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} = postsApiSlice

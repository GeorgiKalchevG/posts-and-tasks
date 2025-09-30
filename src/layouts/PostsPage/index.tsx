import { useParams } from "react-router"
import { useGetPostsQuery } from "../../features/posts/postsApiSlice.ts"
import { Posts } from "../../features/posts/Posts.tsx"
import { UserForm } from "../../features/users/UserForm.tsx"
import { useGetUsersQuery } from "../../features/users/usersApiSlice.ts"
import { Empty, Typography } from "antd"
import { ErrorPlaceholder } from "../../app/components/ErrorPlaceholder.tsx"

export const PostsPage = () => {
  const { userId } = useParams()
  const {
    existingUser,
    isUserError,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
  } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      existingUser: data?.find(user => user.id === Number(userId)),
      isLoading,
      isUserError: isError,
      isSuccess,
    }),
  })

  const { data, isError, isLoading, isSuccess } = useGetPostsQuery(
    Number(userId),
  )
  if (isUserError) {
    return <ErrorPlaceholder />
  }

  if (!existingUser) {
    return (
      <Empty
        description={
          <Typography.Text>
            Go to <a href="/">Home</a>
          </Typography.Text>
        }
      />
    )
  }
  if (isUserSuccess) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", padding: "40px 0", maxWidth: "600px" }}>
          <UserForm user={existingUser} isLoading={isUserLoading}></UserForm>
        </div>
        {!isError && isSuccess ? (
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <Posts posts={data} isLoading={isLoading} />
          </div>
        ) : (
          <ErrorPlaceholder subtitle={"Sorry, could not load posts"} />
        )}
      </div>
    )
  }
  return null
}

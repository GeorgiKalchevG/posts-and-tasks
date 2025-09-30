import { Users } from "../../features/users/Users.tsx"
import { useGetUsersQuery } from "../../features/users/usersApiSlice.ts"
import { ErrorPlaceholder } from "../../app/components/ErrorPlaceholder.tsx"

export const UsersPage = () => {
  const { data, isError, isLoading, isSuccess } = useGetUsersQuery()
  if (isError) {
    return <ErrorPlaceholder />
  }

  if (isSuccess) {
    return <Users users={data} isLoading={isLoading} />
  }
  return null
}

import { NavLink, useParams } from "react-router"
import styles from "./Navigation.module.scss"
import { useGetUsersQuery } from "../../features/users/usersApiSlice.ts"

export function Navigation() {
  const { userId } = useParams()
  const { existingUser } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      existingUser: data?.find(user => user.id === Number(userId)),
      isLoading,
      isError,
      isSuccess,
    }),
  })
  return (
    <nav className={styles.navBar}>
      <div>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            color: isActive ? "red" : "yellow",
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="/tasks"
          end
          style={({ isActive }) => ({
            color: isActive ? "red" : "yellow",
          })}
        >
          Tasks
        </NavLink>
      </div>
      <div>{existingUser?.name}</div>
    </nav>
  )
}

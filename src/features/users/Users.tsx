import type { JSX } from "react"
import { useMemo } from "react"
import { Button, Collapse } from "antd"
import { UserForm } from "./UserForm.tsx"
import type { User } from "./usersApiSlice.ts"
import { useNavigate } from "react-router"

type UsersProps = {
  users?: User[]
  isLoading: boolean
}

export const Users = ({ users = [], isLoading }: UsersProps): JSX.Element | null => {
  const navigate = useNavigate()
  const items = useMemo(() => {
    const genExtra = (userId: number) => (
      <Button
        onClick={event => {
          event.stopPropagation()
          void navigate(`/posts/${userId.toString(10)}`)
        }}
      >
        See Posts
      </Button>
    )
    return users.map(user => ({
      key: user.id,
      label: user.name,
      children: <UserForm user={user} isLoading={isLoading}/>,
      extra: genExtra(user.id),
    }))
  }, [navigate, users])
  return <Collapse items={items} />
}

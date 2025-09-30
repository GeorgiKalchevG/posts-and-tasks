import { Empty, Typography } from "antd"
import { ErrorPlaceholder } from "../../app/components/ErrorPlaceholder.tsx"
import { TasksTable } from "../../features/tasks/TasksTable.tsx"
import { useGetTasksQuery } from "../../features/tasks/tasksApiSlice.ts"

export const TasksPage = () => {
  const { data, isError, isLoading } = useGetTasksQuery()

  if (isError) {
    return <ErrorPlaceholder />
  }

  if (!data?.length) {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <TasksTable tasks={data} isLoading={isLoading} />
      </div>
    </div>
  )
}

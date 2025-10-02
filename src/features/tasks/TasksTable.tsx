import type { Task } from "./tasksApiSlice.ts"
import { useUpdateTaskMutation } from "./tasksApiSlice.ts"
import type { JSX } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import type {
  InputRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
} from "antd"
import { Button, Input, message, Space, Switch, Table } from "antd"
import type { FilterDropdownProps } from "antd/es/table/interface"
import { SearchOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import { useAppSelector } from "../../app/hooks.ts"
import { selectUserIdToName } from "../users/usersApiSlice.ts"

type DataIndex = keyof Task
type OnChange = NonNullable<TableProps<Task>["onChange"]>
type Filters = Parameters<OnChange>[1]

type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

export const TasksTable = ({
  tasks,
}: {
  tasks: Task[]
}): JSX.Element | null => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})
  const [searchText, setSearchText] = useState("")
  const [searchedColumn, setSearchedColumn] = useState("")
  const searchInput = useRef<InputRef>(null)
  const [update, { error }] = useUpdateTaskMutation()
  const handleChange: OnChange = (_pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter as Sorts)
  }
  useEffect(() => {
    if (error) {
      void message.error("Could not update the task's staus")
    }
  }, [error])
  const ss: Record<number, string> = useAppSelector(selectUserIdToName)
  const memoizedTasks = useMemo(
    () =>
      tasks.map(task => ({
        ...task,
        username:
          ss[task.userId] || `Fallback with UserId ${task.userId.toString(10)}`,
      })),
    [ss, tasks],
  )
  const clearFilters = () => {
    setFilteredInfo({})
  }

  const clearAll = () => {
    setFilteredInfo({})
    setSortedInfo({})
    setSearchedColumn("")
    setSearchText("")
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText("")
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<Task> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={e => {
          e.stopPropagation()
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              if (clearFilters) handleReset(clearFilters)
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      !!record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      },
    },
    render: (text: string | number) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  })
  const onCompletedChange = (task: Task) => (e: boolean) => {
    update({ ...task, completed: e }).catch((e: unknown) => {
      console.error(e)
    })
  }
  const columns: TableColumnsType<Task> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      filteredValue: filteredInfo.title ?? null,
      onFilter: (value, record) => record.title.includes(value as string),
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sortedInfo.columnKey === "title" ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Owner",
      dataIndex: "username",
      key: "username",
      filteredValue: filteredInfo.username ?? null,
      onFilter: (value, record) => {
        const username = record.username ?? ""
        return username.includes(value.toString(10))
      },
      sorter: (a, b) => (a.username ?? "").localeCompare(b.username ?? ""),
      sortOrder: sortedInfo.columnKey === "username" ? sortedInfo.order : null,
      ellipsis: true,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Status",
      dataIndex: "completed",
      key: "completed",
      filters: [
        { text: "Completed", value: true },
        { text: "Pending", value: false },
      ],
      filteredValue: filteredInfo.completed ?? null,
      onFilter: (value, record) => record.completed === value,
      sorter: (a, b) =>
        a.completed === b.completed ? 0 : a.completed ? -1 : 1,
      sortOrder: sortedInfo.columnKey === "completed" ? sortedInfo.order : null,
      ellipsis: true,
      render: (completed: boolean, record) => {
        return (
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Switch
              size="small"
              checked={completed}
              onChange={onCompletedChange(record)}
            />
            {completed ? "Completed" : "Pending"}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table<Task>
        columns={columns}
        dataSource={memoizedTasks}
        onChange={handleChange}
      />
    </div>
  )
}

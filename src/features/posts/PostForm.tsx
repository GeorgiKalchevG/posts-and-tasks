import { Card, Flex, Modal } from "antd"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import type { Post } from "./postsApiSlice.ts"
import { useDeletePostMutation } from "./postsApiSlice.ts"
import type { ReactNode } from "react"
import { useState } from "react"
import { useParams } from "react-router"
import { EditPostModal } from "./EditPostModal.tsx"

export const PostForm = ({
  post,
  isLoading,
}: {
  post: Post
  isLoading: boolean
}) => {
  const { userId } = useParams()

  const [deletePost] = useDeletePostMutation()

  const [open, setOpen] = useState(false)

  const showModal = () => {
    setOpen(true)
  }

  const handleDelete = () => {
    // setOpen(true)
    Modal.confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete the post!",
      cancelText: "No",
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      okText: "Yes, Delete",
      onOk: () => {
        deletePost({ postId: post.id, userId: Number(userId) }).catch(
          (e: unknown) => {
            console.log(e)
          },
        )
      },
    })
  }
  const actions: ReactNode[] = [
    <EditOutlined key="edit" onClick={showModal} />,
    <DeleteOutlined
      key="delete"
      onClick={handleDelete}
      style={{ color: "crimson" }}
    />,
  ]
  return (
    <Flex gap="middle" align="start" vertical>
      <Card loading={isLoading} actions={actions} style={{ width: 600 }}>
        <Card.Meta title={post.title} description={<p>{post.body}</p>} />
      </Card>
      <EditPostModal post={post} isOpen={open} setOpenCallback={setOpen} />
    </Flex>
  )
}

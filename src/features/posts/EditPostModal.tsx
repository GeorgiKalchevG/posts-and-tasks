import { Button, Form, Input, message, Modal, Space } from "antd"
import { useCallback, useEffect, useState } from "react"
import type { Post } from "./postsApiSlice.ts"
import { useUpdatePostMutation } from "./postsApiSlice.ts"

const { TextArea } = Input

export type EditPostModalProps = {
  isOpen: boolean
  setOpenCallback: (arg: boolean) => void
  post: Post
}
export const EditPostModal = ({
  isOpen,
  setOpenCallback,
  post,
}: EditPostModalProps) => {
  const [update] = useUpdatePostMutation()
  const [form] = Form.useForm<Post>()
  const [touched, setTouched] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleCancel = () => {
    form.setFieldsValue(post)
    setOpenCallback(false)
  }
  const handleOk = () => {
    setConfirmLoading(true)
    update(form.getFieldsValue(true) as Post)
      .catch((e: unknown) => {
        console.log(e)
        void message.error("Could not update the post")
      })
      .finally(() => {
        setConfirmLoading(false)
        setOpenCallback(false)
      })
  }
  useEffect(() => {
    form.setFieldsValue(post)
  }, [form, post])

  const handleValuesChange = useCallback(() => {
    const touched: Record<string, unknown> = form.getFieldsValue(
      true,
      ({ touched }) => touched,
    ) as Record<string, unknown>

    setTouched(Object.keys(touched).length > 0)
  }, [form])

  const onFinishFailed = useCallback(
    ({ errorFields }: { errorFields: { errors: string[] }[] }) => {
      const errorMessage = errorFields.map(f => f.errors.join(" "))
      if (errorMessage.length > 1) {
        void message.error("Please fill all required fields")
      } else {
        void message.error(errorMessage[0])
      }
    },
    [],
  )
  const validateMessages = {
    required: "${label} is required!",
  }
  return (
    <Modal
      title="Edit Post"
      open={isOpen}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      footer={() => <></>}
    >
      <Form
        wrapperCol={{ span: 24 }}
        form={form}
        name="control-hooks"
        onFinish={handleOk}
        onValuesChange={handleValuesChange}
        onFinishFailed={onFinishFailed}
        validateMessages={validateMessages}
      >
        <Form.Item name="title" label={"Title"} rules={[{ required: true }]}>
          <Input variant="underlined" />
        </Form.Item>
        <Form.Item
          name="body"
          label={"Content"}
          labelAlign={"right"}
          rules={[{ required: true }]}
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} name={"body"} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={!touched}>
              Update
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

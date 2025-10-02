import type { User } from "./usersApiSlice.ts"
import { useUpdateUserMutation } from "./usersApiSlice.ts"
import { Button, Col, Form, Input, message, Row, Skeleton, Space,  } from "antd"
import { useCallback, useEffect, useState } from "react"

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
}

const tailLayout = {
  wrapperCol: { offset: 12, span: 16 },
}
export const UserForm = ({
  user,
  isLoading,
}: {
  user: User
  isLoading: boolean
}) => {
  const [form] = Form.useForm<User>()

  const [update, { error }] = useUpdateUserMutation()
  
  const [touched, setTouched] = useState(false)
  useEffect(() => {
    form.setFieldsValue(user)
  }, [user, form])
  useEffect(() => {
    if (error) {
      void message.error("Could not update user details")
    }
  }, [error])

  const onFinish = () => {
    update({ body: form.getFieldsValue(true) as User, id: user.id }).catch(
      (e: unknown) => {
        console.log(e)
      },
    )
  }
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
  const onReset = () => {
    form.setFieldsValue(user)
    setTouched(false)
  }

  const handleValuesChange = useCallback(() => {
    const touched: Record<string, unknown> = form.getFieldsValue(
      true,
      ({ touched }) => touched,
    ) as Record<string, unknown>

    setTouched(Object.keys(touched).length > 0)
  }, [form])

  const validateMessages = {
    required: "'${label}' is required!",
  }
  if (isLoading) {
    return <Skeleton />
  }

  return (
    <Form
      {...layout}
      layout={"vertical"}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
      validateMessages={validateMessages}
      onFinishFailed={onFinishFailed}
    >
      <Row wrap justify={"space-evenly"}>
        <Col span={10}>
          <Form.Item
            name="username"
            label="User Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={10} offset={4}>
          <Form.Item name={["company", "name"]} label="Company Name">
            <Input />
          </Form.Item>
          <Form.Item name={["company", "catchPhrase"]} label="Catch Phrase">
            <Input />
          </Form.Item>
          <Form.Item name={["company", "bs"]} label="BS">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row wrap justify={"space-evenly"}>
        <Col span={10}>
          <Form.Item
            name={["address", "city"]}
            label="City"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            label="Street"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["address", "suite"]}
            label="Suite"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={10} offset={4}>
          <Form.Item name={["address", "zipcode"]} label="Zip Code">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit" disabled={!touched}>
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset} disabled={!touched}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

import { Outlet } from "react-router"
import { Flex, Layout } from "antd"
import { Navigation } from "./Navigation.tsx"

const { Header, Content } = Layout
export const AppLayout = () => {
  return (
    <Flex vertical>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            color: "yellow",
          }}
        >
          <Navigation />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Flex>
  )
}

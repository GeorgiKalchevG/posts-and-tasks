import { useNavigate } from "react-router"
import { Button, Result } from "antd"

const Page404 = () => {
  const navigate = useNavigate()
  const navigateHome = () => {
    void navigate("/")
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={navigateHome}>
          Back Home
        </Button>
      }
    />
  )
}

export default Page404

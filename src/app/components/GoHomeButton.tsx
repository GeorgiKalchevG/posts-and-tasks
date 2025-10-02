import { Button } from "antd"
import { useNavigate } from "react-router"

export const GoHomeButton = () => {
  const navigate = useNavigate()
  const goHome = () => {
    void navigate("/")
  }
  return (
    <Button type="primary" onClick={goHome}>
      Try going to home page
    </Button>
  )
}

export default GoHomeButton

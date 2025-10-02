import { Result } from "antd"

export const ErrorPlaceholder = ({
  subtitle = "Sorry, something went wrong.",
}) => {
  return <Result status="500" subTitle={subtitle} />
}

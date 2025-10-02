import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { App } from "./App"
import { App as AntdApp, Result } from "antd"
import { store } from "./app/store"
import "./index.css"
import { BrowserRouter } from "react-router"
import "@ant-design/v5-patch-for-react-19"
import { ErrorBoundary } from "./ErrorBoundery.tsx"
import GoHomeButton from "./app/components/GoHomeButton.tsx"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary
          fallback={
            <Result
              status="error"
              subTitle={"Something went really wrong"}
              extra={<GoHomeButton />}
            />
          }
        >
          <Provider store={store}>
            <AntdApp>
              <App />
            </AntdApp>
          </Provider>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}

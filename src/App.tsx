import "./App.css"
import { Route, Routes } from "react-router"
import { AppLayout } from "./layouts/AppLayout"
import { UsersPage } from "./layouts/UsersPage"
import { PostsPage } from "./layouts/PostsPage"
import Page404 from "./layouts/404.tsx"
import { TasksPage } from "./layouts/TasksPage"

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<UsersPage />} />
      <Route path="posts">
        <Route path={":userId"} element={<PostsPage />} />
      </Route>
      <Route path="tasks" element={<TasksPage />} />
      <Route path="*" element={<Page404 />}></Route>
    </Route>

    <Route path="projects">
      {/*<Route index element={<ProjectsHome />} />*/}
      {/*<Route element={<ProjectsLayout />}>*/}
      {/*  <Route path=":pid" element={<Project />} />*/}
      {/*  <Route path=":pid/edit" element={<EditProject />} />*/}
      {/*</Route>*/}
    </Route>
  </Routes>
)

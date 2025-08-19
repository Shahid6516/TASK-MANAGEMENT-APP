import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './component/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import TaskListPage from './pages/TaskListPage.jsx'
import ShowTask from './pages/ShowTask.jsx'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path='/task-list' element={<TaskListPage />} />
            <Route path='/show-task/:taskid' element={<ShowTask />} />


          </Route>
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
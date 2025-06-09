import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectSelection from './features/ProjectSelection/projectSelection'
// import AuthPage from './Views/AuthPage/authPage'



function App() {
  // Example function to determine which route to show


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProjectSelection />}
        />
      </Routes>
    </Router>
  )
}

export default App

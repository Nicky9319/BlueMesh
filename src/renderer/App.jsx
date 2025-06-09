import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ProjectSelection from './features/ProjectSelection/projectSelection'
import Dashboard from './features/Dashboard/dashboard'



function App() {
  // Example function to determine which route to show


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProjectSelection />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </Router>
  )
}

export default App

import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../store/store'
import AppEventListener from './AppEventListener'
import ProjectSelection from './features/ProjectSelection/projectSelection'
import Dashboard from './features/Dashboard/dashboard'




function App() {
  // Example function to determine which route to show


  return (
    <Provider store={store}>
      <AppEventListener />
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
    </Provider>
  )
}

export default App

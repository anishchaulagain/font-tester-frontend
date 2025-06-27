
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import FontTesterLanding from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './_components/Auth/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import TestHomepage from './pages/TestHomepage'
import AuthPage from './pages/AuthPage'




function App() {
 

 const {isAuthenticated} = useAuth()
  return (
    <>
    <Routes>
      <Route path="/" element={<FontTesterLanding />} />
      <Route path="/homepage" element={<TestHomepage/>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminPage/></ProtectedRoute>} />
       <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/admin-dashboard" replace />
          ) : (
            <AuthPage />
          )
        }
      />

    </Routes>
      
    </>
  )
}

export default App

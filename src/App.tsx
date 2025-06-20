
import { Route, Routes } from 'react-router-dom'
import './App.css'
import FontTesterLanding from './pages/LandingPage'
import Homepage from './pages/HomePage'

function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<FontTesterLanding />} />
      <Route path="/homepage" element={<Homepage />} />

    </Routes>
      
    </>
  )
}

export default App

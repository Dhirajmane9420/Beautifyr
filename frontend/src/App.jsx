import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BestSellers from './pages/BestSellers'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/best-sellers" element={<BestSellers />} />
    </Routes>
  )
}

export default App
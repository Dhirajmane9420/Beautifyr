import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BestSellers from './pages/BestSellers'
import NewArrivals from './pages/NewArrivals'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/best-sellers" element={<BestSellers />} />
      <Route path="/new-arrivals" element={<NewArrivals />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
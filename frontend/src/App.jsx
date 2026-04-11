import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import BestSellers from './pages/BestSellers'
import NewArrivals from './pages/NewArrivals'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Categories from './pages/Categories'
import CategoryViewAll from './pages/CategoryViewAll'
import Wishlist from './pages/Wishlist'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/view-all" element={<CategoryViewAll />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
